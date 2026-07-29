const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/responseHelper');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized to access this route', 401);
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return sendError(res, 'Not authorized, invalid token', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 'The user belonging to this token no longer exists', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'User account is deactivated. Please contact support.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Not authorized to access this route', 401);
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return sendError(res, 'Access denied, admin role required', 403);
  }
};

const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  protect,
  adminOnly,
  optionalAuth
};
