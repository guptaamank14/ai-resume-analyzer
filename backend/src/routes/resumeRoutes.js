const express = require('express');
const router = express.Router();
const {
  uploadResume,
  analyzeResume,
  matchJobDescription,
  generateInterviewPrep,
  getHistory,
  getAnalysis,
  deleteAnalysis,
  toggleBookmark,
  exportReport
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');

// All routes are protected
router.use(protect);

router.post('/upload', uploadSingle, uploadResume);
router.post('/analyze/:resumeId', analyzeResume);
router.post('/match-jd/:resumeId', uploadMultiple, matchJobDescription);
router.post('/interview-prep/:resumeId', generateInterviewPrep);
router.get('/history', getHistory);
router.get('/analysis/:id', getAnalysis);
router.delete('/analysis/:id', deleteAnalysis);
router.patch('/analysis/:id/bookmark', toggleBookmark);
router.get('/analysis/:id/export', exportReport);

module.exports = router;
