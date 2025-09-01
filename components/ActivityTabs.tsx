
import React from 'react';
import { Activity } from '../types';
import { ICONS } from '../constants';

interface ActivityTabsProps {
  activeActivity: Activity;
  setActiveActivity: (activity: Activity) => void;
}

const ActivityTabs: React.FC<ActivityTabsProps> = ({ activeActivity, setActiveActivity }) => {
  const activities = Object.values(Activity);

  const getIcon = (activity: Activity) => {
      switch(activity) {
          case Activity.Summary: return ICONS.summary;
          case Activity.Vocabulary: return ICONS.vocabulary;
          case Activity.Comprehension: return ICONS.comprehension;
          case Activity.Writing: return ICONS.writing;
          case Activity.Tutor: return ICONS.tutor;
      }
  }

  return (
    <div className="border-b border-slate-700 mb-4">
      <nav className="-mb-px flex space-x-2 sm:space-x-4" aria-label="Tabs">
        {activities.map((activity) => (
          <button
            key={activity}
            onClick={() => setActiveActivity(activity)}
            className={`
              ${
                activeActivity === activity
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
              }
              flex items-center whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none
            `}
          >
            {getIcon(activity)}
            {activity}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ActivityTabs;
