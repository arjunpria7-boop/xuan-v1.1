/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { KeyIcon } from './icons';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624l-.219.874-.219-.874a1.5 1.5 0 00-1.023-1.023l-.874-.219.874-.219a1.5 1.5 0 001.023-1.023l.219-.874.219.874a1.5 1.5 0 001.023 1.023l.874.219-.874.219a1.5 1.5 0 00-1.023 1.023z" />
  </svg>
);

const Header: React.FC<{ onApiKeyClick: () => void }> = ({ onApiKeyClick }) => {
  return (
    <header className="w-full py-4 px-4 sm:px-8 border-b border-gray-700 bg-gray-800/30 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-between">
      <div className="flex-1"></div>
      <div className="flex items-center justify-center gap-3">
          <SparkleIcon className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-bold tracking-tight text-gray-100">
            MediaTama
          </h1>
      </div>
      <div className="flex-1 flex justify-end">
        <button
          onClick={onApiKeyClick}
          className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors"
          aria-label="Atur Kunci API"
        >
          <KeyIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Kunci API</span>
        </button>
      </div>
    </header>
  );
};

export default Header;