import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resumeService } from '../services/api';
import { InterviewQuestionCard } from '../components/analysis/InterviewQuestionCard';
import { Button } from '../components/common/Button';
import { toast } from 'react-hot-toast';
import {
  FiHelpCircle,
  FiAward,
  FiZap,
  FiBookOpen,
  FiInfo,
  FiLayers,
  FiAlertCircle,
  FiArrowLeft
} from 'react-icons/fi';

export const InterviewPrepPage = () => {
  const { resumeId: paramResumeId } = useParams();

  // States
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(paramResumeId || '');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const [activeTab, setActiveTab] = useState('technical'); // 'technical' | 'hr' | 'behavioral' | 'weaknesses' | 'tips'
  const [prepData, setPrepData] = useState(null);

  // Fetch history list for resume options dropdown
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
        toast.error('Failed to retrieve resumes.');
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [selectedResumeId]);

  // Load existing prep if present in the selected report
  useEffect(() => {
    if (!selectedResumeId) return;

    const findPrep = async () => {
      try {
        // Find existing report to see if questions are already present
        const res = await resumeService.getHistory({ limit: 50 });
        if (res.success) {
          const matched = res.data.find(
            r => (r.resumeId?._id || r.resumeId) === selectedResumeId
          );
          if (matched && matched.interviewQuestions && matched.interviewQuestions.length > 0) {
            setPrepData(matched);
          } else {
            setPrepData(null);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    findPrep();
  }, [selectedResumeId]);

  const handleGeneratePrep = async () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume first');
      return;
    }

    setGenerating(true);
    try {
      const res = await resumeService.generateInterviewPrep(selectedResumeId);
      if (res.success && res.data) {
        setPrepData(res.data);
        toast.success('AI Interview Preparation kit created successfully!');
      } else {
        toast.error('Generation failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI generation failed. Check API configuration.');
    } finally {
      setGenerating(false);
    }
  };

  // Group questions by type
  const getQuestions = () => {
    if (!prepData || !prepData.interviewQuestions) return [];
    return prepData.interviewQuestions.filter(q => q.type === activeTab);
  };

  const currentQuestions = getQuestions();

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          AI Interview Preparation Coach
        </h1>
        <p className="text-xs text-slate-500">
          Prepare for technical, behavioral, and HR questions generated from your resume.
        </p>
      </div>

      {/* Select resume parameters */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1 flex-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Select Resume Profile
          </label>
          {loadingHistory ? (
            <div className="h-10 w-full md:max-w-xs bg-slate-100 dark:bg-slate-850 rounded animate-pulse" />
          ) : resumes.length === 0 ? (
            <div className="text-xs text-slate-400">
              No resumes uploaded.{' '}
              <Link to="/upload" className="text-primary-500 font-bold hover:underline">
                Upload one here.
              </Link>
            </div>
          ) : (
            <select
              value={selectedResumeId}
              onChange={e => setSelectedResumeId(e.target.value)}
              className="w-full md:max-w-md text-sm font-semibold py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {resumes.map(r => (
                <option key={r._id} value={r.resumeId?._id || r.resumeId}>
                  {r.resumeName} ({new Date(r.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}
        </div>

        {!prepData && resumes.length > 0 && (
          <Button
            onClick={handleGeneratePrep}
            isLoading={generating}
            variant="primary"
            className="w-full md:w-auto py-3"
            rightIcon={<FiZap />}
          >
            Generate Custom Prep Kit
          </Button>
        )}
      </div>

      {generating ? (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Generating customized QAs with Gemini AI...
          </span>
        </div>
      ) : !prepData ? (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl p-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
          <FiHelpCircle size={32} className="opacity-40" />
          <h4 className="text-sm font-bold text-slate-655 dark:text-slate-350">No Prep Questions Found</h4>
          <p className="text-xs max-w-xs leading-relaxed">
            Click 'Generate Custom Prep Kit' to compile a list of 20 personalized HR and technical behavioral questions.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
            {['technical', 'hr', 'behavioral', 'weaknesses', 'tips'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap
                  ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-500 font-extrabold'
                      : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }
                `}
              >
                {tab === 'technical' ? 'Technical Stack' : tab === 'hr' ? 'HR Behavioral' : tab === 'behavioral' ? 'Situational' : tab === 'weaknesses' ? 'Gaps to Improve' : 'Interview Tips'}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="space-y-4">
            {/* Questions Tab Rendering */}
            {(activeTab === 'technical' || activeTab === 'hr' || activeTab === 'behavioral') && (
              <div className="space-y-4">
                {currentQuestions.length === 0 ? (
                  <div className="text-xs text-slate-400 py-4">No questions compiled in this category.</div>
                ) : (
                  currentQuestions.map((q, idx) => (
                    <InterviewQuestionCard
                      key={idx}
                      question={q.question}
                      type={q.type}
                      difficulty={q.difficulty}
                      answer={q.answer}
                    />
                  ))
                )}
              </div>
            )}

            {/* Weaknesses Tab Rendering */}
            {activeTab === 'weaknesses' && (
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-amber-500">
                  <FiAlertCircle size={18} />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Suggested Career/Profile Improvement Areas
                  </h3>
                </div>
                <div className="space-y-3 pt-2">
                  {(prepData.weakAreasToImprove || []).length === 0 ? (
                    <div className="text-xs text-slate-400">Perfect! No glaring resume gaps identified.</div>
                  ) : (
                    prepData.weakAreasToImprove.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        <span className="h-5 w-5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 font-bold flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 text-[10px]">
                          {idx + 1}
                        </span>
                        <p className="pt-0.5">{item}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tips Tab Rendering */}
            {activeTab === 'tips' && (
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-indigo-500">
                  <FiAward size={18} />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Pro Tips for Placement Success
                  </h3>
                </div>
                <div className="space-y-3 pt-2">
                  {(prepData.interviewTips || []).length === 0 ? (
                    <div className="text-xs text-slate-400">Practice questions, explain your metrics clearly, and structure with STAR.</div>
                  ) : (
                    prepData.interviewTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        <span className="h-5 w-5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 font-bold flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 text-[10px]">
                          ✓
                        </span>
                        <p className="pt-0.5">{tip}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrepPage;
