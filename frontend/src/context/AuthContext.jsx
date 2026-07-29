import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount - default to demo user if no token found
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser && storedToken !== 'demo-token-user') {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.warn('Stored user JSON invalid, resetting');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        // Clear any auto-initialized demo session so user can access the Login Page
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }

      setIsLoading(false);
    };

    initAuth();

    // Listen to interceptor logout events
    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };
    window.addEventListener('auth-logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success && result.data) {
        const { user: profile, token: jwtToken } = result.data;
        setUser(profile);
        setToken(jwtToken);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(profile));
        return { success: true };
      }
      return { success: false, message: result.message || 'Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid credentials';
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.register(name, email, password);
      if (result.success && result.data) {
        const { user: profile, token: jwtToken } = result.data;
        setUser(profile);
        setToken(jwtToken);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(profile));
        return { success: true };
      }
      return { success: false, message: result.message || 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role = 'user') => {
    setIsLoading(true);
    const email = role === 'admin' ? 'admin@example.com' : 'user@example.com';
    const name = role === 'admin' ? 'System Admin' : 'Demo Candidate';
    const password = 'password123';

    try {
      // Try backend login first
      let res = await login(email, password);
      if (res && res.success) {
        setIsLoading(false);
        return res;
      }
      // Try backend registration if user does not exist
      res = await register(name, email, password);
      if (res && res.success) {
        setIsLoading(false);
        return res;
      }
    } catch (err) {
      console.warn('Backend unavailable, initiating client demo session fallback.');
    }

    // Client-side demo fallback session
    const demoUser = {
      _id: role === 'admin' ? 'demo-admin-id' : 'demo-user-id',
      name,
      email,
      role,
      isActive: true,
      bio: 'AI Resume Analyzer Demo Account',
      location: 'San Francisco, CA',
      phone: '+1 (555) 019-2834',
      createdAt: new Date().toISOString()
    };
    const demoToken = 'demo-token-' + role;

    setUser(demoUser);
    setToken(demoToken);
    localStorage.setItem('token', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    setIsLoading(false);
    return { success: true, data: { user: demoUser, token: demoToken } };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = async (profileData) => {
    try {
      const result = await authService.updateProfile(profileData);
      if (result.success && result.data) {
        const { user: updatedProfile, token: newToken } = result.data;
        setUser(updatedProfile);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(updatedProfile));
        return { success: true };
      }
      return { success: false, message: result.message || 'Failed to update profile' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Update failed';
      return { success: false, message: msg };
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    login,
    register,
    demoLogin,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
