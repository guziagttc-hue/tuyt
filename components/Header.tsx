
import React from 'react';
import { VibeLogo } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-transparent">
      <div className="flex items-center">
        <VibeLogo />
        <h1 className="text-2xl font-bold tracking-wider">VIBE</h1>
      </div>
      <button className="flex items-center bg-black/30 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20 hover:border-cyan-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1h14V3a1 1 0 00-1-1H5zM3 6h14v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm2 4a1 1 0 011-1h6a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        AR Filter Studio
      </button>
    </header>
  );
};

export default Header;
