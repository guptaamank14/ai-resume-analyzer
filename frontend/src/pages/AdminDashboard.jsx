import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { toast, Toaster } from 'react-hot-toast';
import { FiUsers, FiFileText, FiTrendingUp, FiClock, FiSearch, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, activityRes, analyticsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers({ page, search }),
        adminService.getRecentActivity(),
        adminService.getAnalytics()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) {
        setUsers(usersRes.data || []);
        if (usersRes.pagination) setTotalPages(usersRes.pagination.totalPages);
      }
      if (activityRes.success) setActivity(activityRes.data || []);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);

    } catch (e) {
      toast.error('Failed to retrieve administrative diagnostics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAdminData();
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await adminService.toggleUserStatus(id);
      if (res.success) {
        toast.success('User status updated');
        // Update user locally
        setUsers(prev =>
          prev.map(u => (u._id === id ? { ...u, isActive: res.data.isActive } : u))
        );
      }
    } catch (error) {
      toast.error('Failed to change status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user and all their resume records?')) return;
    try {
      const res = await adminService.deleteUser(id);
      if (res.success) {
        toast.success('User and data removed successfully');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Failed to delete user.');
    }
  };

  if (loading && !stats) {
    return <TableSkeleton rows={8} />;
  }

  // Prep chart data colors
  const COLORS = ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          System Administration
        </h1>
        <p className="text-xs text-slate-500">
          Monitor system metrics, review diagnostic charts, and manage system user listings.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Total Users</span>
              <div className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1 font-display">
                {stats.totalUsers}
              </div>
            </div>
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center rounded-lg">
              <FiUsers size={18} />
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Resumes Uploaded</span>
              <div className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1 font-display">
                {stats.totalResumes}
              </div>
            </div>
            <div className="h-10 w-10 bg-purple-50 dark:bg-purple-950/20 text-purple-500 flex items-center justify-center rounded-lg">
              <FiFileText size={18} />
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Analyses Performed</span>
              <div className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1 font-display">
                {stats.totalAnalyses}
              </div>
            </div>
            <div className="h-10 w-10 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-500 flex items-center justify-center rounded-lg">
              <FiClock size={18} />
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Avg ATS Score</span>
              <div className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1 font-display">
                {stats.avgAtsScore}
              </div>
            </div>
            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center rounded-lg">
              <FiTrendingUp size={18} />
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily submissions */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-slate-800">
              Analyses Activity Timeline (Last 30 days)
            </h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.dailyAnalyses} margin={{ left: -25, right: 10 }}>
                  <XAxis dataKey="_id" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ATS Score buckets */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-slate-800">
              ATS Score Range Distribution
            </h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.scoreDistribution} margin={{ left: -25, right: 10 }}>
                  <XAxis dataKey="range" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Users table list */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">
            Registered Users Directory
          </h3>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:max-w-xs">
            <Input
              placeholder="Search users name/email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<FiSearch size={14} />}
              className="flex-1"
            />
            <Button type="submit" variant="secondary" size="sm">
              Search
            </Button>
          </form>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-center">Resumes</th>
                <th className="py-3 px-4 text-center">Reports</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-slate-100 dark:border-slate-850/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {u.name}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{u.email}</td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-350">{u.resumeCount || 0}</td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-350">{u.analysisCount || 0}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={u.isActive ? 'success' : 'error'} size="sm">
                      {u.isActive ? 'Active' : 'Blocked'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right flex justify-end space-x-1">
                    <button
                      onClick={() => handleToggleStatus(u._id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        u.isActive 
                          ? 'border-red-100 hover:bg-red-50 text-red-500' 
                          : 'border-green-150 hover:bg-green-50 text-green-500'
                      }`}
                      title={u.isActive ? 'Deactivate User' : 'Activate User'}
                    >
                      {u.isActive ? <FiUserX size={13} /> : <FiUserCheck size={13} />}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-1.5 border border-red-100 rounded-lg text-slate-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      title="Delete User and Resumes"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>
            <span className="text-[10px] font-bold text-slate-400">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
