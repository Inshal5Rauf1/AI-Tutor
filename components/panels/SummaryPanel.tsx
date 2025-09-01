
import React from 'react';

interface SummaryPanelProps {
  summary?: string;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ summary }) => {
  if (!summary) {
    return <div className="text-slate-400">No summary available.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-sky-300">Text Summary</h3>
      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
        {summary}
      </p>
    </div>
  );
};

export default SummaryPanel;
