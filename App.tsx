
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import TextInputArea from './components/TextInputArea';
import ActivityTabs from './components/ActivityTabs';
import ActivityPanel from './components/ActivityPanel';
import { Activity, ActivityData } from './types';

function App() {
  const [sourceText, setSourceText] = useState<string>('');
  const [analysisTriggered, setAnalysisTriggered] = useState<boolean>(false);
  const [activeActivity, setActiveActivity] = useState<Activity>(Activity.Summary);
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [loadingStates, setLoadingStates] = useState<Record<Activity, boolean>>({
    [Activity.Summary]: false,
    [Activity.Vocabulary]: false,
    [Activity.Comprehension]: false,
    [Activity.Writing]: false,
    [Activity.Tutor]: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(() => {
    if (!sourceText.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    setError(null);
    setAnalysisTriggered(true);
    setActivityData({});
    setActiveActivity(Activity.Summary);
    // Data fetching will be triggered by ActivityPanel's useEffect
  }, [sourceText]);
  
  const handleSetSourceText = (text: string) => {
    setSourceText(text);
    if(analysisTriggered) {
      setAnalysisTriggered(false);
      setActivityData({});
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-sky-300">Your Text</h2>
          <TextInputArea 
            value={sourceText} 
            onChange={handleSetSourceText} 
            onAnalyze={handleAnalyze} 
          />
        </div>
        <div className="lg:w-1/2 flex flex-col">
          {analysisTriggered ? (
            <>
              <ActivityTabs 
                activeActivity={activeActivity} 
                setActiveActivity={setActiveActivity} 
              />
              <ActivityPanel
                activity={activeActivity}
                sourceText={sourceText}
                activityData={activityData}
                setActivityData={setActivityData}
                loadingStates={loadingStates}
                setLoadingStates={setLoadingStates}
              />
            </>
          ) : (
            <div className="flex-grow bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-center p-8">
              <div className="text-center text-slate-400">
                <p className="text-lg">Paste your text and click "Analyze Text"</p>
                <p>to begin your personalized learning journey.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
