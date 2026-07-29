import React from 'react';

export const ProgressBar = ({
  value = 0,
  color = 'bg-primary-500',
  label = '',
  showPercentage = true,
  size = 'md',
  className = ''
}) => {
  const percent = Math.min(100, Math.max(0, value));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className={`w-full flex flex-col space-y-1 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label && <span>{label}</span>}
          {showPercentage && <span>{percent}%</span>}
        </div>
      )}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`${heights[size]} ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
