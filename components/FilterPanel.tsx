/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface FilterPanelProps {
  onApplyFilter: (prompt: string) => void;
  isLoading: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilter, isLoading }) => {
  const [selectedPresetPrompt, setSelectedPresetPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const presets = [
    { name: 'Synthwave', prompt: 'Terapkan estetika synthwave 80-an yang cerah dengan pendar magenta dan cyan neon, serta garis pindaian halus.' },
    { name: 'Anime', prompt: 'Berikan gambar gaya anime Jepang yang cerah, dengan garis luar tebal, cel-shading, dan warna jenuh.' },
    { name: 'Lomo', prompt: 'Terapkan efek film cross-processing gaya Lomography dengan kontras tinggi, warna yang terlalu jenuh, dan vignetting gelap.' },
    { name: 'Glitch', prompt: 'Ubah gambar menjadi proyeksi holografik futuristik dengan efek glitch digital dan aberasi kromatik.' },
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
      onApplyFilter(activePrompt);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300">Terapkan Filter</h3>
      <p className="text-sm text-center text-gray-400 -mt-2">Mulai dengan preset atau jelaskan filter kustom Anda di bawah ini.</p>
      
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
        placeholder="Atau deskripsikan filter kustom (contoh: 'pendar synthwave 80-an')"
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
            Terapkan Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;