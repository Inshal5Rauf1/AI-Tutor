
import React from 'react';

interface TextInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
}

const TextInputArea: React.FC<TextInputAreaProps> = ({ value, onChange, onAnalyze }) => {
  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg border border-slate-700 p-1">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste any English text here to get started..."
        className="w-full flex-grow p-3 bg-transparent rounded-t-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none text-slate-300 placeholder-slate-500"
        rows={15}
      />
      <div className="p-2 border-t border-slate-700">
        <button
          onClick={onAnalyze}
          className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
          disabled={!value.trim()}
        >
          Analyze Text
        </button>
      </div>
    </div>
  );
};

export default TextInputArea;
