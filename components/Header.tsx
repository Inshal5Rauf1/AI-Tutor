
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-sky-400">
              AI English Tutor
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
