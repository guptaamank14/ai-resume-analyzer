import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeService } from '../services/api';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentAnalysisCard } from '../components/dashboard/RecentAnalysisCard';
import { DashboardSkeleton } from '../components/common/LoadingSkeleton';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-hot-toast';
import {
  FiFileText,
  FiTrendingUp,
  FiBookmark,
  FiClock,
  FiUploadCloud,
  FiBookOpen,
  FiHelpCircle
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    avgScore: 0,
    bookmarkedCount: 0,
    lastUploaded: 'N/A'
  });
  const [history, setHistory] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await resumeService.getHistory({ limit: 10 });
      if (res && res.success) {
        const reports = Array.isArray(res.data) ? res.data : [];
        setHistory(reports);

        // Compute metrics safely
        const total = reports.length;
        const bookmarked = reports.filter(r => r && r.isBookmarked).length;
        const avg = total > 0 
          ? Math.round(reports.reduce((acc, r) => acc + (r?.atsScore || 0), 0) / total) 
          : 0;
        
        let lastDate = 'N/A';
        if (total > 0 && reports[0] && reports[0].createdAt) {
          lastDate = formatDate(reports[0].createdAt);
        }

        setStats({
          totalAnalyses: total,
          avgScore: avg,
          bookmarkedCount: bookmarked,
          lastUploaded: lastDate
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;
    try {
      const res = await resumeService.deleteAnalysis(id);
      if (res && res.success) {
        toast.success('Report deleted successfully');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to delete report.');
    }
  };

  const handleToggleBookmark = async (id) => {
    if (!id) return;
    try {
      const res = await resumeService.toggleBookmark(id);
      if (res && res.success) {
        toast.success(res.data?.isBookmarked ? 'Report bookmarked!' : 'Bookmark removed.');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to update bookmark.');
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Graph data: last 10 reports in chronological order
  const chartData = (history || [])
    .filter(Boolean)
    .reverse()
    .slice(-10)
    .map((report, index) => ({
      name: `R-${index + 1}`,
      score: report?.atsScore ?? 0
    }));

  return (
    <div className="space-y-8">
      {/* Greetings */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-xs text-slate-500">
          Here is a summary of your resume library and placement analytics metrics.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Resumes Uploaded"
          value={stats.totalAnalyses}
          icon={<FiFileText size={18} />}
          gradient="from-indigo-500/5 to-indigo-600/5"
        />
        <StatsCard
          title="Average ATS Score"
          value={`${stats.avgScore}`}
          icon={<FiTrendingUp size={18} />}
          change={stats.avgScore > 70 ? 'Recruiter Safe' : 'Needs Work'}
          changeType={stats.avgScore > 70 ? 'positive' : 'negative'}
          gradient="from-emerald-500/5 to-emerald-600/5"
        />
        <StatsCard
          title="Bookmarked Reports"
          value={stats.bookmarkedCount}
          icon={<FiBookmark size={18} />}
          gradient="from-amber-500/5 to-amber-600/5"
        />
        <StatsCard
          title="Last Upload Date"
          value={stats.lastUploaded}
          icon={<FiClock size={18} />}
          gradient="from-purple-500/5 to-purple-600/5"
        />
      </div>

      {/* Quick Actions grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/upload"
          className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:border-primary-500 dark:hover:border-primary-800 transition-all flex items-center space-x-4"
        >
          <div className="h-12 w-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center flex-shrink-0">
            <FiUploadCloud size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Upload Resume</h3>
            <p className="text-xs text-slate-400 mt-0.5">Test score metrics against parser templates.</p>
          </div>
        </Link>

        <Link
          to="/jd-matching"
          className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:border-primary-500 dark:hover:border-primary-800 transition-all flex items-center space-x-4"
        >
          <div className="h-12 w-12 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-purple-500 flex items-center justify-center flex-shrink-0">
            <FiBookOpen size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">JD Matching</h3>
            <p className="text-xs text-slate-400 mt-0.5">Identify gap analysis against a job description.</p>
          </div>
        </Link>

        <Link
          to="/interview-prep"
          className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:border-primary-500 dark:hover:border-primary-800 transition-all flex items-center space-x-4"
        >
          <div className="h-12 w-12 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 text-cyan-500 flex items-center justify-center flex-shrink-0">
            <FiHelpCircle size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Interview Prep</h3>
            <p className="text-xs text-slate-400 mt-0.5">Generate technical and behavioral QAs.</p>
          </div>
        </Link>
      </div>

      {/* Grid of chart and list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
            ATS Score Progress Timeline
          </h3>
          <div className="h-64 flex items-center justify-center">
            {chartData.length === 0 ? (
              <div className="text-slate-450 text-xs">Run a few resume analyses to trace your score progress.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: -20, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#1e293b', borderRadius: 8, fontSize: 11, color: '#fff' }} />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent reports list */}
        <div className="lg:col-span-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
            Latest Submissions
          </h3>
          <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="text-slate-400 text-xs py-8 text-center">No uploads found. Start by adding your first PDF resume.</div>
            ) : (
              history.slice(0, 4).map(report => (
                <div key={report?._id || Math.random()} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40 last:border-0">
                  <div className="min-w-0 pr-2">
                    <Link
                      to={`/analysis/${report?._id || ''}`}
                      className="block text-xs font-bold text-slate-750 dark:text-slate-200 hover:text-primary-500 truncate"
                    >
                      {report?.resumeName || 'Resume.pdf'}
                    </Link>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(report?.createdAt)}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    (report?.atsScore || 0) > 75 
                      ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400'
                  }`}>
                    {report?.atsScore ?? 0}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Comprehensive submissions list */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 pb-1 border-b border-slate-200/50 dark:border-slate-800/40">
          Recent Full Activities
        </h3>
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-slate-450 text-xs text-center py-6">Your activity feed is empty.</div>
          ) : (
            history.slice(0, 3).map(item => (
              <RecentAnalysisCard
                key={item?._id || Math.random()}
                id={item?._id || ''}
                name={item?.resumeName}
                score={item?.atsScore}
                date={item?.createdAt}
                isBookmarked={item?.isBookmarked}
                onDelete={() => handleDelete(item?._id)}
                onToggleBookmark={() => handleToggleBookmark(item?._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
