const User = require('../models/User');
const Resume = require('../models/Resume');
const AnalysisReport = require('../models/AnalysisReport');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responseHelper');
const fs = require('fs');

/**
 * Get Overall Dashboard Stats
 */
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalResumes = await Resume.countDocuments();
    const totalAnalyses = await AnalysisReport.countDocuments();

    // Average ATS Score
    const avgScoreResult = await AnalysisReport.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$atsScore' } } }
    ]);
    const avgAtsScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    // Recent user signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newSignups = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: sevenDaysAgo }
    });

    // Analyses in current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const analysesThisMonth = await AnalysisReport.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    return sendSuccess(res, {
      totalUsers,
      totalResumes,
      totalAnalyses,
      avgAtsScore,
      newSignups,
      analysesThisMonth
    }, 'Stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Paginated List of Users
 */
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = { role: 'user' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Append resume counts to users dynamically
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const resumeCount = await Resume.countDocuments({ userId: user._id });
        const analysisCount = await AnalysisReport.countDocuments({ userId: user._id });
        
        const userObj = user.getPublicProfile();
        return {
          ...userObj,
          resumeCount,
          analysisCount
        };
      })
    );

    return sendPaginated(res, usersWithStats, page, limit, total, 'User list retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Specific User Profile & History
 */
const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const resumes = await Resume.find({ userId: user._id }).sort('-createdAt');
    const analyses = await AnalysisReport.find({ userId: user._id }).sort('-createdAt').limit(5);

    return sendSuccess(res, {
      user: user.getPublicProfile(),
      resumes,
      recentAnalyses: analyses
    }, 'User details retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a User and their data
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Delete user files
    const resumes = await Resume.find({ userId: user._id });
    for (const resDoc of resumes) {
      if (fs.existsSync(resDoc.filePath)) {
        fs.unlinkSync(resDoc.filePath);
      }
      await Resume.findByIdAndDelete(resDoc._id);
    }

    // Delete analyses
    await AnalysisReport.deleteMany({ userId: user._id });

    // Delete user
    await User.findByIdAndDelete(user._id);

    return sendSuccess(res, null, 'User and all associated data deleted');
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle user active/inactive status
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    user.isActive = !user.isActive;
    await user.save();

    return sendSuccess(res, { isActive: user.isActive }, `User status toggled to ${user.isActive ? 'Active' : 'Inactive'}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Recent Upload & Analysis Feed
 */
const getRecentActivity = async (req, res, next) => {
  try {
    const reports = await AnalysisReport.find()
      .sort('-createdAt')
      .limit(20)
      .populate('userId', 'name email avatar');

    const activity = reports.map(r => ({
      id: r._id,
      userName: r.userId ? r.userId.name : 'Unknown User',
      userEmail: r.userId ? r.userId.email : '',
      avatar: r.userId ? r.userId.avatar : '',
      resumeName: r.resumeName,
      atsScore: r.atsScore,
      action: 'analyzed resume',
      time: r.createdAt
    }));

    return sendSuccess(res, activity, 'Recent activity feed retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Analytics Chart Data
 */
const getAnalyticsData = async (req, res, next) => {
  try {
    // 1. Analyses per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyAnalyses = await AnalysisReport.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 2. ATS Score Distribution
    const scoreRanges = await AnalysisReport.aggregate([
      {
        $bucket: {
          groupBy: '$atsScore',
          boundaries: [0, 21, 41, 61, 81, 101],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    // Mapping buckets to text ranges
    const rangeLabels = {
      0: '0-20',
      21: '21-40',
      41: '41-60',
      61: '61-80',
      81: '81-100'
    };
    const scoreDistribution = scoreRanges.map(b => ({
      range: rangeLabels[b._id] || 'Unknown',
      count: b.count
    }));

    // 3. Top predicted job roles
    const rawRoles = await AnalysisReport.aggregate([
      { $unwind: '$jobRoles' },
      { $group: { _id: '$jobRoles', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const topJobRoles = rawRoles.map(r => ({
      role: r._id,
      count: r.count
    }));

    return sendSuccess(res, {
      dailyAnalyses,
      scoreDistribution,
      topJobRoles
    }, 'Analytics chart data retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUsers,
  getUserDetails,
  deleteUser,
  toggleUserStatus,
  getRecentActivity,
  getAnalyticsData
};
