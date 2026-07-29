const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const AnalysisReport = require('../models/AnalysisReport');
const pdfService = require('../services/pdfService');
const aiService = require('../services/aiService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responseHelper');
const User = require('../models/User');

/**
 * Handle Single Resume Upload
 */
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'Please upload a PDF or TXT resume', 400);
    }

    const { originalname, filename, path: filePath, size, mimetype } = req.file;

    // Extract text from the PDF/TXT
    let textContent = '';
    if (mimetype === 'application/pdf') {
      textContent = await pdfService.extractTextFromPDF(filePath);
    } else {
      // Text file
      textContent = fs.readFileSync(filePath, 'utf-8');
    }

    if (!textContent || textContent.trim().length === 0) {
      // Clean file
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return sendError(res, 'The uploaded file is empty or text extraction failed.', 400);
    }

    // Save Resume to database
    const resume = await Resume.create({
      userId: req.user._id,
      originalName: originalname,
      fileName: filename,
      filePath,
      fileSize: size,
      mimeType: mimetype,
      extractedText: textContent
    });

    return sendSuccess(res, { resumeId: resume._id }, 'Resume uploaded and processed successfully');
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * Perform AI Resume Analysis
 */
const analyzeResume = async (req, res, next) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return sendError(res, 'Resume not found', 404);
    }

    // Call Gemini API to analyze
    const analysis = await aiService.analyzeResume(resume.extractedText);

    // Create Report
    const report = await AnalysisReport.create({
      userId: req.user._id,
      resumeId: resume._id,
      resumeName: resume.originalName,
      atsScore: analysis.atsScore,
      summary: analysis.summary,
      matchingSkills: analysis.matchingSkills,
      missingSkills: analysis.missingSkills,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      improvements: analysis.improvements,
      jobRoles: analysis.jobRoles,
      courses: analysis.courses,
      keywords: analysis.keywords,
      experienceLevel: analysis.experienceLevel,
      educationLevel: analysis.educationLevel
    });

    // Mark Resume as Analyzed
    resume.isAnalyzed = true;
    await resume.save();

    return sendSuccess(res, report, 'Resume analysis generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Match Resume against Job Description
 */
const matchJobDescription = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { jdText } = req.body;
    let finalJdText = jdText || '';

    // Check if JD file is uploaded
    if (req.files && req.files.jd && req.files.jd[0]) {
      const jdFile = req.files.jd[0];
      if (jdFile.mimetype === 'application/pdf') {
        finalJdText = await pdfService.extractTextFromPDF(jdFile.path);
      } else {
        finalJdText = fs.readFileSync(jdFile.path, 'utf-8');
      }
      // Delete uploaded JD temp file
      if (fs.existsSync(jdFile.path)) fs.unlinkSync(jdFile.path);
    }

    if (!finalJdText || finalJdText.trim().length === 0) {
      return sendError(res, 'Please provide Job Description text or upload a JD document', 400);
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return sendError(res, 'Resume not found', 404);
    }

    // Call Gemini API to match
    const matchResults = await aiService.matchJobDescription(resume.extractedText, finalJdText);

    // Find latest analysis or create one
    let report = await AnalysisReport.findOne({ resumeId: resume._id }).sort({ createdAt: -1 });

    if (!report) {
      // Create a skeleton analysis report first
      report = new AnalysisReport({
        userId: req.user._id,
        resumeId: resume._id,
        resumeName: resume.originalName,
        atsScore: matchResults.jdMatchScore // Fallback
      });
    }

    // Update with JD matching data
    report.jdMatchScore = matchResults.jdMatchScore;
    report.jdText = finalJdText;
    report.jdMatchingKeywords = matchResults.jdMatchingKeywords;
    report.jdMissingKeywords = matchResults.jdMissingKeywords;
    report.jdMissingSkills = matchResults.jdMissingSkills;
    report.interviewReadiness = matchResults.interviewReadiness;
    report.jdImprovements = matchResults.jdImprovements;
    report.jdMatchingPercentage = matchResults.jdMatchingPercentage;

    await report.save();

    return sendSuccess(res, report, 'Job description comparison generated successfully');
  } catch (error) {
    // Cleanup any uploaded files in case of crash
    if (req.files && req.files.jd && req.files.jd[0] && fs.existsSync(req.files.jd[0].path)) {
      fs.unlinkSync(req.files.jd[0].path);
    }
    next(error);
  }
};

