const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  getProfile,
  updateProfile,
  deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  handleValidation
} = require('../middleware/validate');

// Public routes
router.post('/register', validateRegister, handleValidation, register);
router.post('/login', validateLogin, handleValidation, login);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteAccount);

module.exports = router;
