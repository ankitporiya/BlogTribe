const Blog = require('../models/Blog');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'durgwjdlg',
  api_key: process.env.CLOUDINARY_API_KEY || 482348242763615,
  api_secret: process.env.CLOUDINARY_API_SECRET || 'lPlc02hpwS0rRmkSwXbAJy9JDIA'
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (buffer, folder = 'blogs') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: folder,
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

// Create a new blog
const createBlog = async (req, res) => {
  try {
    //     console.log('Request body:', req.body);
    // console.log('Request file:', req.file);
    // console.log('Request headers:', req.headers);
    const { title, category, content, tags, published = true } = req.body;
    
    // Validate required fields
    if (!title || !category || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and content are required'
      });
    }
//     console.log('req.body:', req.body);
// console.log('req.file:', req.file);

    // Check if image is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Blog image is required'
      });
    }

    // Upload image to Cloudinary.
    const imageResult = await uploadToCloudinary(req.file.buffer);

    // Create blog
    const blog = new Blog({
      title,
      category,
      author: req.user.id || req.user.userId,
      image: {
        url: imageResult.secure_url,
        publicId: imageResult.public_id
      },
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      published: published === 'true'
    });

    await blog.save();
    await blog.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    
    // Delete uploaded image if blog creation fails
    if (req.file && error.name !== 'ValidationError') {
      try {
        await deleteFromCloudinary(imageResult?.public_id);
      } catch (deleteError) {
        console.error('Error deleting image:', deleteError);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error creating blog'
    });
  }
};

// Get all blogs with pagination and filters
const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 1000,
      category,
      author,
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { published: true };

    // Apply filters
    if (category) query.category = category;
    if (author) query.author = author;
    if (search) {
      query.$text = { $search: search };
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs'
    });
  }
};

// Get single blog by ID or slug
const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    const blog = await Blog.findOne({
      $or: [
        { _id: id },
        // { slug: id }
      ],
      published: true
    }).populate('author', 'name email')
      .populate('comments.user', 'name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog'
    });
  }
};

// Update blog (only by author or admin)
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, content, tags, published } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user is author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog'
      });
    }

    // Handle image update if provided
    if (req.file) {
      // Delete old image from Cloudinary
      await deleteFromCloudinary(blog.image.publicId);
      
      // Upload new image
      const imageResult = await uploadToCloudinary(req.file.buffer);
      blog.image = {
        url: imageResult.secure_url,
        publicId: imageResult.public_id
      };
    }

    // Update fields
    if (title) blog.title = title;
    if (category) blog.category = category;
    if (content) blog.content = content;
    if (tags) blog.tags = tags.split(',').map(tag => tag.trim());
    if (published !== undefined) blog.published = published === 'true';

    await blog.save();
    await blog.populate('author', 'name email');

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating blog'
    });
  }
};

// Delete blog (only by author or admin)
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user is author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }

    // Delete image from Cloudinary
    await deleteFromCloudinary(blog.image.publicId);

    // Delete blog
    await Blog.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog'
    });
  }
};

// Get user's blogs
const getUserBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.userId || req.user.id;

    const query = { author: userId };
    
    // If not admin and not own profile, only show published blogs
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      query.published = true;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user blogs'
    });
  }
};

// Like/Unlike blog
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Add like
      blog.likes.push(userId);
    } else {
      // Remove like
      blog.likes.splice(likeIndex, 1);
    }

    await blog.save();

    res.json({
      success: true,
      message: likeIndex === -1 ? 'Blog liked' : 'Blog unliked',
      likeCount: blog.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like'
    });
  }
};

// Add comment to blog
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const comment = {
      user: req.user.id,
      content: content.trim(),
      createdAt: new Date()
    };

    blog.comments.push(comment);
    await blog.save();

    // Populate the new comment
    await blog.populate('comments.user', 'name email');

    const newComment = blog.comments[blog.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
};

// Get blog statistics (admin only)
const getBlogStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ published: true });
    const draftBlogs = await Blog.countDocuments({ published: false });

    // Category distribution
    const categoryStats = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Top authors
    const topAuthors = await Blog.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $project: {
          name: '$author.name',
          email: '$author.email',
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        categoryStats,
        topAuthors
      }
    });
  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog statistics'
    });
  }
};

module.exports = {
  upload,
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
  toggleLike,
  addComment,
  getBlogStats
};