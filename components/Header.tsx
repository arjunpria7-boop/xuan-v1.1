/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { KeyIcon } from './icons';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

export type ApiStatus = 'ready' | 'rate-limited' | 'error';

interface HeaderProps {
  onOpenApiKeyModal: () => void;
  apiStatus: ApiStatus;
}

const ApiStatusIndicator: React.FC<{ status: ApiStatus }> = ({ status }) => {
  const statusConfig = {
    ready: { text: 'API Siap', color: 'bg-green-500', textColor: 'text-green-300' },
    'rate-limited': { text: 'Batas Kuota', color: 'bg-yellow-500', textColor: 'text-yellow-300' },
    error: { text: 'Error', color: 'bg-red-500', textColor: 'text-red-300' },
  };

  const { text, color, textColor } = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 bg-gray-800/50 border border-gray-700/60 rounded-full px-3 py-1.5 text-sm font-medium ${textColor}`}>
      <div className={`w-3 h-3 rounded-full ${color} animate-pulse`}></div>
      <span className="hidden sm:inline">{text}</span>
    </div>
  );
};


const Header: React.FC<HeaderProps> = ({ onOpenApiKeyModal, apiStatus }) => {
  return (
    <header className="w-full p-4 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <SparkleIcon className="w-8 h-8 text-pink-400" />
        <h1 className="text-2xl font-bold text-gray-100 tracking-tight">MediaTama AI Editor</h1>
      </div>
      <div className="flex items-center gap-3">
        <ApiStatusIndicator status={apiStatus} />
        <button
          onClick={onOpenApiKeyModal}
          className="flex items-center gap-2 bg-white/10 border border-white/20 text-gray-200 font-semibold py-2 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-white/20 hover:border-white/30 active:scale-95 text-base"
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