import React from 'react';
import { motion } from 'framer-motion';

export const StatsCard = ({
  title,
  value,
  icon,
  change = '',
  changeType = 'positive', // 'positive' | 'negative' | 'neutral'
  gradient = 'from-primary-500/5 to-secondary-500/5'
}) => {
  const changeColor = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-slate-500'
  }[changeType];

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className={`border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm bg-gradient-to-br ${gradient} flex flex-col justify-between`}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary-500 dark:text-primary-400">
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl font-extrabold font-display text-slate-800 dark:text-slate-100">
          {value}
        </span>
        {change && (
          <span className={`text-xs font-bold ${changeColor}`}>
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
