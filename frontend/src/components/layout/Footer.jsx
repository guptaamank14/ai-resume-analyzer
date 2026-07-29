import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-white font-extrabold text-sm">
                AI
              </div>
              <span className="font-extrabold text-lg tracking-tight font-display text-white">
                ResumeAI
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Optimize your resume for modern Applicant Tracking Systems (ATS) and get ready for interviews with Google Gemini-powered insights.
            </p>
            <div className="flex space-x-3.5 pt-2">
              <a href="#" className="hover:text-white transition-colors"><FiTwitter size={16} /></a>
              <a href="#" className="hover:text-white transition-colors"><FiGithub size={16} /></a>
              <a href="#" className="hover:text-white transition-colors"><FiLinkedin size={16} /></a>
              <a href="#" className="hover:text-white transition-colors"><FiMail size={16} /></a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing Options</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SaaS Documentation</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Team Members</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog Insights</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers Hiring</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom divider & Copyright */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600">
          <p>© {new Date().getFullYear()} ResumeAI Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Powered by Google Gemini 1.5 Flash API</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
