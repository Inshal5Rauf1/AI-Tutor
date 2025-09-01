
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-400"></div>
      <p className="text-slate-400">AI is thinking...</p>
    </div>
  );
};

export default Loader;
