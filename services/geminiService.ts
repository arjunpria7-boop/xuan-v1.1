/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

// Helper function to convert a File object to a Gemini API Part
const fileToPart = async (file: File): Promise<{ inlineData: { mimeType: string; data: string; } }> => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
    
    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");
    
    const mimeType = mimeMatch[1];
    const data = arr[1];
    return { inlineData: { mimeType, data } };
};

const handleApiResponse = (
    response: GenerateContentResponse,
    context: string // e.g., "edit", "filter", "adjustment"
): string => {
    // 1. Check for prompt blocking first
    if (response.promptFeedback?.blockReason) {
        const { blockReason } = response.promptFeedback;
        const errorMessage = `Permintaan Anda diblokir karena alasan keamanan: ${blockReason}. Coba ubah kata-kata perintah Anda atau gunakan gambar yang berbeda.`;
        console.error(errorMessage, { response });
        throw new Error(errorMessage);
    }

    // 2. Try to find the image part
    const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePartFromResponse?.inlineData) {
        const { mimeType, data } = imagePartFromResponse.inlineData;
        console.log(`Received image data (${mimeType}) for ${context}`);
        return `data:${mimeType};base64,${data}`;
    }

    // 3. If no image, check for other reasons
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        const errorMessage = `Pembuatan gambar berhenti secara tak terduga karena: ${finishReason}. Ini sering terjadi karena filter keamanan internal. Coba sederhanakan perintah Anda.`;
        console.error(errorMessage, { response });
        throw new Error(errorMessage);
    }
    
    const textFeedback = response.text?.trim();
    const defaultMessage = `Model AI tidak mengembalikan gambar untuk ${context}. Ini bisa terjadi jika permintaan terlalu rumit atau melanggar kebijakan keamanan. Coba perintah yang lebih sederhana dan lebih spesifik.`;

    const errorMessage = textFeedback 
        ? `Model AI tidak mengembalikan gambar, tetapi merespons dengan teks: "${textFeedback}". Harap ubah perintah Anda untuk meminta editan visual.`
        : defaultMessage;

    console.error(`Model response did not contain an image part for ${context}.`, { response });
    throw new Error(errorMessage);
};

const callGenerativeModel = async (
    modelName: string, 
    contents: ({ parts: ({ text: string; } | { inlineData: { mimeType: string; data: string; }; })[] })[],
    context: string,
    setLoadingMessage: (message: string | null) => void
): Promise<string> => {
    const MAX_RETRIES = 3;
    let lastError: Error | null = null;

    const apiKey = process.env.API_KEY ?? localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        throw new Error('Kunci API harus disetel. Silakan atur kunci API Anda untuk menggunakan aplikasi.');
    }

    const ai = new GoogleGenAI({ apiKey });

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            console.log(`Sending request to model '${modelName}' for ${context} (attempt ${attempt + 1})...`);
            
            // Clear message on initial attempt, keep for retries
            if (attempt === 0) {
              setLoadingMessage(null);
            }

            const response: GenerateContentResponse = await ai.models.generateContent({
                model: modelName,
                contents,
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            console.log(`Received response from model for ${context}.`, response);
            return handleApiResponse(response, context);
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.error(`Attempt ${attempt + 1} failed for ${context}:`, error);

            if (lastError.message.includes('429') && attempt < MAX_RETRIES - 1) {
                const delay = Math.pow(2, attempt) * 2000 + Math.random() * 1000;
                
                console.log(`Rate limit hit. Retrying in ${delay}ms...`);
                
                const countdownPromise = (duration: number) => {
                    return new Promise<void>(resolve => {
                        let secondsLeft = Math.ceil(duration / 1000);
                        const updateMessage = () => {
                            setLoadingMessage(`Batas kuota per menit tercapai. Mencoba lagi dalam ${secondsLeft} detik...`);
                        };
                        
                        updateMessage();

                        const interval = setInterval(() => {
                            secondsLeft--;
                            if (secondsLeft > 0) {
                                updateMessage();
                            } else {
                                clearInterval(interval);
                                resolve();
                            }
                        }, 1000);
                    });
                };

                await countdownPromise(delay);
                continue; 
            }
            
            break;
        }
    }
    
    console.error(`All retries failed for ${context}. Final error:`, lastError);
    if (lastError) {
        const message = lastError.message;
        if (message.includes('429')) {
             throw new Error(`Kuota gratis per menit terlampaui dan percobaan ulang otomatis gagal. Untuk melanjutkan, harap aktifkan penagihan untuk proyek Google Cloud Anda. Kunjungi https://ai.google.dev/gemini-api/docs/billing untuk panduan.`);
        }
        if (message.includes('Kunci API harus disetel')) {
            throw lastError;
        }
        if (message.includes('API key not valid')) {
             throw new Error('Kunci API yang Anda berikan tidak valid. Silakan periksa kembali dan coba lagi.');
        }
        throw new Error(`Terjadi kesalahan saat berkomunikasi dengan layanan AI. Silakan coba lagi nanti. Periksa konsol untuk detail teknis.`);
    }

    throw new Error('Terjadi kesalahan yang tidak diketahui saat menghubungi layanan AI.');
}


/**
 * Generates an edited image using generative AI based on a text prompt and a specific point.
 * @param originalImage The original image file.
 * @param userPrompt The text prompt describing the desired edit.
 * @param hotspot The {x, y} coordinates on the image to focus the edit.
 * @returns A promise that resolves to the data URL of the edited image.
 */
