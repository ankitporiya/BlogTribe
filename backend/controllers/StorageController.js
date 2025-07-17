const Blog = require('../models/Blog');
const User = require('../models/User');

// Helper function to convert bytes to human readable format
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Calculate estimated storage size for a document
const calculateDocumentSize = (doc) => {
  const jsonString = JSON.stringify(doc);
  return Buffer.byteLength(jsonString, 'utf8');
};

// Get storage usage statistics
const getStorageUsage = async (req, res) => {
  try {
    // Get total counts
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Get blogs with their estimated sizes
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .select('title content image comments likes createdAt');
    
    // Get users with their estimated sizes
    const users = await User.find()
      .select('name email profilePicture bio createdAt');
    
    // Calculate storage usage
    let blogStorageBytes = 0;
    let userStorageBytes = 0;
    let imageStorageEstimate = 0;
    
    // Calculate blog storage
    blogs.forEach(blog => {
      blogStorageBytes += calculateDocumentSize(blog);
      // Estimate image storage (assuming average image size of 500KB)
      if (blog.image && blog.image.url) {
        imageStorageEstimate += 500 * 1024; // 500KB per image
      }
    });
    
    // Calculate user storage
    users.forEach(user => {
      userStorageBytes += calculateDocumentSize(user);
      // Estimate profile picture storage (assuming average of 100KB)
      if (user.profilePicture) {
        imageStorageEstimate += 100 * 1024; // 100KB per profile picture
      }
    });
    
    // Calculate totals
    const totalDocumentStorage = blogStorageBytes + userStorageBytes;
    const totalEstimatedStorage = totalDocumentStorage + imageStorageEstimate;
    
    // Get category-wise blog distribution
    const categoryStats = await Blog.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgContentLength: { $avg: { $strLenCP: '$content' } }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // Get monthly growth data
    const monthlyGrowth = await Blog.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          blogCount: { $sum: 1 },
          totalContentLength: { $sum: { $strLenCP: '$content' } }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 12
      }
    ]);
    
    // Get top content creators
    const topCreators = await Blog.aggregate([
      {
        $group: {
          _id: '$author',
          blogCount: { $sum: 1 },
          totalContentLength: { $sum: { $strLenCP: '$content' } }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      {
        $unwind: '$authorInfo'
      },
      {
        $project: {
          name: '$authorInfo.name',
          email: '$authorInfo.email',
          blogCount: 1,
          totalContentLength: 1,
          estimatedStorage: { $multiply: ['$totalContentLength', 2] } // rough estimate
        }
      },
      {
        $sort: { blogCount: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Storage breakdown
    const storageBreakdown = {
      documents: {
        blogs: {
          count: totalBlogs,
          size: blogStorageBytes,
          formatted: formatBytes(blogStorageBytes)
        },
        users: {
          count: totalUsers,
          size: userStorageBytes,
          formatted: formatBytes(userStorageBytes)
        }
      },
      images: {
        estimated: imageStorageEstimate,
        formatted: formatBytes(imageStorageEstimate)
      },
      total: {
        documents: totalDocumentStorage,
        estimated: totalEstimatedStorage,
        documentsFormatted: formatBytes(totalDocumentStorage),
        estimatedFormatted: formatBytes(totalEstimatedStorage)
      }
    };
    
    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalBlogs,
          totalUsers,
          totalDocumentStorage: formatBytes(totalDocumentStorage),
          totalEstimatedStorage: formatBytes(totalEstimatedStorage)
        },
        breakdown: storageBreakdown,
        categoryStats,
        monthlyGrowth,
        topCreators: topCreators.map(creator => ({
          ...creator,
          estimatedStorage: formatBytes(creator.estimatedStorage)
        }))
      }
    });
    
  } catch (error) {
    console.error('Error getting storage usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get storage usage statistics',
      error: error.message
    });
  }
};

// Get storage usage for a specific user
const getUserStorageUsage = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's blogs
    const userBlogs = await Blog.find({ author: userId })
      .select('title content image comments likes createdAt');
    
    // Get user data
    const user = await User.findById(userId)
      .select('name email profilePicture bio createdAt');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Calculate storage usage
    let blogStorageBytes = 0;
    let imageStorageEstimate = 0;
    
    userBlogs.forEach(blog => {
      blogStorageBytes += calculateDocumentSize(blog);
      if (blog.image && blog.image.url) {
        imageStorageEstimate += 500 * 1024; // 500KB per image
      }
    });
    
    const userStorageBytes = calculateDocumentSize(user);
    if (user.profilePicture) {
      imageStorageEstimate += 100 * 1024; // 100KB for profile picture
    }
    
    const totalStorage = blogStorageBytes + userStorageBytes + imageStorageEstimate;
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          joinDate: user.createdAt
        },
        storage: {
          blogs: {
            count: userBlogs.length,
            size: blogStorageBytes,
            formatted: formatBytes(blogStorageBytes)
          },
          profile: {
            size: userStorageBytes,
            formatted: formatBytes(userStorageBytes)
          },
          images: {
            estimated: imageStorageEstimate,
            formatted: formatBytes(imageStorageEstimate)
          },
          total: {
            size: totalStorage,
            formatted: formatBytes(totalStorage)
          }
        }
      }
    });
    
  } catch (error) {
    console.error('Error getting user storage usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user storage usage',
      error: error.message
    });
  }
};

// Clean up old data (optional utility function)
const cleanupOldData = async (req, res) => {
  try {
    const { days = 365 } = req.query; // Default to 1 year
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    // Find old blogs
    const oldBlogs = await Blog.find({
      createdAt: { $lt: cutoffDate },
      published: false
    });
    
    let freedSpace = 0;
    oldBlogs.forEach(blog => {
      freedSpace += calculateDocumentSize(blog);
    });
    
    // Delete old unpublished blogs
    const deleteResult = await Blog.deleteMany({
      createdAt: { $lt: cutoffDate },
      published: false
    });
    
    res.status(200).json({
      success: true,
      message: `Cleanup completed. Deleted ${deleteResult.deletedCount} old blogs.`,
      data: {
        deletedBlogs: deleteResult.deletedCount,
        freedSpace: formatBytes(freedSpace)
      }
    });
    
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup old data',
      error: error.message
    });
  }
};

module.exports = {
  getStorageUsage,
  getUserStorageUsage,
  cleanupOldData
};