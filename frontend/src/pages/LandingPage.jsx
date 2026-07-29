import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiCheckCircle,
  FiUpload,
  FiAward,
  FiZap,
  FiHelpCircle,
  FiTrendingUp,
  FiLayers,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
  FiTarget,
  FiBookOpen
} from 'react-icons/fi';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { value: '50k+', label: 'Resumes Analyzed' },
    { value: '95%', label: 'ATS Match Accuracy' },
    { value: '12k+', label: 'Candidates Placed' },
    { value: '4.9/5', label: 'User Rating' }
  ];

  const features = [
    {
      icon: <FiAward size={20} />,
      title: 'ATS Score Analyzer',
      description: 'Get an instant evaluation of your resume format and structure against industry-standard recruiter templates.'
    },
    {
      icon: <FiBookOpen size={20} />,
      title: 'Job Match Comparison',
      description: 'Upload a job description alongside your resume to identify missing keywords, skills, and match alignment.'
    },
    {
      icon: <FiZap size={20} />,
      title: 'AI Interview Prep Coach',
      description: 'Generate customized technical and HR behavioral interview questions based directly on your skills and career history.'
    },
    {
      icon: <FiTrendingUp size={20} />,
      title: 'Actionable Career Roadmap',
      description: 'Receive personalized list of online learning courses to bridge critical technical missing skill gaps.'
    },
    {
      icon: <FiLayers size={20} />,
      title: 'Keyword Density Cloud',
      description: 'Discover the density of keywords in your profile and optimize them to pass applicant tracking filters.'
    },
    {
      icon: <FiCheckCircle size={20} />,
      title: 'PDF Reports Downloads',
      description: 'Download beautifully formatted offline PDF analytical reports to review your improvement points anytime.'
    }
  ];

  const faqs = [
    {
      q: 'How does the ATS Resume Analyzer score my profile?',
      a: 'Our engine extracts text from your PDF and passes it to Google Gemini AI to review keyword density, phrasing, experience timelines, and educational parameters compared to typical hiring criteria.'
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. We only retain the uploaded file in local storage for analysis purposes and never share, sell, or index your personal information.'
    },
    {
      q: 'How does the Job Description Matching work?',
      a: 'When you upload a job description, our AI performs semantic comparison against your resume to identify exact missing skills and keywords required for that specific listing.'
    },
    {
      q: 'Can I export my analytical reports?',
      a: 'Yes, every generated analysis has an export option that compiles your ATS score, missing skills, improvements, and course suggestions into a professional PDF.'
    },
    {
      q: 'Is there a limit to how many resumes I can analyze?',
      a: 'Free tier users can upload and test up to 5 resumes. Standard premium subscriptions support unlimited analyses.'
    }
  ];

  const testimonials = [
    {
      quote: "ResumeAI completely changed my application approach. I went from getting zero responses to booking three interviews in a week after updating my keywords.",
      name: "Sophia Martinez",
      role: "Software Developer at Microsoft"
    },
    {
      quote: "The interview prep questions were spot on. The technical suggestions mapped exactly to what the recruiters ended up asking during the interview.",
      name: "Marcus Vance",
      role: "Data Analyst at Google"
    },
    {
      quote: "Being able to compare my resume directly with a job description saved me hours of guesswork. Highly recommend it to all job seekers.",
      name: "Emma Chen",
      role: "Product Manager at Stripe"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent dark:from-indigo-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-left"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/30 border border-primary-200/50 dark:border-primary-900/30 text-xs font-bold text-primary-600 dark:text-primary-400">
              <FiZap className="animate-pulse" />
              <span>Version 2.0 Gemini Powered</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-tight text-slate-900 dark:text-white">
              Land Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                AI-Driven
              </span>{' '}
              Resume Optimization
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-350 max-w-lg leading-relaxed">
              Verify your ATS score, identify missing technical skill gaps, compare your profile to job descriptions, and prepare for placement interviews with customized questions.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to={isAuthenticated ? "/upload" : "/login"}>
                <Button variant="primary" size="lg" rightIcon={<FiZap />}>
                  Analyze My Resume
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn How it Works
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating graphic mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:ml-6"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-2xl blur-3xl opacity-20 dark:opacity-30 transform -rotate-6 animate-pulse" />
            <div className="relative border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-bold text-slate-400">Score Metrics Mockup</span>
              </div>
              <div className="flex justify-around py-4">
                <div className="text-center">
                  <div className="text-4xl font-black text-emerald-500 font-display">88</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">ATS Score</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-indigo-500 font-display">92%</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">JD Match</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-purple-500 font-display">Entry</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Exp Level</div>
                </div>
              </div>
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">React & Redux integration</span>
                  <span className="text-green-500 font-bold">Matching</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">System Architecture Design</span>
                  <span className="text-red-500 font-bold">Missing</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-12 border-y border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl md:text-4xl font-extrabold text-primary-600 dark:text-primary-400 font-display">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-xs uppercase font-extrabold text-primary-600 dark:text-primary-400 tracking-widest">
            Core Utilities
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white">
            Everything You Need to Succeed
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            From scoring to interview preparation, we cover every angle of your recruitment journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl border border-slate-250/60 dark:border-slate-800 bg-white dark:bg-slate-900 text-left shadow-sm hover:border-slate-350 dark:hover:border-slate-800/80 transition-all duration-200"
            >
              <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center mb-4">
                {feat.icon}
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                {feat.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-100 dark:bg-dark-900 border-y border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-xs uppercase font-extrabold text-primary-600 dark:text-primary-400 tracking-widest">
              Success Stories
            </h2>
            <h3 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
              What Candidates Say
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, i) => (
              <div key={i} className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 text-left flex flex-col justify-between">
                <p className="text-sm italic text-slate-600 dark:text-slate-350 leading-relaxed mb-6">
                  "{test.quote}"
                </p>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{test.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{test.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs uppercase font-extrabold text-primary-600 dark:text-primary-400 tracking-widest">
            F.A.Q.
          </h2>
          <h3 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            Common Questions
          </h3>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left text-sm font-bold text-slate-800 dark:text-slate-100"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-tr from-primary-900 to-secondary-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-transparent to-transparent opacity-50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display">
            Start Scoring Your Resume For Free
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Get instant optimization advice, keyword tracking, and practice questions to prepare for placement interviews.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button variant="primary" size="lg" className="px-8 shadow-xl shadow-black/20">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
