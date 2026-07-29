import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { toast, Toaster } from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export const RegisterPage = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters';
    }
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const result = await register(name, email, password);
    setIsLoading(false);

    if (result.success) {
      toast.success('Registration successful! Welcome aboard.');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed. Email might already exist.');
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-slate-50 dark:bg-dark-950">
      <Toaster position="top-right" />

      {/* Left panel for branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/50 via-secondary-900/30 to-transparent" />
        
        <Link to="/" className="flex items-center space-x-2 relative z-10">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-white font-extrabold text-lg">
            AI
          </div>
          <span className="font-extrabold text-xl tracking-tight font-display text-white">
            ResumeAI
          </span>
        </Link>

        <div className="space-y-6 relative z-10 max-w-md">
          <h2 className="text-3xl font-bold font-display leading-tight">
            Build a Recruitment Ready Portfolio.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Create an account to get detailed scoring breakdown, course suggestions for missing skills, and custom practice HR/technical questions.
          </p>
        </div>

        <div className="text-[10px] text-slate-500 relative z-10">
          © {new Date().getFullYear()} ResumeAI. All rights reserved.
        </div>
      </div>

      {/* Right panel for form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-7 bg-white dark:bg-slate-900 p-8 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-xl">
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Create Account
            </h3>
            <p className="text-xs text-slate-500">
              Enter your details to create a free analyzer space.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              error={errors.name}
              leftIcon={<FiUser size={16} />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<FiMail size={16} />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<FiLock size={16} />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<FiLock size={16} />}
              required
            />

            <div className="pt-2">
              <Button
                variant="primary"
                type="submit"
                isLoading={isLoading}
                className="w-full"
                rightIcon={<FiArrowRight />}
              >
                Sign Up
              </Button>
            </div>
          </form>

          <div className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-primary-500 hover:text-primary-600 transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
