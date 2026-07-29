import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

export const SkillsChart = ({
  matchingSkills = [],
  missingSkills = [],
  keywords = []
}) => {
  const [chartType, setChartType] = useState('radar'); // 'radar' | 'keywords'

  // Prepare skill coverage data
  const coverageData = [
    { subject: 'Matching Skills', count: matchingSkills.length, fullMark: Math.max(10, matchingSkills.length + missingSkills.length) },
    { subject: 'Missing Skills', count: missingSkills.length, fullMark: Math.max(10, matchingSkills.length + missingSkills.length) },
    { subject: 'Resume Profile', count: matchingSkills.length, fullMark: matchingSkills.length + missingSkills.length }
  ];

  // Prepare keyword density data
  const keywordData = keywords.slice(0, 10).map(kw => ({
    keyword: kw.word,
    importance: kw.importance === 'high' ? 3 : kw.importance === 'medium' ? 2 : 1,
    appearances: kw.count || 1
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-white shadow-xl text-xs space-y-1">
          <p className="font-bold">{payload[0].payload.keyword || payload[0].payload.subject}</p>
          {payload[0].name === 'appearances' && <p>Occurrences: {payload[0].value}</p>}
          {payload[0].name === 'importance' && <p>Importance Tier: {payload[0].value === 3 ? 'High' : payload[0].value === 2 ? 'Medium' : 'Low'}</p>}
          {payload[0].name === 'count' && <p>Count: {payload[0].value}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold tracking-wide text-slate-700 dark:text-slate-200">
          Skills & Keywords Analytics
        </h3>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setChartType('radar')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              chartType === 'radar'
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            Skill Metrics
          </button>
          <button
            onClick={() => setChartType('keywords')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              chartType === 'keywords'
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            Top Keywords
          </button>
        </div>
      </div>

      <div className="h-64 flex items-center justify-center">
        {chartType === 'radar' ? (
          matchingSkills.length === 0 && missingSkills.length === 0 ? (
            <div className="text-sm text-slate-400">No skill insights found to render.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={coverageData}>
                <PolarGrid stroke="#475569" strokeOpacity={0.2} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#64748b', fontSize: 8 }} />
                <Radar
                  name="Skills Score"
                  dataKey="count"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.35}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          )
        ) : keywordData.length === 0 ? (
          <div className="text-sm text-slate-400">No keyword metrics parsed.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={keywordData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <XAxis dataKey="keyword" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
              <Bar dataKey="appearances" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SkillsChart;
