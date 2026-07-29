import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiMenu, FiLogOut, FiUser, FiBell, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

export const DashboardLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-dark-950 text-slate-800 dark:text-slate-100">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar drawer overlay for Mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 border-r border-slate-800">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex-shrink-0 h-16 bg-white dark:bg-dark-900 border-b border-slate-200/60 dark:border-slate-800/40 flex justify-between items-center px-4 md:px-6 shadow-sm">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          >
            <FiMenu size={20} />
          </button>

          {/* Breadcrumbs or Title */}
          <div className="text-sm font-bold tracking-wide font-display text-slate-700 dark:text-slate-200">
            Workspace Console
          </div>

          {/* Right Header actions */}
          <div className="flex items-center space-x-3.5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Notification placeholder */}
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <FiBell size={18} />
            </button>

            <div className="h-4.5 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Quick Profile logout trigger */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </header>

        {/* Dynamic child views container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50/70 dark:bg-dark-950/40">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
