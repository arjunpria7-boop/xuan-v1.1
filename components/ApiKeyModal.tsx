/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface ApiKeyModalProps {
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      onClose();
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in"
        onClick={onClose}
    >
        <div 
            className="bg-gray-800 border border-gray-700 rounded-lg p-8 w-full max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Atur Kunci API Gemini Anda</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                  aria-label="Tutup modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <p className="text-gray-400 mb-6">
                Untuk menggunakan aplikasi ini, Anda memerlukan Kunci API Google Gemini Anda sendiri. Simpan kunci Anda dengan aman. Kunci ini hanya akan disimpan di browser Anda dan tidak pernah dikirim ke server kami.
            </p>
            <div className="flex flex-col gap-4">
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Masukkan Kunci API Google Gemini Anda"
                    className="flex-grow bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-pink-500 focus:outline-none transition w-full text-base"
                />
                <button
                    onClick={handleSave}
                    disabled={!apiKey.trim()}
                    className="w-full bg-gradient-to-br from-red-600 to-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                >
                    Simpan Kunci
                </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
                Anda bisa mendapatkan kunci dari <a href="https://aistudio.google.com/keys" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Google AI Studio</a>.
            </p>
        </div>
    </div>
  );
};

export default ApiKeyModal;