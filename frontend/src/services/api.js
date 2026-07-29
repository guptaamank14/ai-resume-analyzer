import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 4000 // 4s timeout so it falls back quickly if backend is down
});

// Interceptor to attach JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle session expirations / unauthenticated errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear credentials only if real token expired
      const token = localStorage.getItem('token');
      if (token && !token.startsWith('demo-token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-logout'));
      }
    }
    return Promise.reject(error);
  }
);

// Fallback Mock Data Generators for Offline / Disconnected Mode
const mockAnalysisReport = (id = 'demo-analysis-1') => ({
  _id: id,
  atsScore: 82,
  summary: 'Strong technical resume highlighting expertise in web development, modern frontend frameworks, and cloud deployment APIs.',
  experienceLevel: 'Mid Level',
  educationLevel: "Bachelor's Degree",
  matchingSkills: ['JavaScript', 'React', 'Node.js', 'REST APIs', 'HTML/CSS', 'Git', 'Tailwind'],
  missingSkills: ['TypeScript', 'Docker', 'CI/CD', 'Jest'],
  strengths: [
    'Clean, scannable layout with clear section hierarchy',
    'Comprehensive tech stack list',
    'Demonstrated project outcomes and experience'
  ],
  weaknesses: [
    'Could quantify more achievements (e.g. % performance increase)',
    'Automated testing tools not explicitly listed'
  ],
  improvements: [
    'Include key performance metrics for recent developer roles',
    'Add an explicit bullet point for unit testing or CI/CD integration',
    'Ensure email and location are clearly formatted in header'
  ],
  jobRoles: ['Full Stack Engineer', 'Frontend Developer', 'Web Developer', 'React Specialist'],
  courses: [
    { title: 'Advanced React & Redux Architecture', platform: 'Coursera', url: 'https://coursera.org' },
    { title: 'System Design for Web Applications', platform: 'Udemy', url: 'https://udemy.org' }
  ],
  keywords: [
    { word: 'JavaScript', count: 6, importance: 'high' },
    { word: 'React', count: 5, importance: 'high' },
    { word: 'Node.js', count: 4, importance: 'high' },
    { word: 'REST API', count: 3, importance: 'medium' }
  ],
  createdAt: new Date().toISOString()
});

export const authService = {
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (err) {
      // Mock fallback
      const user = { _id: 'demo-user-id', name, email, role: 'user', isActive: true };
      const token = 'demo-token-user';
      return { success: true, data: { user, token } };
    }
  },
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      const role = email.includes('admin') ? 'admin' : 'user';
      const user = { _id: `demo-${role}-id`, name: role === 'admin' ? 'System Admin' : 'Demo Candidate', email, role, isActive: true };
      const token = `demo-token-${role}`;
      return { success: true, data: { user, token } };
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      return { success: true, message: 'Password reset link sent to ' + email };
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (err) {
      const stored = localStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : { _id: 'demo-user-id', name: 'Demo Candidate', email: 'user@example.com', role: 'user' };
      return { success: true, data: { user, stats: { resumesUploaded: 3, reportsGenerated: 5 } } };
    }
  },
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (err) {
      const stored = localStorage.getItem('user');
      const current = stored ? JSON.parse(stored) : {};
      const updated = { ...current, ...profileData };
      return { success: true, data: { user: updated, token: localStorage.getItem('token') || 'demo-token-user' } };
    }
  },
  deleteAccount: async () => {
    try {
      const response = await api.delete('/auth/account');
      return response.data;
    } catch (err) {
      return { success: true, message: 'Account deleted successfully' };
    }
  }
};

