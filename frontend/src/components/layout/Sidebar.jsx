import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiSliders,
  FiUploadCloud,
  FiClock,
  FiBookOpen,
  FiUser,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiHelpCircle
} from 'react-icons/fi';

export const Sidebar = () => {
  const { user, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <FiSliders size={18} />, path: '/dashboard' },
    { name: 'Upload Resume', icon: <FiUploadCloud size={18} />, path: '/upload' },
    { name: 'My Analyses', icon: <FiClock size={18} />, path: '/history' },
    { name: 'JD Matching', icon: <FiBookOpen size={18} />, path: '/jd-matching' },
    { name: 'Interview Prep', icon: <FiHelpCircle size={18} />, path: '/interview-prep' },
    { name: 'My Profile', icon: <FiUser size={18} />, path: '/profile' }
  ];

  if (isAdmin) {
    menuItems.push({
      name: 'Admin Panel',
      icon: <FiShield size={18} />,
      path: '/admin'
    });
  }

  return (
    <div
      className={`relative h-screen bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 flex flex-col z-30
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Sidebar Header Logo */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-slate-800">
        <Link to="/" className="flex items-center space-x-2.5 overflow-hidden">
          <div className="h-8.5 w-8.5 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-white font-extrabold text-base flex-shrink-0">
            AI
          </div>
          {!collapsed && (
            <span className="font-extrabold text-lg tracking-tight font-display bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              ResumeAI
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center space-x-3.5 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200
              ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md shadow-primary-900/10'
                  : 'hover:bg-slate-850 hover:text-white text-slate-400'
              }
            `}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User profile section at the bottom */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center space-x-3.5 overflow-hidden">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 text-white font-bold flex items-center justify-center uppercase flex-shrink-0">
            {user?.name ? user.name.slice(0, 2) : 'US'}
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate">{user?.name}</span>
              <span className="text-xs text-slate-500 truncate">{user?.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
