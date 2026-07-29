import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiBookmark, FiHelpCircle } from 'react-icons/fi';
import { getDifficultyColor } from '../../utils/helpers';

export const InterviewQuestionCard = ({
  question,
  type = 'technical',
  difficulty = 'medium',
  answer = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const typeLabels = {
    technical: 'Technical Skill',
    hr: 'HR Behavioral',
    behavioral: 'Situational / behavioral'
  };

  const difficultyStyles = getDifficultyColor(difficulty);

  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:border-slate-350 dark:hover:border-slate-700/80">
      {/* Trigger Row */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between p-5 text-left focus:outline-none"
      >
        <div className="flex space-x-3.5 items-start">
          <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/20 text-primary-500 mt-0.5 flex-shrink-0">
            <FiHelpCircle size={18} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide pr-4">
              {question}
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider ${difficultyStyles}`}>
                {difficulty}
              </span>
              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 tracking-wider">
                {typeLabels[type] || type}
              </span>
            </div>
          </div>
        </div>

        <span className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 mt-1">
          {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
        </span>
      </button>

      {/* Answer Expandable Section */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20"
          >
            <div className="p-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2.5">
              <h5 className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                Suggested Answer Key & Tips:
              </h5>
              <p className="whitespace-pre-line bg-white dark:bg-slate-900/60 p-4 border border-slate-200/50 dark:border-slate-800/40 rounded-lg">
                {answer || 'Pointers to focus: Star method structure, reference your resume achievements, stay brief.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewQuestionCard;
