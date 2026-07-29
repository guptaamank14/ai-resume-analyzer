import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { resumeService } from '../services/api';
import { ATSScoreRing } from '../components/common/ATSScoreRing';
import { SkillsChart } from '../components/analysis/SkillsChart';
import { KeywordsCloud } from '../components/analysis/KeywordsCloud';
import { AnalysisSkeleton } from '../components/common/LoadingSkeleton';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { toast } from 'react-hot-toast';
import {
  FiDownload,
  FiArrowLeft,
  FiBookOpen,
  FiHelpCircle,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiExternalLink
} from 'react-icons/fi';
import { downloadFile } from '../utils/helpers';

export const AnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await resumeService.getAnalysis(id);
        if (res.success) {
          setReport(res.data);
        } else {
          toast.error(res.message || 'Report not found');
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to load analysis report');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate]);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const blob = await resumeService.exportReport(id);
      downloadFile(blob, `Resume_Analysis_Report_${id.slice(-6)}.pdf`);
      toast.success('PDF report exported successfully!');
    } catch (error) {
      toast.error('Failed to generate and download PDF report');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <AnalysisSkeleton />;
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm my-12">
        <div className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 flex items-center justify-center font-bold text-xl">
          !
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Analysis Report Not Found</h3>
          <p className="text-xs text-slate-500">
            The requested analysis report could not be retrieved or is being processed.
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard')} variant="primary" size="sm">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header breadcrumb bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/40">
        <div className="space-y-1">
          <Link
            to="/history"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors space-x-1.5"
          >
            <FiArrowLeft />
            <span>Back to Analyses History</span>
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white font-display truncate max-w-md">
            {report.resumeName}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            onClick={handleExportPDF}
            isLoading={exporting}
            variant="outline"
            size="sm"
            leftIcon={<FiDownload />}
          >
            Export PDF
          </Button>
          
          <Link to={`/jd-matching`} state={{ resumeId: report.resumeId?._id || report.resumeId }}>
            <Button variant="secondary" size="sm" leftIcon={<FiBookOpen />}>
              JD Match
            </Button>
          </Link>

          <Link to={`/interview-prep/${report.resumeId?._id || report.resumeId}`}>
            <Button variant="primary" size="sm" leftIcon={<FiHelpCircle />}>
              Interview Prep
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Score Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS score circular callout */}
        <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center col-span-1 min-h-[280px]">
          <ATSScoreRing score={report.atsScore} size="lg" />
        </div>

        {/* Overview fields */}
        <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 col-span-2 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
              Profile Evaluation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {report.summary || 'Summary not available.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Experience Level</span>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {report.experienceLevel || 'Not Specified'}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Education Level</span>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {report.educationLevel || 'Not Specified'}
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Matched Roles</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(report.jobRoles || []).slice(0, 2).map((role, idx) => (
                  <Badge key={idx} variant="info" size="sm">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills breakdown columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matching skills */}
        <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 space-y-3.5">
          <div className="flex items-center space-x-2 text-green-500 pb-2 border-b border-slate-100 dark:border-slate-800">
            <FiCheckCircle size={18} />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Matching Skills</h3>
          </div>
          <div className="flex flex-wrap gap-1.5 py-1">
            {(report.matchingSkills || []).length === 0 ? (
              <span className="text-slate-400 text-xs">No matching skills identified.</span>
            ) : (
              report.matchingSkills.map((sk, i) => (
                <Badge key={i} variant="success" size="md">
                  {sk}
                </Badge>
              ))
            )}
          </div>
        </div>

        {/* Missing skills */}
        <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 space-y-3.5">
          <div className="flex items-center space-x-2 text-red-500 pb-2 border-b border-slate-100 dark:border-slate-800">
            <FiXCircle size={18} />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Missing Skills</h3>
          </div>
          <div className="flex flex-wrap gap-1.5 py-1">
            {(report.missingSkills || []).length === 0 ? (
              <span className="text-slate-400 text-xs">Excellent! No missing standard skills.</span>
            ) : (
              report.missingSkills.map((sk, i) => (
                <Badge key={i} variant="error" size="md">
                  {sk}
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 space-y-3.5">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
            Resume Strengths
          </h3>
          <ul className="space-y-2 text-xs text-slate-650 dark:text-slate-350 list-disc pl-4 leading-relaxed">
            {(report.strengths || []).map((str, i) => (
              <li key={i}>{str}</li>
            ))}
          </ul>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 space-y-3.5">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
            Resume Weaknesses
          </h3>
          <ul className="space-y-2 text-xs text-slate-650 dark:text-slate-350 list-disc pl-4 leading-relaxed">
            {(report.weaknesses || []).map((wk, i) => (
              <li key={i}>{wk}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Analytics chart and cloud */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsChart
          matchingSkills={report.matchingSkills}
          missingSkills={report.missingSkills}
          keywords={report.keywords}
        />
        <KeywordsCloud keywords={report.keywords} />
      </div>

      {/* Concrete improvements suggestions */}
      <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
          Actionable Suggestions to Improve
        </h3>
        <div className="space-y-3">
          {(report.improvements || []).map((imp, idx) => (
            <div key={idx} className="flex items-start space-x-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <span className="h-5 w-5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 font-bold flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 text-[10px]">
                {idx + 1}
              </span>
              <p className="pt-0.5">{imp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Course recommendations list */}
      {report.courses && report.courses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 pb-1 border-b border-slate-200/60 dark:border-slate-800/40">
            Recommended Upskilling Paths
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {report.courses.map((course, idx) => (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-850 p-4 rounded-xl bg-white dark:bg-slate-900 flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                    {course.platform || 'Online Course'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    {course.title}
                  </h4>
                </div>
                {course.url && (
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-[10px] font-bold text-primary-500 hover:text-primary-600 space-x-1"
                  >
                    <span>View course</span>
                    <FiExternalLink />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
