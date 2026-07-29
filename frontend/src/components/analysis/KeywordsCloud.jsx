import React from 'react';

export const KeywordsCloud = ({ keywords = [] }) => {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="text-slate-400 text-xs py-4 text-center">
        No keywords identified in the analysis.
      </div>
    );
  }

  // Map importance values to CSS badge colors
  const importanceStyles = {
    high: 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/20 text-xs font-bold',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/20 text-[11px] font-semibold',
    low: 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/30 text-[10px] font-medium'
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3.5">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-2 flex justify-between items-center">
        <h3 className="text-sm font-bold tracking-wide text-slate-700 dark:text-slate-200">
          Keyword Frequency Cloud
        </h3>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {keywords.length} tags
        </span>
      </div>

      <div className="flex flex-wrap gap-2 py-1 max-h-52 overflow-y-auto">
        {keywords.map((kw, i) => {
          const importance = kw.importance?.toLowerCase() || 'medium';
          const styleClass = importanceStyles[importance];

          return (
            <div
              key={i}
              className={`px-3 py-1 rounded-lg inline-flex items-center space-x-1.5 transition-transform hover:scale-105 cursor-default ${styleClass}`}
              title={`Importance: ${importance}`}
            >
              <span>{kw.word}</span>
              {kw.count && (
                <span className="opacity-60 bg-white/50 dark:bg-black/20 px-1 rounded text-[9px]">
                  {kw.count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeywordsCloud;
