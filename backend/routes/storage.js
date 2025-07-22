// routes/storage.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const storageController = require('../controllers/StorageController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Rate limiting for storage routes
const storageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 50 requests per windowMs
  message: {
    success: false,
    message: 'Too many storage requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin middleware - checks if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};

// All storage routes require authentication and admin role
router.use(authMiddleware);
router.use(requireAdmin);
router.use(storageLimiter);

// Storage routes
router.get('/usage', storageController.getStorageUsage);
router.get('/user/:userId', storageController.getUserStorageUsage);
router.post('/cleanup', storageController.cleanupOldData);

module.exports = router;