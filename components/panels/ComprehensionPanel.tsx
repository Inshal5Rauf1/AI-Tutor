
import React, { useState } from 'react';
import { ComprehensionQuestion } from '../../types';
import Card from '../common/Card';

interface ComprehensionPanelProps {
  questions?: ComprehensionQuestion[];
  setQuestions: (questions: ComprehensionQuestion[]) => void;
}

const ComprehensionPanel: React.FC<ComprehensionPanelProps> = ({ questions, setQuestions }) => {
  const [submitted, setSubmitted] = useState(false);

  if (!questions) {
    return <div className="text-slate-400">No comprehension questions available.</div>;
  }

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (submitted) return;
    const newQuestions = [...questions];
    newQuestions[questionIndex].userAnswer = answer;
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getOptionClass = (question: ComprehensionQuestion, option: string) => {
    if (!submitted) {
        return question.userAnswer === option 
            ? 'bg-sky-600' 
            : 'bg-slate-700 hover:bg-slate-600';
    }
    if (option === question.correctAnswer) {
      return 'bg-green-600/80';
    }
    if (option === question.userAnswer) {
      return 'bg-red-600/80';
    }
    return 'bg-slate-700';
  };
  
  const score = questions.reduce((acc, q) => acc + (q.userAnswer === q.correctAnswer ? 1 : 0), 0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-sky-300">Reading Comprehension</h3>
      {submitted && (
        <Card className="!bg-sky-800/50">
          <h4 className="text-xl font-bold text-white text-center">Your score: {score} / {questions.length}</h4>
        </Card>
      )}
      {questions.map((q, qIndex) => (
        <Card key={qIndex}>
          <p className="font-semibold text-slate-200 mb-3">{qIndex + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, oIndex) => (
              <button
                key={oIndex}
                onClick={() => handleAnswerSelect(qIndex, option)}
                disabled={submitted}
                className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${getOptionClass(q, option)}`}
              >
                {option}
              </button>
            ))}
          </div>
          {submitted && (
             <div className="mt-3 p-3 bg-slate-900/50 rounded-md">
                <p className={`font-semibold ${q.userAnswer === q.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                    {q.userAnswer === q.correctAnswer ? 'Correct!' : 'Incorrect.'}
                </p>
                <p className="text-slate-300 text-sm mt-1">{q.explanation}</p>
             </div>
          )}
        </Card>
      ))}
       {!submitted && (
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-colors duration-200"
        >
          Check Answers
        </button>
      )}
    </div>
  );
};

export default ComprehensionPanel;
