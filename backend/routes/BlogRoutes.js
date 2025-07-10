const express = require('express');
const rateLimit = require('express-rate-limit');
const authMiddleware = require('../middleware/auth');
const blogController = require('../controllers/BlogController');

const router = express.Router();

// Rate limiting for blog operations
const blogLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many blog requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const createBlogLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // limit each IP to 10 blog creations per hour
  message: {
    success: false,
    message: 'Too many blog creation attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // limit each IP to 30 comments per 15 minutes
  message: {
    success: false,
    message: 'Too many comment attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes (no authentication required)
router.get('/', blogLimiter, blogController.getAllBlogs);
router.get('/:id', blogLimiter, blogController.getBlog);

// Protected routes (authentication required)
router.use(authMiddleware);

// Blog CRUD operations
router.post('/', authMiddleware,
  createBlogLimiter, 
  blogController.upload.single('image'), 
  blogController.createBlog
);

router.put('/:id', 
  blogLimiter, 
  blogController.upload.single('image'), 
  blogController.updateBlog
);

router.delete('/:id', blogLimiter, blogController.deleteBlog);

// User-specific blog routes
router.get('/user/:userId', blogLimiter, blogController.getUserBlogs);
router.get('/user/me/blogs', blogLimiter, blogController.getUserBlogs);

// Blog interactions
router.post('/:id/like', blogLimiter, blogController.toggleLike);
router.post('/:id/comments', commentLimiter, blogController.addComment);

// Admin routes
router.get('/admin/stats', blogLimiter, blogController.getBlogStats);

module.exports = router;