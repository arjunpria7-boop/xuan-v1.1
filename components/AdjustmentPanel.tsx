/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface AdjustmentPanelProps {
  onApplyAdjustment: (prompt: string) => void;
  isLoading: boolean;
}

const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({ onApplyAdjustment, isLoading }) => {
  const [selectedPresetPrompt, setSelectedPresetPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const presets = [
    { name: 'Buramkan Latar', prompt: 'Terapkan efek depth-of-field yang realistis, membuat latar belakang menjadi buram sambil menjaga subjek utama tetap fokus tajam.' },
    { name: 'Tingkatkan Detail', prompt: 'Tingkatkan sedikit ketajaman dan detail gambar tanpa membuatnya terlihat tidak alami.' },
    { name: 'Pencahayaan Hangat', prompt: 'Sesuaikan suhu warna untuk memberikan pencahayaan gaya golden-hour yang lebih hangat pada gambar.' },
    { name: 'Lampu Studio', prompt: 'Tambahkan pencahayaan studio profesional yang dramatis ke subjek utama.' },
  ];

  const activePrompt = selectedPresetPrompt || customPrompt;

  const handlePresetClick = (prompt: string) => {
    setSelectedPresetPrompt(prompt);
    setCustomPrompt('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPrompt(e.target.value);
    setSelectedPresetPrompt(null);
  };

  const handleApply = () => {
    if (activePrompt) {
      onApplyAdjustment(activePrompt);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300">Terapkan Penyesuaian Profesional</h3>
      <p className="text-sm text-center text-gray-400 -mt-2">Mulai dengan preset atau jelaskan penyesuaian kustom Anda di bawah ini.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset.prompt)}
            disabled={isLoading}
            className={`w-full text-center bg-white/10 border border-transparent text-gray-200 font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-white/20 hover:border-white/20 active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed ${selectedPresetPrompt === preset.prompt ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-pink-500' : ''}`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={customPrompt}
        onChange={handleCustomChange}
        placeholder="Atau deskripsikan penyesuaian (contoh: 'ubah latar belakang menjadi hutan')"
        className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-pink-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
        disabled={isLoading}
      />

      {activePrompt && (
        <div className="animate-fade-in flex flex-col gap-4 pt-2">
            <button
                onClick={handleApply}
                className="w-full bg-gradient-to-br from-red-600 to-pink-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-red-800 disabled:to-pink-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !activePrompt.trim()}
            >
                Terapkan Penyesuaian
            </button>
        </div>
      )}
    </div>
  );
};

export default AdjustmentPanel;