import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ATSScoreRing = ({
  score = 0,
  size = 'md',
  animated = true
}) => {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    if (animated) {
      const duration = 1000; // 1s
      const steps = 60;
      const stepTime = duration / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const value = Math.round(progress * score);
        setCurrentScore(value);
        if (step >= steps) {
          setCurrentScore(score);
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setCurrentScore(score);
    }
  }, [score, animated]);

  // Size mapping
  const dimensions = {
    sm: { diameter: 80, strokeWidth: 6, fontSize: 'text-lg', labelSize: 'text-[9px]' },
    md: { diameter: 140, strokeWidth: 10, fontSize: 'text-3xl', labelSize: 'text-xs' },
    lg: { diameter: 200, strokeWidth: 14, fontSize: 'text-5xl', labelSize: 'text-sm' }
  };

  const { diameter, strokeWidth, fontSize, labelSize } = dimensions[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  // Colors based on score
  const getColorClasses = (val) => {
    if (val < 40) return { stroke: 'stroke-red-500', text: 'text-red-500', bg: 'bg-red-500/10' };
    if (val < 60) return { stroke: 'stroke-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/10' };
    if (val < 75) return { stroke: 'stroke-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    if (val < 90) return { stroke: 'stroke-green-500', text: 'text-green-500', bg: 'bg-green-500/10' };
    return { stroke: 'stroke-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  };

  const colors = getColorClasses(score);

  const getLabel = (val) => {
    if (val < 40) return 'Poor';
    if (val < 60) return 'Needs Work';
    if (val < 75) return 'Average';
    if (val < 90) return 'Good';
    return 'Excellent';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: diameter, height: diameter }}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score circle */}
          <motion.circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            className={`${colors.stroke}`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: animated ? 1 : 0, ease: 'easeInOut' }}
            strokeLinecap="round"
          />
        </svg>
        {/* Value text in middle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-extrabold font-display leading-none tracking-tight ${fontSize} ${colors.text}`}>
            {currentScore}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
            of 100
          </span>
        </div>
      </div>
      
      {size !== 'sm' && (
        <div className={`mt-3 font-extrabold uppercase tracking-wider ${colors.text} ${labelSize}`}>
          {getLabel(score)}
        </div>
      )}
    </div>
  );
};

export default ATSScoreRing;
