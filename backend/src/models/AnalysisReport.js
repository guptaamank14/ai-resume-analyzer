const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  word: String,
  count: Number,
  importance: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  }
});

const courseSchema = new mongoose.Schema({
  title: String,
  platform: String,
  url: String
});

const interviewQuestionSchema = new mongoose.Schema({
  question: String,
  type: {
    type: String,
    enum: ['technical', 'hr', 'behavioral'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  answer: String
});

const analysisReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true
    },
    resumeName: {
      type: String
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    summary: {
      type: String
    },
    matchingSkills: [String],
    missingSkills: [String],
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
    jobRoles: [String],
    courses: [courseSchema],
    keywords: [keywordSchema],
    experienceLevel: {
      type: String
    },
    educationLevel: {
      type: String
    },

    // Job Description Matching
    jdMatchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    jdText: {
      type: String,
      default: ''
    },
    jdMatchingKeywords: [String],
    jdMissingKeywords: [String],
    jdMissingSkills: [String],
    interviewReadiness: {
      type: String,
      enum: ['Not Ready', 'Partially Ready', 'Ready', 'Highly Ready', 'Not Evaluated'],
      default: 'Not Evaluated'
    },
    jdImprovements: [String],
    jdMatchingPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },

    // AI Interview Preparation
    interviewQuestions: [interviewQuestionSchema],
    weakAreasToImprove: [String],
    interviewTips: [String],

    isBookmarked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AnalysisReport', analysisReportSchema);
