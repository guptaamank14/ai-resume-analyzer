import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FiAward, FiUsers, FiTrendingUp, FiBookOpen } from 'react-icons/fi';

export const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-950">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Our Mission & Story
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
            We aim to empower job seekers by bringing transparency to applicant tracking systems (ATS) and providing personalized AI career coaches.
          </p>
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-xl space-y-3.5 shadow-sm">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center rounded-lg">
              <FiBookOpen size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-850 dark:text-white">Why We Built ResumeAI</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Job applications are frequently processed by parsing filters before reaching human eyes. Candidates are often rejected simply for formatting issues or missing keyword synonyms. We built this platform to level the playing field.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-xl space-y-3.5 shadow-sm">
            <div className="h-10 w-10 bg-purple-50 dark:bg-purple-950/20 text-purple-500 flex items-center justify-center rounded-lg">
              <FiTrendingUp size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-850 dark:text-white">Gemini AI Integration</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              By utilizing modern large language models, our software does not just look for keyword matches. It reads the resume contextually, evaluating experience density, recommending learning courses, and preparing prep Q&As.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
