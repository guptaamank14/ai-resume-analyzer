import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { resumeService } from '../services/api';
import { Button } from '../components/common/Button';
import { toast } from 'react-hot-toast';
import { FiUploadCloud, FiFile, FiCheckCircle, FiCompass, FiZap, FiArrowRight } from 'react-icons/fi';

export const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      if (uploadedFile.type !== 'application/pdf' && uploadedFile.type !== 'text/plain') {
        toast.error('Only PDF and TXT files are accepted.');
        return;
      }
      setFile(uploadedFile);
      setResumeId(null); // Reset previous upload
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    }
  });

  const handleUploadAndAnalyze = async () => {
    if (!file && !resumeId) {
      toast.error('Please select or drop a PDF/TXT resume first.');
      return;
    }

    setUploading(true);
    try {
      let activeResumeId = resumeId;

      // Upload file first if not uploaded yet
      if (!activeResumeId && file) {
        const formData = new FormData();
        formData.append('resume', file);
        const uploadRes = await resumeService.uploadResume(formData);
        if (uploadRes.success && uploadRes.data) {
          activeResumeId = uploadRes.data.resumeId;
          setResumeId(activeResumeId);
        } else {
          toast.error(uploadRes.message || 'File upload failed.');
          setUploading(false);
          return;
        }
      }

      // Perform AI Analysis
      const analysisRes = await resumeService.analyzeResume(activeResumeId);
      if (analysisRes.success && analysisRes.data) {
        toast.success('Resume analysis generated successfully!');
        const targetId = analysisRes.data._id || analysisRes.data.resumeId || activeResumeId;
        navigate(`/analysis/${targetId}`);
      } else {
        toast.error(analysisRes.message || 'Analysis generation failed.');
      }
    } catch (error) {
      console.error('Error during analyze:', error);
      toast.error('Error occurred while generating analysis.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Upload & Analyze Resume
        </h1>
        <p className="text-xs text-slate-500">
          Upload your PDF or TXT resume to generate your ATS score, skills gap report, and actionable career suggestions.
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Dropzone container */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all
            ${isDragActive 
              ? 'border-primary-500 bg-primary-500/5' 
              : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-400 dark:hover:border-slate-700'
            }
          `}
        >
          <input {...getInputProps()} />
          
          <div className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center mb-4">
            <FiUploadCloud size={28} />
          </div>

          {file ? (
            <div className="space-y-1">
              <div className="flex items-center space-x-2 justify-center text-emerald-500 font-bold text-xs mb-1">
                <FiCheckCircle size={14} />
                <span>File Selected</span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-white">{file.name}</span>
              <p className="text-xs text-slate-450">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Drag & drop your resume file here
              </p>
              <p className="text-xs text-slate-400">or click to browse local files (PDF, TXT up to 10MB)</p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <Button
            onClick={handleUploadAndAnalyze}
            isLoading={uploading}
            disabled={!file && !resumeId}
            variant="primary"
            className="w-full py-3 text-base shadow-lg shadow-indigo-500/10 cursor-pointer"
            rightIcon={<FiZap />}
          >
            {uploading ? 'Analyzing Resume...' : 'Analyze Resume'}
          </Button>

          {resumeId && (
            <div className="flex justify-center">
              <Button
                onClick={() => navigate('/jd-matching', { state: { resumeId } })}
                variant="outline"
                size="sm"
                rightIcon={<FiCompass />}
              >
                Compare Against Job Description (JD Match)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
