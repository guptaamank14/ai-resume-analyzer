const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  getUserDetails,
  deleteUser,
  toggleUserStatus,
  getRecentActivity,
  getAnalyticsData
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes are protected and require admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/recent-activity', getRecentActivity);
router.get('/analytics', getAnalyticsData);

module.exports = router;
