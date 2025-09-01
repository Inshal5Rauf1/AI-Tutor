
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { getTutorChat, sendTutorMessage } from '../../services/geminiService';
import { ICONS } from '../../constants';
import Loader from '../common/Loader';

interface TutorPanelProps {
  sourceText: string;
}

const TutorPanel: React.FC<TutorPanelProps> = ({ sourceText }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const chat = getTutorChat(sourceText);
        const response = await sendTutorMessage(chat, input);
        const modelMessage: ChatMessage = { role: 'model', text: response.text };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("Tutor chat error:", error);
        const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-sky-300 mb-2">AI Tutor</h3>
      <p className="text-slate-400 text-sm mb-4">Ask me anything about the text, vocabulary, or grammar!</p>
      
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-sky-700 text-white' : 'bg-slate-700 text-slate-200'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="bg-slate-700 text-slate-200 p-3 rounded-lg inline-flex items-center">
                    <Loader/>
                 </div>
            </div>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-slate-700 pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder="Type your question..."
          className="w-full p-3 bg-slate-900/70 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-300 placeholder-slate-500"
          disabled={isLoading}
        />
        <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-sky-600 text-white rounded-md hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {ICONS.send}
        </button>
      </div>
    </div>
  );
};

export default TutorPanel;
