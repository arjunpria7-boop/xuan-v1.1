/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { KeyIcon } from './icons';

interface ApiKeyModalProps {
  onClose: () => void;
  onSave: (key: string) => void;
  initialError?: string | null;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onSave, initialError }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(initialError ?? null);

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    } else {
      setError("Kunci API tidak boleh kosong.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-lg w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-full border-2 border-purple-500/20">
             <KeyIcon className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100">Atur Kunci API Gemini Anda</h2>
          <p className="text-md text-gray-400">
            Untuk menggunakan aplikasi ini, Anda perlu memberikan kunci API Google Gemini Anda. Kunci Anda akan disimpan di browser Anda dan tidak akan dibagikan.
          </p>
          <div className="text-left text-sm text-gray-500 bg-gray-900/50 p-3 rounded-lg border border-gray-700 mt-2 w-full">
            <h4 className="font-semibold text-gray-400 mb-1">Tentang Kuota API</h4>
            <p>Google Gemini menggunakan batas permintaan per menit (RPM), bukan total kuota bulanan. Karena itu, sisa kuota tidak dapat ditampilkan. Jika batas tercapai, aplikasi ini akan secara otomatis menunggu dan mencoba lagi untuk Anda.</p>
          </div>
          {error && <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded-md mt-2">{error}</p>}
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
                setApiKey(e.target.value);
                if (error) setError(null);
            }}
            placeholder="Tempelkan kunci API Anda di sini"
            className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-4 text-center text-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition mt-2"
          />
          <button 
            onClick={handleSave}
            className="w-full bg-gradient-to-br from-red-600 to-pink-500 text-white font-bold py-4 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!apiKey.trim()}
          >
            Simpan Kunci & Lanjutkan
          </button>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-300 transition-colors mt-2">
            Dapatkan kunci API dari Google AI Studio &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;