import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiTrash2, FiBookmark, FiArrowRight } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

export const RecentAnalysisCard = ({
  id,
  name,
  score,
  date,
  isBookmarked = false,
  onDelete,
  onToggleBookmark
}) => {
  const getBadgeColor = (val) => {
    if (val < 40) return 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border border-red-200/50 dark:border-red-900/30';
    if (val < 60) return 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/30';
    if (val < 75) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-900/30';
    if (val < 90) return 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border border-green-200/50 dark:border-green-900/30';
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30';
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-200 hover:border-slate-350 dark:hover:border-slate-800/80">
      {/* File Info */}
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center font-extrabold flex-shrink-0">
          PDF
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate pr-2">
            {name || 'Resume.pdf'}
          </span>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-0.5">
            <FiClock size={12} />
            <span>{formatDate(date)}</span>
          </div>
        </div>
      </div>

      {/* Stats and actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
        {/* ATS Score badge */}
        <div className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider ${getBadgeColor(score)}`}>
          Score: {score}
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-2">
          {onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-lg transition-colors focus:outline-none ${
                isBookmarked 
                  ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FiBookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 rounded-lg text-slate-450 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors focus:outline-none"
            >
              <FiTrash2 size={15} />
            </button>
          )}

          <Link
            to={`/analysis/${id}`}
            className="p-2 rounded-lg text-slate-450 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View Details"
          >
            <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentAnalysisCard;