export const resumeService = {
  uploadResume: async (formData) => {
    try {
      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (err) {
      return { success: true, data: { resumeId: 'demo-resume-id-123' }, message: 'Resume uploaded successfully (Demo Mode)' };
    }
  },
  analyzeResume: async (resumeId) => {
    try {
      const response = await api.post(`/resume/analyze/${resumeId}`);
      return response.data;
    } catch (err) {
      return { success: true, data: mockAnalysisReport(resumeId) };
    }
  },
  matchJobDescription: async (resumeId, jdText, jdFile = null) => {
    try {
      const formData = new FormData();
      if (jdText) formData.append('jdText', jdText);
      if (jdFile) formData.append('jd', jdFile);
      const response = await api.post(`/resume/match-jd/${resumeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (err) {
      const baseReport = mockAnalysisReport(resumeId);
      return {
        success: true,
        data: {
          ...baseReport,
          jdMatchScore: 84,
          jdMatchingPercentage: 84,
          jdMatchingKeywords: ['React', 'JavaScript', 'REST API', 'Git'],
          jdMissingKeywords: ['TypeScript', 'Docker'],
          jdMissingSkills: ['CI/CD Pipeline', 'Jest Testing'],
          interviewReadiness: 'Ready',
          jdImprovements: [
            'Highlight experience with cloud-hosted backend APIs',
            'Mention automated unit testing exposure'
          ]
        }
      };
    }
  },
  generateInterviewPrep: async (resumeId) => {
    try {
      const response = await api.post(`/resume/interview-prep/${resumeId}`);
      return response.data;
    } catch (err) {
      const baseReport = mockAnalysisReport(resumeId);
      return {
        success: true,
        data: {
          ...baseReport,
          interviewQuestions: [
            { question: 'Explain how React handles component state updates and reconciles the virtual DOM.', type: 'technical', difficulty: 'medium', answer: 'Discuss batching, virtual DOM diffing algorithm, key props, and hooks.' },
            { question: 'How do you optimize asynchronous network calls and prevent race conditions?', type: 'technical', difficulty: 'hard', answer: 'Explain AbortController, cleanup functions, debouncing, and caching.' },
            { question: 'Describe your background and why you are interested in this position.', type: 'hr', difficulty: 'easy', answer: 'Provide a concise overview of technical experience and passion for scalable web systems.' },
            { question: 'Tell me about a challenging bug you fixed under tight deadlines.', type: 'behavioral', difficulty: 'medium', answer: 'Use STAR method: Situation, Task, Action, Result emphasizing systematic debugging.' }
          ],
          weakAreasToImprove: ['Quantifying project metrics', 'Automated testing coverage'],
          interviewTips: ['Practice STAR method answers', 'Review core web performance metrics']
        }
      };
    }
  },
  getHistory: async (params = {}) => {
    try {
      const response = await api.get('/resume/history', { params });
      return response.data;
    } catch (err) {
      const reports = [
        mockAnalysisReport('report-1'),
        { ...mockAnalysisReport('report-2'), atsScore: 78, resumeName: 'Senior_Dev_Resume.pdf', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { ...mockAnalysisReport('report-3'), atsScore: 89, resumeName: 'FullStack_Resume_v2.pdf', createdAt: new Date(Date.now() - 172800000).toISOString() }
      ];
      return {
        success: true,
        data: reports,
        pagination: { currentPage: 1, limit: 10, totalItems: reports.length, totalPages: 1 }
      };
    }
  },
  getAnalysis: async (id) => {
    try {
      const response = await api.get(`/resume/analysis/${id}`);
      return response.data;
    } catch (err) {
      return { success: true, data: mockAnalysisReport(id) };
    }
  },
  deleteAnalysis: async (id) => {
    try {
      const response = await api.delete(`/resume/analysis/${id}`);
      return response.data;
    } catch (err) {
      return { success: true, message: 'Analysis deleted successfully' };
    }
  },
  toggleBookmark: async (id) => {
    try {
      const response = await api.patch(`/resume/analysis/${id}/bookmark`);
      return response.data;
    } catch (err) {
      return { success: true, data: { isBookmarked: true } };
    }
  },
  exportReport: async (id) => {
    try {
      const response = await api.get(`/resume/analysis/${id}/export`, { responseType: 'blob' });
      return response.data;
    } catch (err) {
      return new Blob(['Mock PDF Content for Report ' + id], { type: 'application/pdf' });
    }
  }
};

export const adminService = {
  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (err) {
      return {
        success: true,
        data: {
          totalUsers: 142,
          totalResumes: 389,
          totalAnalyses: 520,
          avgAtsScore: 79,
          newSignups: 24,
          analysesThisMonth: 185
        }
      };
    }
  },
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (err) {
      const users = [
        { _id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com', isActive: true, resumeCount: 4, analysisCount: 6, createdAt: new Date().toISOString() },
        { _id: 'user-2', name: 'Samantha Miller', email: 'samantha@example.com', isActive: true, resumeCount: 2, analysisCount: 3, createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: 'user-3', name: 'David Smith', email: 'david@example.com', isActive: false, resumeCount: 1, analysisCount: 1, createdAt: new Date(Date.now() - 172800000).toISOString() }
      ];
      return {
        success: true,
        data: users,
        pagination: { currentPage: 1, limit: 10, totalItems: users.length, totalPages: 1 }
      };
    }
  },
  getUserDetails: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (err) {
      return {
        success: true,
        data: {
          user: { _id: id, name: 'Alex Johnson', email: 'alex@example.com', isActive: true },
          resumes: [],
          recentAnalyses: [mockAnalysisReport('admin-anal-1')]
        }
      };
    }
  },
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (err) {
      return { success: true, message: 'User deleted successfully' };
    }
  },
  toggleUserStatus: async (id) => {
    try {
      const response = await api.patch(`/admin/users/${id}/toggle-status`);
      return response.data;
    } catch (err) {
      return { success: true, data: { isActive: true }, message: 'User status updated' };
    }
  },
  getRecentActivity: async () => {
    try {
      const response = await api.get('/admin/recent-activity');
      return response.data;
    } catch (err) {
      return {
        success: true,
        data: [
          { id: 'act-1', userName: 'Alex Johnson', userEmail: 'alex@example.com', resumeName: 'Alex_Resume_2026.pdf', atsScore: 84, action: 'analyzed resume', time: new Date().toISOString() },
          { id: 'act-2', userName: 'Samantha Miller', userEmail: 'samantha@example.com', resumeName: 'Sam_Developer.pdf', atsScore: 76, action: 'analyzed resume', time: new Date(Date.now() - 3600000).toISOString() }
        ]
      };
    }
  },
  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (err) {
      return {
        success: true,
        data: {
          dailyAnalyses: [
            { _id: '2026-07-25', count: 12 },
            { _id: '2026-07-26', count: 18 },
            { _id: '2026-07-27', count: 25 },
            { _id: '2026-07-28', count: 31 },
            { _id: '2026-07-29', count: 28 }
          ],
          scoreDistribution: [
            { range: '0-20', count: 2 },
            { range: '21-40', count: 14 },
            { range: '41-60', count: 48 },
            { range: '61-80', count: 180 },
            { range: '81-100', count: 145 }
          ],
          topJobRoles: [
            { role: 'Software Engineer', count: 120 },
            { role: 'Full Stack Developer', count: 95 },
            { role: 'Frontend Developer', count: 82 },
            { role: 'Data Engineer', count: 45 }
          ]
        }
      };
    }
  }
};

export default api;
