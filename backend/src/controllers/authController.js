const User = require('../models/User');
const Resume = require('../models/Resume');
const AnalysisReport = require('../models/AnalysisReport');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * Register a new user.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'A user with this email address already exists', 400);
    }

    // Determine role based on ADMIN_EMAIL env
    let role = 'user';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    if (email.toLowerCase() === adminEmail.toLowerCase()) {
      role = 'admin';
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return sendSuccess(
      res,
      {
        user: user.getPublicProfile(),
        token
      },
      'Registration successful',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login user.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Check if active
    if (!user.isActive) {
      return sendError(res, 'This account is deactivated', 403);
    }

    // Update login timestamp
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    return sendSuccess(
      res,
      {
        user: user.getPublicProfile(),
        token
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password (UI flow representation).
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'No user found with that email address', 404);
    }

    // SMTP email integration is mocked/UI-only as per instructions.
    // Return success message.
    return sendSuccess(
      res,
      null,
      'If this email exists in our system, password reset instructions have been sent.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile.
 */
const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Fetch stats
    const resumeCount = await Resume.countDocuments({ userId: user._id });
    const analysisCount = await AnalysisReport.countDocuments({ userId: user._id });

    return sendSuccess(
      res,
      {
        user: user.getPublicProfile(),
        stats: {
          resumesUploaded: resumeCount,
          reportsGenerated: analysisCount
        }
      },
      'Profile retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile details.
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, phone, location, avatar, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Edit properties
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (avatar !== undefined) user.avatar = avatar;

    // Handle password update if requested
    if (newPassword) {
      if (!currentPassword) {
        return sendError(res, 'Current password is required to change password', 400);
      }
      
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return sendError(res, 'Current password does not match', 400);
      }

      user.password = newPassword;
    }

    await user.save();

    const token = generateToken(user._id);

    return sendSuccess(
      res,
      {
        user: user.getPublicProfile(),
        token
      },
      'Profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete account and all associated documents.
 */
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Delete user's resumes
    await Resume.deleteMany({ userId });
    
    // Delete user's analysis reports
    await AnalysisReport.deleteMany({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    return sendSuccess(res, null, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  getProfile,
  updateProfile,
  deleteAccount
};