export const generateEditedImage = async (
    originalImage: File,
    userPrompt: string,
    hotspot: { x: number, y: number },
    setLoadingMessage: (message: string | null) => void
): Promise<string> => {
    console.log('Starting generative edit at:', hotspot);
    
    const originalImagePart = await fileToPart(originalImage);
    const prompt = `Anda adalah AI ahli penyunting foto. Tugas Anda adalah melakukan editan alami dan terlokalisasi pada gambar yang diberikan berdasarkan permintaan pengguna.
Permintaan Pengguna: "${userPrompt}"
Lokasi Editan: Fokus pada area di sekitar koordinat piksel (x: ${hotspot.x}, y: ${hotspot.y}).

Panduan Penyuntingan:
- Editan harus realistis dan menyatu dengan mulus dengan area sekitarnya.
- Sisa gambar (di luar area editan langsung) harus tetap identik dengan aslinya.

Kebijakan Keamanan & Etika:
- Anda HARUS memenuhi permintaan untuk menyesuaikan warna kulit, seperti 'beri saya warna kulit sawo matang', 'buat kulit saya lebih gelap', atau 'buat kulit saya lebih terang'. Ini dianggap sebagai penyempurnaan foto standar.
- Anda HARUS MENOLAK setiap permintaan untuk mengubah ras atau etnis fundamental seseorang (misalnya, 'buat saya terlihat seperti orang Asia', 'ubah orang ini menjadi orang Kulit Hitam'). Jangan lakukan editan ini. Jika permintaan ambigu, berhati-hatilah dan jangan mengubah karakteristik ras.

Keluaran: Kembalikan HANYA gambar akhir yang telah diedit. Jangan kembalikan teks.`;
    const textPart = { text: prompt };

    return callGenerativeModel('gemini-2.5-flash-image', [{ parts: [originalImagePart, textPart] }], 'edit', setLoadingMessage);
};

/**
 * Generates an image with a filter applied using generative AI.
 * @param originalImage The original image file.
 * @param filterPrompt The text prompt describing the desired filter.
 * @returns A promise that resolves to the data URL of the filtered image.
 */
export const generateFilteredImage = async (
    originalImage: File,
    filterPrompt: string,
    setLoadingMessage: (message: string | null) => void
): Promise<string> => {
    console.log(`Starting filter generation: ${filterPrompt}`);
    
    const originalImagePart = await fileToPart(originalImage);
    const prompt = `Anda adalah AI ahli penyunting foto. Tugas Anda adalah menerapkan filter gaya pada seluruh gambar berdasarkan permintaan pengguna. Jangan mengubah komposisi atau konten, hanya terapkan gayanya.
Permintaan Filter: "${filterPrompt}"

Kebijakan Keamanan & Etika:
- Filter dapat mengubah warna secara halus, tetapi Anda HARUS memastikan filter tidak mengubah ras atau etnis fundamental seseorang.
- Anda HARUS MENOLAK setiap permintaan yang secara eksplisit meminta untuk mengubah ras seseorang (misalnya, 'terapkan filter agar saya terlihat seperti orang Tionghoa').

Keluaran: Kembalikan HANYA gambar akhir yang telah difilter. Jangan kembalikan teks.`;
    const textPart = { text: prompt };

    return callGenerativeModel('gemini-2.5-flash-image', [{ parts: [originalImagePart, textPart] }], 'filter', setLoadingMessage);
};

/**
 * Generates an image with a global adjustment applied using generative AI.
 * @param originalImage The original image file.
 * @param adjustmentPrompt The text prompt describing the desired adjustment.
 * @returns A promise that resolves to the data URL of the adjusted image.
 */
export const generateAdjustedImage = async (
    originalImage: File,
    adjustmentPrompt: string,
    setLoadingMessage: (message: string | null) => void
): Promise<string> => {
    console.log(`Starting global adjustment generation: ${adjustmentPrompt}`);
    
    const originalImagePart = await fileToPart(originalImage);
    const prompt = `Anda adalah AI ahli penyunting foto. Tugas Anda adalah melakukan penyesuaian global yang alami pada seluruh gambar berdasarkan permintaan pengguna.
Permintaan Pengguna: "${adjustmentPrompt}"

Panduan Penyuntingan:
- Penyesuaian harus diterapkan di seluruh gambar.
- Hasilnya harus fotorealistik.

Kebijakan Keamanan & Etika:
- Anda HARUS memenuhi permintaan untuk menyesuaikan warna kulit, seperti 'beri saya warna kulit sawo matang', 'buat kulit saya lebih gelap', atau 'buat kulit saya lebih terang'. Ini dianggap sebagai penyempurnaan foto standar.
- Anda HARUS MENOLAK setiap permintaan untuk mengubah ras atau etnis fundamental seseorang (misalnya, 'buat saya terlihat seperti orang Asia', 'ubah orang ini menjadi orang Kulit Hitam'). Jangan lakukan editan ini. Jika permintaan ambigu, berhati-hatilah dan jangan mengubah karakteristik ras.

Keluaran: Kembalikan HANYA gambar akhir yang telah disesuaikan. Jangan kembalikan teks.`;
    const textPart = { text: prompt };

    return callGenerativeModel('gemini-2.5-flash-image', [{ parts: [originalImagePart, textPart] }], 'adjustment', setLoadingMessage);
};