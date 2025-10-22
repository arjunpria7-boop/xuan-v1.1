/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { UploadIcon, MagicWandIcon, PaletteIcon, SunIcon } from './icons';

interface StartScreenProps {
  onFileSelect: (files: FileList | null) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onFileSelect }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Efek untuk mencabut URL objek saat komponen dilepas
  // atau saat URL pratinjau baru dibuat, untuk mencegah kebocoran memori.
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFiles = (files: FileList | null) => {
    // Jika ada pratinjau yang ada, cabut sebelum membuat yang baru.
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    if (files && files[0]) {
      const file = files[0];
      setPreviewUrl(URL.createObjectURL(file));
      onFileSelect(files);
    } else {
      setPreviewUrl(null);
      onFileSelect(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div 
      className={`w-full max-w-5xl mx-auto text-center p-8 transition-all duration-300 rounded-2xl border-2 ${isDraggingOver ? 'bg-red-500/10 border-dashed border-red-400' : 'border-transparent'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <svg
          className="title-loader w-full max-w-2xl"
          viewBox="0 0 500 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">MediaTama</text>
        </svg>

        <p className="max-w-2xl text-lg text-gray-400 md:text-xl">
          Retus foto, terapkan filter kreatif, atau buat penyesuaian profesional menggunakan perintah teks sederhana. Tidak perlu alat yang rumit.
        </p>

        <div className="mt-6 flex flex-col items-center gap-4">
            <label htmlFor="image-upload-start" className="relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-red-600 rounded-full cursor-pointer group hover:bg-red-500 transition-colors">
                <UploadIcon className="w-6 h-6 mr-3 transition-transform duration-500 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110" />
                Unggah Gambar
            </label>
            <input id="image-upload-start" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            <p className="text-sm text-gray-500">atau seret dan lepas file</p>
        </div>

        {previewUrl && (
          <div className="mt-6 animate-fade-in">
            <p className="text-sm text-gray-400 mb-2">Pratinjau:</p>
            <img 
              src={previewUrl} 
              alt="Pratinjau gambar yang diunggah" 
              className="max-h-40 rounded-lg shadow-xl border-2 border-gray-700/50" 
            />
          </div>
        )}

        <div className="mt-16 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <MagicWandIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">Retus Presisi</h3>
                    <p className="mt-2 text-gray-400">Klik titik mana pun pada gambar Anda untuk menghilangkan noda, mengubah warna, atau menambahkan elemen dengan akurasi tinggi.</p>
                </div>
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <PaletteIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">Filter Kreatif</h3>
                    <p className="mt-2 text-gray-400">Ubah foto dengan gaya artistik. Dari tampilan vintage hingga pendar futuristik, temukan atau buat filter yang sempurna.</p>
                </div>
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <SunIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">Penyesuaian Pro</h3>
                    <p className="mt-2 text-gray-400">Tingkatkan pencahayaan, buramkan latar belakang, atau ubah suasana. Dapatkan hasil berkualitas studio tanpa alat yang rumit.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default StartScreen;