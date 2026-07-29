import { format } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'PPP');
  } catch (error) {
    return 'N/A';
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getScoreColor = (score) => {
  if (score < 40) return 'text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30';
  if (score < 60) return 'text-orange-500 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900/30';
  if (score < 75) return 'text-yellow-500 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900/30';
  if (score < 90) return 'text-green-500 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/30';
  return 'text-emerald-500 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900/30';
};

export const getScoreLabel = (score) => {
  if (score < 40) return 'Poor';
  if (score < 60) return 'Needs Work';
  if (score < 75) return 'Average';
  if (score < 90) return 'Good';
  return 'Excellent';
};

export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'hard':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400';
  }
};
