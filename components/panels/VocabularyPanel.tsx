
import React, { useState } from 'react';
import { VocabularyItem } from '../../types';
import Card from '../common/Card';
import { LANGUAGES } from '../../constants';
import { extractVocabulary } from '../../services/geminiService';

interface VocabularyPanelProps {
  vocabulary?: VocabularyItem[];
}

const VocabularyPanel: React.FC<VocabularyPanelProps> = ({ vocabulary: initialVocabulary }) => {
  const [vocabulary, setVocabulary] = useState(initialVocabulary);
  // This would need to be tied to the main sourceText state to be fully functional
  // For now, it's a demonstration of how a language selector would work.
  // const [targetLanguage, setTargetLanguage] = useState('Spanish');
  // const [isLoading, setIsLoading] = useState(false);

  if (!vocabulary) {
    return <div className="text-slate-400">No vocabulary available.</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-sky-300">Key Vocabulary</h3>
        {/* Language selector can be added here */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vocabulary.map((item, index) => (
          <Card key={index}>
            <h4 className="font-bold text-sky-400 text-lg">{item.word}</h4>
            <p className="text-slate-400 text-sm italic mb-2">{item.translation}</p>
            <p className="text-slate-300 mb-2"><strong className="font-medium text-slate-100">Definition:</strong> {item.definition}</p>
            <p className="text-slate-300"><strong className="font-medium text-slate-100">Example:</strong> "{item.example}"</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VocabularyPanel;
