import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resumeService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ATSScoreRing } from '../components/common/ATSScoreRing';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { toast } from 'react-hot-toast';
import {
  FiBookOpen,
  FiUploadCloud,
  FiFileText,
  FiZap,
  FiCheckCircle,
  FiInfo,
  FiArrowRight,
  FiAward
} from 'react-icons/fi';

export const JDMatchingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // States
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(location.state?.resumeId || '');
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [matchResults, setMatchResults] = useState(null);

  // Fetch resume list for dropdown select option
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const res = await resumeService.getHistory({ limit: 30 });
        if (res.success) {
          const list = res.data || [];
          setResumes(list);
          if (list.length > 0 && !selectedResumeId) {
            setSelectedResumeId(list[0].resumeId?._id || list[0].resumeId);
          }
        }
      } catch (error) {
        toast.error('Failed to retrieve uploaded resumes');
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [selectedResumeId]);

  const handleJdFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
        toast.error('Only PDF or TXT files allowed.');
        return;
      }
      setJdFile(file);
      setJdText(''); // Reset text box if file chosen
    }
  };

  const handleRunComparison = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      toast.error('Please select a resume first');
      return;
    }
    if (!jdText.trim() && !jdFile) {
      toast.error('Please provide job description text or upload a document file');
      return;
    }

    setProcessing(true);
    setMatchResults(null);

    try {
      const res = await resumeService.matchJobDescription(selectedResumeId, jdText, jdFile);
      if (res.success && res.data) {
        setMatchResults(res.data);
        toast.success('Job description comparison generated!');
      } else {
        toast.error(res.message || 'Comparison failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to analyze comparison');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Job Description Matcher
        </h1>
        <p className="text-xs text-slate-500">
          Paste a job description or upload a JD document to review alignment, missing skills, and interview readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Select Resume & Input JD */}
        <div className="lg:col-span-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm space-y-5 h-fit">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
            Configure Matcher Parameters
          </h3>

          <form onSubmit={handleRunComparison} className="space-y-5">
            {/* Resume select dropdown */}
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                1. Select Resume
              </label>
              {loadingHistory ? (
                <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              ) : resumes.length === 0 ? (
                <div className="text-xs text-slate-400">
                  No resumes uploaded.{' '}
                  <Link to="/upload" className="text-primary-500 font-bold hover:underline">
                    Upload one here first.
                  </Link>
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={e => setSelectedResumeId(e.target.value)}
                  className="w-full text-sm font-semibold py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  {resumes.map(r => (
                    <option key={r._id} value={r.resumeId?._id || r.resumeId}>
                      {r.resumeName} ({new Date(r.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Paste JD Text */}
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                2. Job Description Text
              </label>
              <textarea
                rows={6}
                placeholder="Paste the job description criteria, requirements, and responsibilities details here..."
                value={jdText}
                onChange={e => {
                  setJdText(e.target.value);
                  if (e.target.value) setJdFile(null); // Clear file if text entered
                }}
                disabled={!!jdFile}
                className="w-full text-xs font-medium p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-40"
              />
            </div>

            <div className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest my-1">
              - OR -
            </div>

            {/* Upload JD File */}
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Upload JD Document
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleJdFileChange}
                  accept=".pdf,.txt"
                  className="absolute inset-0 opacity-0 w-full cursor-pointer z-10"
                />
                <div className="border border-dashed border-slate-350 dark:border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                  <FiUploadCloud className="text-slate-400 mb-1" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {jdFile ? jdFile.name : 'Select JD PDF or TXT'}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-4"
              isLoading={processing}
              disabled={resumes.length === 0}
              rightIcon={<FiZap />}
            >
              Compare Alignment
            </Button>
          </form>
        </div>

        {/* Right Panel: Results Display */}
        <div className="lg:col-span-2 space-y-6">
          {processing ? (
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Running semantic gap comparisons...
              </span>
            </div>
          ) : !matchResults ? (
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl p-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
              <FiBookOpen size={32} className="opacity-40" />
              <h4 className="text-sm font-bold text-slate-650 dark:text-slate-300">No Match Computed</h4>
              <p className="text-xs max-w-xs leading-relaxed">
                Configure your select resume and job description parameter keys on the left panel to execute comparison checks.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score breakdown metrics cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Match Score */}
                <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center space-y-3">
                  <ATSScoreRing score={matchResults.jdMatchScore} size="md" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">
                    JD Match Score
                  </span>
                </div>

                {/* Readiness parameters */}
                <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">
                      Interview Readiness status
                    </span>
                    <div className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                      <FiAward className="text-indigo-500" />
                      <span>{matchResults.interviewReadiness || 'Ready'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Matching Percentage</span>
                      <span>{matchResults.jdMatchingPercentage || matchResults.jdMatchScore}%</span>
                    </div>
                    <ProgressBar
                      value={matchResults.jdMatchingPercentage || matchResults.jdMatchScore}
                      color="bg-gradient-to-r from-primary-500 to-secondary-500"
                      showPercentage={false}
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <Button
                      onClick={() => navigate(`/interview-prep/${selectedResumeId}`)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      rightIcon={<FiArrowRight />}
                    >
                      Go to Interview Prep Coach
                    </Button>
                  </div>
                </div>
              </div>

              {/* Keywords Gap tags lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm space-y-3">
                  <span className="text-[10px] uppercase font-bold text-green-500 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1.5 block">
                    Matching JD Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(matchResults.jdMatchingKeywords || []).length === 0 ? (
                      <span className="text-xs text-slate-450">No overlap detected.</span>
                    ) : (
                      matchResults.jdMatchingKeywords.map((kw, i) => (
                        <Badge key={i} variant="success" size="sm">
                          {kw}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm space-y-3">
                  <span className="text-[10px] uppercase font-bold text-red-500 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1.5 block">
                    Missing Required Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(matchResults.jdMissingKeywords || []).length === 0 ? (
                      <span className="text-xs text-slate-450">Excellent! Fully matched.</span>
                    ) : (
                      matchResults.jdMissingKeywords.map((kw, i) => (
                        <Badge key={i} variant="error" size="sm">
                          {kw}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm space-y-3.5">
                <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-200 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1.5 block">
                  Missing Skills Gap analysis
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(matchResults.jdMissingSkills || []).length === 0 ? (
                    <span className="text-xs text-slate-450">No matching gaps identified.</span>
                  ) : (
                    matchResults.jdMissingSkills.map((sk, i) => (
                      <Badge key={i} variant="warning" size="md">
                        {sk}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {/* Tailored JD matching suggestions */}
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-200 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1.5 block">
                  How to Optimize for this Role
                </span>
                <div className="space-y-3">
                  {(matchResults.jdImprovements || []).map((imp, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs leading-relaxed text-slate-650 dark:text-slate-300">
                      <span className="h-5 w-5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 font-bold flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 text-[10px]">
                        {idx + 1}
                      </span>
                      <p className="pt-0.5">{imp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JDMatchingPage;
