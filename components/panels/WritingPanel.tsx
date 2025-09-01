
import React, { useState } from 'react';
import { WritingFeedback } from '../../types';
import { checkGrammar } from '../../services/geminiService';
import Loader from '../common/Loader';
import Card from '../common/Card';

const WritingPanel: React.FC = () => {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please write something to get feedback.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const result = await checkGrammar(text);
      setFeedback(result);
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong while getting feedback.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-sky-300">Writing Practice</h3>
      <p className="text-slate-400">Write a few sentences related to the text you provided, or any topic, and get instant feedback.</p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing here..."
        className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y text-slate-300 placeholder-slate-500"
        rows={6}
        disabled={isLoading}
      />
      
      <button
        onClick={handleSubmit}
        disabled={isLoading || !text.trim()}
        className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Getting Feedback...' : 'Get Feedback'}
      </button>

      {error && <p className="text-red-400">{error}</p>}
      
      {isLoading && <div className="flex justify-center"><Loader /></div>}

      {feedback && (
        <div className="space-y-4">
          <Card>
            <h4 className="font-semibold text-green-400 mb-2">Corrected Version</h4>
            <p className="text-slate-300 whitespace-pre-wrap">{feedback.correctedText}</p>
          </Card>
          
          <Card>
            <h4 className="font-semibold text-yellow-400 mb-2">Explanations</h4>
            <ul className="space-y-3">
              {feedback.explanations.map((exp, index) => (
                <li key={index} className="border-b border-slate-700 pb-3 last:border-b-0">
                   <p className="text-slate-400">Original: "<span className="text-red-400 italic">{exp.original}</span>"</p>
                   <p className="text-slate-400">Correction: "<span className="text-green-400 italic">{exp.correction}</span>"</p>
                   <p className="text-slate-300 mt-1"><strong>Reason:</strong> {exp.reason}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WritingPanel;
