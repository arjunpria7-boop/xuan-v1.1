/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

// FIX: The original file was truncated, missing the Header component and its export.
// This completes the file and adds the default export to resolve the "no default export" error.
const Header: React.FC = () => {
  return (
    <header className="w-full p-4 flex justify-center items-center bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <SparkleIcon className="w-8 h-8 text-pink-400" />
        <h1 className="text-2xl font-bold text-gray-100 tracking-tight">MediaTama AI Editor</h1>
      </div>
    </header>
  );
};

export default Header;
