import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { toast, Toaster } from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.forgotPassword(email);
      if (result.success) {
        setSuccessMsg(result.message || 'Instructions sent to your email.');
        toast.success('Reset email requested.');
      } else {
        toast.error(result.message || 'Failed to request reset.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 p-4">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 p-8 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-xl">
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold font-display text-slate-950 dark:text-white">
            Forgot Password
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Provide your email and we will send a reset request link (mocked configuration).
          </p>
        </div>

        {successMsg ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs leading-relaxed text-center">
            {successMsg}
            <div className="mt-4">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<FiMail size={16} />}
              required
            />
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              Send Reset Instructions
            </Button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors space-x-1.5"
          >
            <FiArrowLeft />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
