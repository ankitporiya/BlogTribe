import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  User,
  Eye,
  Send,
  Loader,
  Brain,
} from "lucide-react";
// 1. Add this import at the top with other imports
// import { Heart, MessageCircle, X, ChevronLeft, ChevronRight, Filter, Calendar, User, Eye, Send, Loader, Brain } from 'lucide-react';
import AI from "../components/AI"; // Add this import

const API_BASE_URL = "http://localhost:5000/api";

const Blogs = () => {
  // 2. Add these two new state variables in the Blogs component (add them with other useState declarations)
  const [showAI, setShowAI] = useState(false);
  const [selectedAIBlog, setSelectedAIBlog] = useState(null);

  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [blogViews, setBlogViews] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const blogsPerPage = 9;

  // 3. Add this new function (add it with other functions like handleLike, handleAddComment, etc.)
  const handleAIClick = (blog) => {
    setSelectedAIBlog(blog);
    setShowAI(true);
  };

  // Check authentication status and get current user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName =
      localStorage.getItem("userName") || localStorage.getItem("name");

    console.log("Auth check:", { token: !!token, userId, userName }); // Debug log

    if (token) {
      setIsAuthenticated(true);
      setCurrentUser({ id: userId, name: userName });
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, []);

  // Show better error messages
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
  };

  // Show success message
  const showSuccess = (message) => {
    // You can implement a success message state similar to error
    console.log("Success:", message);
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Fetch blogs from API
  const fetchBlogs = async (page = 1, category = "All", search = "") => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: page.toString(),
        limit: blogsPerPage.toString(),
        sortBy: "createdAt",
        order: "desc",
      });

      if (category !== "All") params.append("category", category);
      if (search) params.append("search", search);

      const response = await fetch(`${API_BASE_URL}/blogs?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
        setPagination(data.pagination);

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set(data.blogs.map((blog) => blog.category)),
        ];
        setCategories(uniqueCategories);

        // Initialize view counts
        const viewCounts = {};
        data.blogs.forEach((blog) => {
          viewCounts[blog._id] = blog.views || 0;
        });
        setBlogViews(viewCounts);
      } else {
        showError(data.message || "Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single blog with comments
  const fetchBlogDetail = async (blogId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSelectedBlog(data.blog);
        // Update view count in local state
        setBlogViews((prev) => ({
          ...prev,
          [blogId]: data.blog.views || 0,
        }));
      } else {
        showError(data.message || "Failed to fetch blog details");
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      showError("Network error. Please try again.");
    }
  };

  // Toggle like - Fixed to work with backend response
  const handleLike = async (blogId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please login to like blogs");
      return;
    }

    if (likeLoading) return; // Prevent multiple clicks

    try {
      setLikeLoading(true);

      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update the blog in the blogs list
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) => {
            if (blog._id === blogId) {
              const updatedLikes = data.isLiked
                ? [...(blog.likes || []), currentUser.id]
                : (blog.likes || []).filter((id) => id !== currentUser.id);

              return {
                ...blog,
                likes: updatedLikes,
              };
            }
            return blog;
          })
        );

        // Update selected blog if it's open
        if (selectedBlog && selectedBlog._id === blogId) {
          const updatedLikes = data.isLiked
            ? [...(selectedBlog.likes || []), currentUser.id]
            : (selectedBlog.likes || []).filter((id) => id !== currentUser.id);

          setSelectedBlog((prev) => ({
            ...prev,
            likes: updatedLikes,
          }));
        }

        showSuccess(
          data.message || (data.isLiked ? "Blog liked!" : "Blog unliked!")
        );
      } else {
        showError(data.message || "Failed to like blog");
      }
    } catch (error) {
      console.error("Error liking blog:", error);
      showError("Network error. Please try again.");
    } finally {
      setLikeLoading(false);
    }
  };

  // Add comment - Fixed to work with backend response
  const handleAddComment = async (blogId) => {
    if (!isAuthenticated) {
      showError("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      showError("Please enter a comment");
      return;
    }

    if (commentLoading) return; // Prevent multiple submissions

    try {
      setCommentLoading(true);

      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update the selected blog with the new comment
        if (selectedBlog && selectedBlog._id === blogId) {
          setSelectedBlog((prev) => ({
            ...prev,
            comments: [...(prev.comments || []), data.comment],
          }));
        }

        // Update the comment count in the blogs list
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === blogId
              ? {
                  ...blog,
                  comments: [...(blog.comments || []), data.comment],
                }
              : blog
          )
        );

        setNewComment("");
        showSuccess(data.message || "Comment added successfully!");
      } else {
        showError(data.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      showError("Network error. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBlogs(currentPage, selectedCategory, searchTerm);
  }, [currentPage, selectedCategory, searchTerm]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle blog click
  const handleBlogClick = (blog) => {
    fetchBlogDetail(blog._id);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if user has liked a blog - Fixed to work with backend data
  const hasUserLiked = (blog) => {
    if (!currentUser || !blog.likes) return false;

    // Check if user ID is in the likes array
    return Array.isArray(blog.likes) && blog.likes.includes(currentUser.id);
  };

  // Get like count - Fixed to work with backend data
  const getLikeCount = (blog) => {
    if (!blog.likes) return 0;
    return Array.isArray(blog.likes) ? blog.likes.length : 0;
  };

  // Get comment count - Fixed to work with backend data
  const getCommentCount = (blog) => {
    if (!blog.comments) return 0;
    return Array.isArray(blog.comments) ? blog.comments.length : 0;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Blog
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover insights, tips, and stories from our community of experts
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search blogs..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[#A64D79] text-white"
                    : "bg-gray-800 bg-opacity-50 text-gray-400 hover:text-white hover:bg-[#1A1A1D]"
                }`}
              >
                <Filter className="w-4 h-4 inline mr-1" />
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Blog Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <AnimatePresence mode="wait">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl border border-gray-700"
              >
                <div className="relative">
                  <img
                    src={blog.image?.url || "/placeholder-image.jpg"}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-[#A64D79] rounded-full text-xs font-medium text-white">
                    {blog.category}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black bg-opacity-50 rounded-full text-xs font-medium text-white flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {blogViews[blog._id] || blog.views || 0}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {blog.title}
                  </h3>

                  <div className="flex items-center text-gray-300 text-sm mb-4 space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {blog.author?.name || "Unknown"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(blog.createdAt)}
                    </div>
                  </div>

                  <div className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {blog.content
                      ? blog.content.substring(0, 120) + "..."
                      : "No content available"}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleBlogClick(blog)}
                      className="flex items-center px-4 py-2 bg-[#A64D79] hover:bg-[#1A1A1D] rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Read More
                    </button>

                    <div className="flex items-center space-x-4 text-gray-300">
                      <button
                        onClick={() => handleAIClick(blog)}
                        className="flex items-center px-4 py-2 bg-[#A64D79] hover:bg-[#1A1A1D] rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
                        title="AI Insights"
                      >
                        <Brain className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleLike(blog._id)}
                        disabled={likeLoading}
                        className={`flex items-center hover:text-red-400 transition-colors ${
                          hasUserLiked(blog) ? "text-red-400" : ""
                        } ${
                          likeLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 mr-1 ${
                            hasUserLiked(blog) ? "fill-current" : ""
                          }`}
                        />
                        {getLikeCount(blog)}
                      </button>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {getCommentCount(blog)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center space-x-4"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className={`p-2 rounded-lg transition-all duration-300 ${
                !pagination.hasPrev
                  ? "text-gray-600 cursor-not-allowed bg-gray-800"
                  : "text-white bg-[#A64D79] hover:bg-[#1A1A1D] hover:scale-110"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-2">
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                    currentPage === index + 1
                      ? "bg-[#A64D79] text-white scale-110"
                      : "bg-gray-800 text-gray-400 hover:text-white hover:bg-[#1A1A1D]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
              className={`p-2 rounded-lg transition-all duration-300 ${
                !pagination.hasNext
                  ? "text-gray-600 cursor-not-allowed bg-gray-800"
                  : "text-white bg-[#A64D79] hover:bg-[#1A1A1D] hover:scale-110"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-[#1A1A1D] max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedBlog.image?.url || "/placeholder-image.jpg"}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black bg-opacity-50 rounded-full text-white text-sm flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {selectedBlog.views || 0} views
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="px-3 py-1 bg-[#A64D79] rounded-full text-sm font-medium text-white">
                    {selectedBlog.category}
                  </div>
                  <div className="flex items-center space-x-4 text-gray-300">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {selectedBlog.author?.name || "Unknown"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(selectedBlog.createdAt)}
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-6">
                  {selectedBlog.title}
                </h2>

                <div className="text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap">
                  {selectedBlog.content || "No content available"}
                </div>

                {/* Like and Comment Actions */}
                <div className="flex items-center space-x-6 mb-8">
                  <button
                    onClick={() => handleLike(selectedBlog._id)}
                    disabled={likeLoading}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      hasUserLiked(selectedBlog)
                        ? "bg-red-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-red-400"
                    } ${likeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        hasUserLiked(selectedBlog) ? "fill-current" : ""
                      }`}
                    />
                    <span>{getLikeCount(selectedBlog)}</span>
                  </button>

                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Comments ({getCommentCount(selectedBlog)})</span>
                  </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {showComments && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-700 pt-6"
                    >
                      <h3 className="text-xl font-bold text-white mb-4">
                        Comments
                      </h3>

                      {/* Add Comment */}
                      {isAuthenticated ? (
                        <div className="mb-6">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A64D79] resize-none"
                            rows="3"
                          />
                          <button
                            onClick={() => handleAddComment(selectedBlog._id)}
                            disabled={commentLoading || !newComment.trim()}
                            className="mt-3 px-6 py-2 bg-[#A64D79] hover:bg-[#1A1A1D] rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {commentLoading ? (
                              <Loader className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4 mr-2" />
                            )}
                            Post Comment
                          </button>
                        </div>
                      ) : (
                        <div className="mb-6 p-4 bg-gray-800 rounded-lg text-center">
                          <p className="text-gray-300">
                            Please login to comment
                          </p>
                        </div>
                      )}

                      {/* Comments List */}
                      <div className="space-y-4">
                        {selectedBlog.comments &&
                        selectedBlog.comments.length > 0 ? (
                          selectedBlog.comments.map((comment) => (
                            <motion.div
                              key={comment._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-gray-800 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-white">
                                  {comment.user?.name || "Anonymous"}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-300">{comment.content}</p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">
                              No comments yet. Be the first to comment!
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AI
        blog={selectedAIBlog}
        isOpen={showAI}
        onClose={() => setShowAI(false)}
      />
    </div>
  );
};

export default Blogs;
