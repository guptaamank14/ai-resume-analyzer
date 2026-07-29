import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { toast, Toaster } from 'react-hot-toast';
import { FiUser, FiPhone, FiMapPin, FiLock, FiCalendar } from 'react-icons/fi';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profileStats, setProfileStats] = useState({
    resumesUploaded: 0,
    reportsGenerated: 0
  });

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await authService.getProfile();
        if (res.success && res.data) {
          setProfileStats(res.data.stats);
          if (res.data.user) {
            const u = res.data.user;
            setName(u.name || '');
            setBio(u.bio || '');
            setPhone(u.phone || '');
            setLocation(u.location || '');
          }
        }
      } catch (e) {
        console.error('Failed to sync profile statistics');
      }
    };
    fetchStats();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setUpdatingProfile(true);
    const result = await updateUser({ name, bio, phone, location });
    setUpdatingProfile(false);

    if (result.success) {
      toast.success('Profile details updated successfully');
    } else {
      toast.error(result.message || 'Failed to update details');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Both current and new passwords are required');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setUpdatingPassword(true);
    const result = await updateUser({ currentPassword, newPassword });
    setUpdatingPassword(false);

    if (result.success) {
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(result.message || 'Failed to update password');
    }
  };

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          My Account Settings
        </h1>
        <p className="text-xs text-slate-500">
          Update your profile details, biographical information, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card: Account Card Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm text-center flex flex-col items-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 text-white font-bold text-2xl flex items-center justify-center uppercase shadow-md shadow-primary-500/10">
              {user?.name ? user.name.slice(0, 2) : 'US'}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">{user?.name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-4 text-center">
              <div>
                <div className="text-lg font-extrabold text-indigo-500 font-display">
                  {profileStats.resumesUploaded}
                </div>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  Resumes
                </span>
              </div>
              <div>
                <div className="text-lg font-extrabold text-purple-500 font-display">
                  {profileStats.reportsGenerated}
                </div>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  Reports
                </span>
              </div>
            </div>

            <div className="w-full flex items-center justify-center space-x-2 text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/40">
              <FiCalendar />
              <span>Joined: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Right Forms list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile details */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
              Profile Details
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  leftIcon={<FiUser size={16} />}
                  required
                />
                <Input
                  label="Contact Phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  leftIcon={<FiPhone size={16} />}
                  placeholder="e.g. +1 (555) 019-2834"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  leftIcon={<FiMapPin size={16} />}
                  placeholder="e.g. San Francisco, CA"
                />
                
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Professional Biography
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your career goals, industry focus, and technical specialties..."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full text-xs font-medium p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={updatingProfile}
                >
                  Save Profile Details
                </Button>
              </div>
            </form>
          </div>

          {/* Security details */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
              Update Security Password
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                leftIcon={<FiLock size={16} />}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  leftIcon={<FiLock size={16} />}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  leftIcon={<FiLock size={16} />}
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={updatingPassword}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
