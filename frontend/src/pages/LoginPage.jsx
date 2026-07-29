import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { toast, Toaster } from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export const LoginPage = () => {
  const { login, isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const tempErrors = {};
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
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      toast.success('Welcome back!');
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      toast.error(result.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-slate-50 dark:bg-dark-950">
      <Toaster position="top-right" />

      {/* Left panel for branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative mesh */}
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
            Optimize Your Application Pipeline.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Log in to manage your resume library, perform detailed ATS checkups, compare profiles to job descriptions, and prepare for placements.
          </p>
        </div>

        <div className="text-[10px] text-slate-500 relative z-10">
          © {new Date().getFullYear()} ResumeAI. All rights reserved.
        </div>
      </div>

      {/* Right panel for form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-xl">
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Sign In
            </h3>
            <p className="text-xs text-slate-500">
              Welcome back. Enter your credentials to access your console.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-1">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<FiLock size={16} />}
                required
              />
            </div>

            <div className="pt-2 space-y-2">
              <Button
                variant="primary"
                type="submit"
                isLoading={isLoading}
                className="w-full"
                rightIcon={<FiArrowRight />}
              >
                Sign In
              </Button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or Quick Demo</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    await demoLogin('user');
                    setIsLoading(false);
                    toast.success('Signed in as Demo Candidate!');
                    navigate('/dashboard', { replace: true });
                  }}
                  className="w-full text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ⚡ Candidate Demo
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    await demoLogin('admin');
                    setIsLoading(false);
                    toast.success('Signed in as System Admin!');
                    navigate('/admin', { replace: true });
                  }}
                  className="w-full text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  🛡️ Admin Demo
                </Button>
              </div>
            </div>
          </form>

          <div className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-primary-500 hover:text-primary-600 transition-colors"
            >
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
