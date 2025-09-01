
import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { Activity, ActivityData } from '../types';
import SummaryPanel from './panels/SummaryPanel';
import VocabularyPanel from './panels/VocabularyPanel';
import ComprehensionPanel from './panels/ComprehensionPanel';
import WritingPanel from './panels/WritingPanel';
import TutorPanel from './panels/TutorPanel';
import Loader from './common/Loader';
import { 
    generateSummary, 
    extractVocabulary, 
    generateComprehensionQuestions,
    resetTutorChat
} from '../services/geminiService';

interface ActivityPanelProps {
  activity: Activity;
  sourceText: string;
  activityData: ActivityData;
  setActivityData: Dispatch<SetStateAction<ActivityData>>;
  loadingStates: Record<Activity, boolean>;
  setLoadingStates: Dispatch<SetStateAction<Record<Activity, boolean>>>;
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({ 
    activity, 
    sourceText, 
    activityData, 
    setActivityData,
    loadingStates,
    setLoadingStates
}) => {

    useEffect(() => {
        resetTutorChat();
    }, [sourceText]);

    useEffect(() => {
        const fetchDataForActivity = async () => {
            if (!sourceText || activityData[activity]) return;

            setLoadingStates(prev => ({ ...prev, [activity]: true }));

            try {
                let data;
                switch (activity) {
                    case Activity.Summary:
                        data = await generateSummary(sourceText);
                        break;
                    case Activity.Vocabulary:
                        // Defaulting to Spanish for this example. A language selector would be a great addition.
                        data = await extractVocabulary(sourceText, 'Spanish'); 
                        break;
                    case Activity.Comprehension:
                        data = await generateComprehensionQuestions(sourceText);
                        break;
                    default:
                        // Writing and Tutor panels don't pre-fetch data.
                        setLoadingStates(prev => ({ ...prev, [activity]: false }));
                        return;
                }
                setActivityData(prev => ({ ...prev, [activity]: data }));
            } catch (err) {
                console.error(`Error fetching data for ${activity}:`, err);
                // Optionally set an error state here to show in the UI
            } finally {
                setLoadingStates(prev => ({ ...prev, [activity]: false }));
            }
        };

        fetchDataForActivity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activity, sourceText]);

    const renderContent = () => {
        if (loadingStates[activity]) {
            return <div className="flex justify-center items-center h-full"><Loader /></div>;
        }

        switch (activity) {
            case Activity.Summary:
                return <SummaryPanel summary={activityData[Activity.Summary]} />;
            case Activity.Vocabulary:
                return <VocabularyPanel vocabulary={activityData[Activity.Vocabulary]} />;
            case Activity.Comprehension:
                return <ComprehensionPanel questions={activityData[Activity.Comprehension]} setQuestions={(newQuestions) => setActivityData(prev => ({...prev, [Activity.Comprehension]: newQuestions}))} />;
            case Activity.Writing:
                return <WritingPanel />;
            case Activity.Tutor:
                return <TutorPanel sourceText={sourceText} />;
            default:
                return <div className="text-slate-400">Select an activity to begin.</div>;
        }
    };

    return (
        <div className="flex-grow bg-slate-800 rounded-b-lg rounded-r-lg border-x border-b border-slate-700 p-4 sm:p-6 overflow-y-auto" style={{maxHeight: 'calc(100vh - 200px)'}}>
            {renderContent()}
        </div>
    );
};

export default ActivityPanel;
