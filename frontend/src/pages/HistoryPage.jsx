import React, { useEffect, useState } from 'react';
import { resumeService } from '../services/api';
import { RecentAnalysisCard } from '../components/dashboard/RecentAnalysisCard';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { toast } from 'react-hot-toast';
import { FiSearch, FiClock, FiUploadCloud } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const HistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1
  });

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      const res = await resumeService.getHistory({
        page,
        limit: 10,
        search,
        bookmarkedOnly: bookmarkedOnly ? 'true' : 'false'
      });
      if (res.success) {
        setHistory(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (error) {
      toast.error('Failed to load analysis history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, [bookmarkedOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report permanently?')) return;
    try {
      const res = await resumeService.deleteAnalysis(id);
      if (res.success) {
        toast.success('Report deleted successfully');
        fetchHistory(pagination.currentPage);
      }
    } catch (error) {
      toast.error('Failed to delete report.');
    }
  };

  const handleToggleBookmark = async (id) => {
    try {
      const res = await resumeService.toggleBookmark(id);
      if (res.success) {
        toast.success(res.data.isBookmarked ? 'Report bookmarked!' : 'Bookmark removed.');
        fetchHistory(pagination.currentPage);
      }
    } catch (error) {
      toast.error('Failed to update bookmark.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          My Analyses Library
        </h1>
        <p className="text-xs text-slate-500">
          Access all your previously generated ATS score evaluations, keyword clouds, and JD matching records.
        </p>
      </div>

      {/* Filter and search form */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
          <Input
            placeholder="Search by resume name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<FiSearch size={16} />}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            Find
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold border transition-all
              ${
                bookmarkedOnly
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-655'
              }
            `}
          >
            ★ Bookmarked Only
          </button>
        </div>
      </div>

      {/* History content */}
      {loading ? (
        <TableSkeleton />
      ) : history.length === 0 ? (
        <div className="border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-4 bg-white dark:bg-slate-900/30">
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <FiClock size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No matching records found
            </h4>
            <p className="text-xs text-slate-450 max-w-xs mx-auto leading-relaxed">
              Start by uploading your first PDF resume to review the complete analytical summary report.
            </p>
          </div>
          <Link to="/upload" className="pt-2">
            <Button variant="primary" leftIcon={<FiUploadCloud />}>
              Analyze Resume
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {history.map(item => (
              <RecentAnalysisCard
                key={item._id}
                id={item._id}
                name={item.resumeName}
                score={item.atsScore}
                date={item.createdAt}
                isBookmarked={item.isBookmarked}
                onDelete={() => handleDelete(item._id)}
                onToggleBookmark={() => handleToggleBookmark(item._id)}
              />
            ))}
          </div>

          {/* Pagination buttons */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === 1}
                onClick={() => fetchHistory(pagination.currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-xs font-semibold text-slate-500 px-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => fetchHistory(pagination.currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