/**
 * Generate Interview Preparation Questions
 */
const generateInterviewPrep = async (req, res, next) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return sendError(res, 'Resume not found', 404);
    }

    // Find existing report to update
    let report = await AnalysisReport.findOne({ resumeId: resume._id }).sort({ createdAt: -1 });
    if (!report) {
      return sendError(res, 'Please run initial resume analysis before interview prep', 400);
    }

    // Call Gemini API to generate prep
    const prepData = await aiService.generateInterviewQuestions(resume.extractedText);

    // Update report
    report.interviewQuestions = [
      ...prepData.technicalQuestions.map(q => ({ ...q, type: 'technical' })),
      ...prepData.hrQuestions.map(q => ({ ...q, type: 'hr' })),
      ...prepData.behavioralQuestions.map(q => ({ ...q, type: 'behavioral' }))
    ];
    report.weakAreasToImprove = prepData.weakAreasToImprove;
    report.interviewTips = prepData.interviewTips;

    await report.save();

    return sendSuccess(res, report, 'AI Interview preparation questions generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch Analysis History
 */
const getHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', startDate, endDate, sort = '-createdAt', bookmarkedOnly } = req.query;

    const query = { userId: req.user._id };

    if (search) {
      query.resumeName = { $regex: search, $options: 'i' };
    }

    if (bookmarkedOnly === 'true') {
      query.isBookmarked = true;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const total = await AnalysisReport.countDocuments(query);
    const reports = await AnalysisReport.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('resumeId');

    return sendPaginated(res, reports, page, limit, total, 'History retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch Single Analysis Report
 */
const getAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await AnalysisReport.findOne({ _id: id, userId: req.user._id }).populate('resumeId');

    if (!report) {
      return sendError(res, 'Report not found', 404);
    }

    return sendSuccess(res, report, 'Analysis report retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Analysis Report and Associated Files
 */
const deleteAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await AnalysisReport.findOne({ _id: id, userId: req.user._id });

    if (!report) {
      return sendError(res, 'Report not found', 404);
    }

    // Find and delete the Resume file
    const resume = await Resume.findById(report.resumeId);
    if (resume) {
      if (fs.existsSync(resume.filePath)) {
        fs.unlinkSync(resume.filePath);
      }
      await Resume.findByIdAndDelete(resume._id);
    }

    await AnalysisReport.findByIdAndDelete(report._id);

    return sendSuccess(res, null, 'Analysis report and resume deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle bookmark state of a report
 */
const toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await AnalysisReport.findOne({ _id: id, userId: req.user._id });

    if (!report) {
      return sendError(res, 'Report not found', 404);
    }

    report.isBookmarked = !report.isBookmarked;
    await report.save();

    return sendSuccess(res, { isBookmarked: report.isBookmarked }, 'Bookmark status toggled successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Export Analysis Report as PDF
 */
const exportReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await AnalysisReport.findOne({ _id: id, userId: req.user._id });

    if (!report) {
      return sendError(res, 'Report not found', 404);
    }

    const user = req.user;
    const pdfBuffer = await pdfService.generateAnalysisReport(report, user);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Resume_Report_${report.atsScore}_Score.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    return res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  analyzeResume,
  matchJobDescription,
  generateInterviewPrep,
  getHistory,
  getAnalysis,
  deleteAnalysis,
  toggleBookmark,
  exportReport
};
