import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X, ChevronLeft, ChevronRight, Filter, Calendar, User, Eye } from 'lucide-react';

const Blogs = () => {
  // Sample blog data
  const blogData = [
    {
      id: 1,
      title: "The Future of Web Development",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      author: "John Doe",
      date: "2024-03-15",
      content: "Web development is evolving rapidly with new technologies emerging every day. From AI-powered development tools to advanced frameworks, the landscape is constantly changing. This comprehensive guide explores the latest trends and what developers need to know to stay ahead in 2024 and beyond. We'll dive deep into emerging technologies, best practices, and the skills that will be most valuable in the coming years.",
      likes: 124,
      comments: 23
    },
    {
      id: 2,
      title: "Mastering React Hooks",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
      author: "Jane Smith",
      date: "2024-03-10",
      content: "React Hooks have revolutionized how we write React components. This in-depth tutorial covers everything from basic useState and useEffect to advanced custom hooks. Learn how to optimize your React applications and write cleaner, more maintainable code. We'll explore real-world examples and common patterns that every React developer should know.",
      likes: 89,
      comments: 15
    },
    {
      id: 3,
      title: "10 Healthy Recipes for Busy Professionals",
      category: "Health",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop",
      author: "Alice Johnson",
      date: "2024-03-08",
      content: "Maintaining a healthy diet while managing a busy professional life can be challenging. These 10 carefully curated recipes are designed for maximum nutrition with minimal preparation time. Each recipe includes detailed nutritional information and can be prepared in under 30 minutes. Perfect for meal prep and maintaining your health goals.",
      likes: 156,
      comments: 32
    },
    {
      id: 4,
      title: "Digital Marketing Trends 2024",
      category: "Business",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      author: "Bob Wilson",
      date: "2024-03-05",
      content: "The digital marketing landscape is constantly evolving. Stay ahead of the curve with these emerging trends that will shape marketing strategies in 2024. From AI-powered personalization to voice search optimization, discover what's next in digital marketing. Learn how to adapt your strategies and reach your target audience more effectively.",
      likes: 203,
      comments: 45
    },
    {
      id: 5,
      title: "The Art of Minimalist Design",
      category: "Design",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=250&fit=crop",
      author: "Sarah Davis",
      date: "2024-03-03",
      content: "Minimalist design isn't just about using less - it's about using the right elements to create maximum impact. This guide explores the principles of minimalist design and how to apply them effectively in your projects. Learn about color theory, typography, and spacing to create designs that are both beautiful and functional.",
      likes: 78,
      comments: 18
    },
    {
      id: 6,
      title: "Cryptocurrency Investment Guide",
      category: "Finance",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
      author: "Mike Brown",
      date: "2024-02-28",
      content: "Navigate the complex world of cryptocurrency investment with this comprehensive guide. Learn about different types of cryptocurrencies, risk management strategies, and how to build a balanced crypto portfolio. Whether you're a beginner or experienced investor, this guide provides valuable insights for making informed decisions.",
      likes: 267,
      comments: 56
    },
    {
      id: 7,
      title: "Mental Health in the Digital Age",
      category: "Health",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      author: "Dr. Emily Chen",
      date: "2024-02-25",
      content: "The digital age has brought unprecedented connectivity, but it has also created new challenges for mental health. This article explores the impact of technology on our psychological well-being and provides practical strategies for maintaining mental health in our increasingly connected world. Learn about digital detox techniques and healthy technology habits.",
      likes: 189,
      comments: 41
    },
    {
      id: 8,
      title: "Sustainable Business Practices",
      category: "Business",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
      author: "Green Corp Team",
      date: "2024-02-22",
      content: "Sustainability is no longer just a buzzword - it's a business imperative. This comprehensive guide explores how businesses can implement sustainable practices that benefit both the environment and their bottom line. From reducing carbon footprint to sustainable supply chain management, learn how to build a more sustainable business model.",
      likes: 142,
      comments: 29
    },
    {
      id: 9,
      title: "AI and Machine Learning Basics",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
      author: "Tech Innovators",
      date: "2024-02-20",
      content: "Artificial Intelligence and Machine Learning are transforming industries across the globe. This beginner-friendly guide breaks down complex AI concepts into digestible explanations. Learn about neural networks, deep learning, and how AI is being applied in various sectors. Perfect for anyone looking to understand the AI revolution.",
      likes: 312,
      comments: 67
    },
    {
      id: 10,
      title: "Photography Composition Tips",
      category: "Design",
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=250&fit=crop",
      author: "Visual Artist",
      date: "2024-02-18",
      content: "Great photography is about more than just having good equipment - it's about understanding composition. This guide covers essential composition techniques that will transform your photography. From the rule of thirds to leading lines, learn how to create visually compelling images that tell a story.",
      likes: 95,
      comments: 22
    },
    {
      id: 11,
      title: "Personal Finance Management",
      category: "Finance",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop",
      author: "Finance Expert",
      date: "2024-02-15",
      content: "Take control of your financial future with these proven personal finance strategies. Learn about budgeting, saving, investing, and debt management. This comprehensive guide provides practical tips for building wealth and achieving financial independence, regardless of your current financial situation.",
      likes: 178,
      comments: 34
    },
    {
      id: 12,
      title: "Remote Work Productivity",
      category: "Business",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop",
      author: "Remote Team",
      date: "2024-02-12",
      content: "Remote work has become the new normal for many professionals. This guide shares proven strategies for maintaining productivity while working from home. From setting up an effective workspace to managing time and communication, learn how to thrive in a remote work environment.",
      likes: 156,
      comments: 38
    }
  ];

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedBlogs, setLikedBlogs] = useState(new Set());
  const [blogLikes, setBlogLikes] = useState(
    blogData.reduce((acc, blog) => ({ ...acc, [blog.id]: blog.likes }), {})
  );
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');

  const blogsPerPage = 9;
  const categories = ['All', ...new Set(blogData.map(blog => blog.category))];

  // Filter blogs based on selected category
  const filteredBlogs = useMemo(() => {
    return selectedCategory === 'All' 
      ? blogData 
      : blogData.filter(blog => blog.category === selectedCategory);
  }, [selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const handleLike = (blogId) => {
    const newLikedBlogs = new Set(likedBlogs);
    if (likedBlogs.has(blogId)) {
      newLikedBlogs.delete(blogId);
      setBlogLikes(prev => ({ ...prev, [blogId]: prev[blogId] - 1 }));
    } else {
      newLikedBlogs.add(blogId);
      setBlogLikes(prev => ({ ...prev, [blogId]: prev[blogId] + 1 }));
    }
    setLikedBlogs(newLikedBlogs);
  };

  const handleAddComment = (blogId) => {
    if (newComment.trim()) {
      setComments(prev => ({
        ...prev,
        [blogId]: [
          ...(prev[blogId] || []),
          {
            id: Date.now(),
            text: newComment,
            author: 'You',
            date: new Date().toLocaleDateString()
          }
        ]
      }));
      setNewComment('');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -10, 
      transition: { duration: 0.3 } 
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen" >
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

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: selectedCategory === category ? '#A64D79' : '#3B1C32',
                  borderColor: selectedCategory === category ? '#A64D79' : '#6A1E55'
                }}
              >
                <Filter className="w-4 h-4 inline mr-1" />
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Blog Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <AnimatePresence mode="wait">
            {currentBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
                className="rounded-lg overflow-hidden shadow-xl"
                style={{ backgroundColor: '#3B1C32' }}
              >
                <div className="relative">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div 
                    className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: '#A64D79' }}
                  >
                    {blog.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-300 text-sm mb-4 space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {blog.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(blog.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: '#6A1E55' }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Read Article
                    </button>
                    
                    <div className="flex items-center space-x-4 text-gray-300">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {blogLikes[blog.id]}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {blog.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center space-x-4"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-all duration-300 ${
                currentPage === 1 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-white hover:scale-110'
              }`}
              style={{ backgroundColor: currentPage === 1 ? '#3B1C32' : '#6A1E55' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                    currentPage === index + 1
                      ? 'text-white scale-110'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: currentPage === index + 1 ? '#A64D79' : '#3B1C32'
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-all duration-300 ${
                currentPage === totalPages 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-white hover:scale-110'
              }`}
              style={{ backgroundColor: currentPage === totalPages ? '#3B1C32' : '#6A1E55' }}
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
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
              style={{ backgroundColor: '#1A1A1D' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: '#A64D79' }}
                  >
                    {selectedBlog.category}
                  </div>
                  <div className="flex items-center space-x-4 text-gray-300">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {selectedBlog.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(selectedBlog.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-6">
                  {selectedBlog.title}
                </h2>
                
                <div className="text-gray-300 leading-relaxed mb-8">
                  {selectedBlog.content}
                </div>
                
                {/* Like and Comment Actions */}
                <div className="flex items-center space-x-6 mb-8">
                  <button
                    onClick={() => handleLike(selectedBlog.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      likedBlogs.has(selectedBlog.id)
                        ? 'text-red-400'
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                    style={{ backgroundColor: '#3B1C32' }}
                  >
                    <Heart 
                      className={`w-5 h-5 ${likedBlogs.has(selectedBlog.id) ? 'fill-current' : ''}`} 
                    />
                    <span>{blogLikes[selectedBlog.id]}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-all duration-300"
                    style={{ backgroundColor: '#3B1C32' }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Comments ({(comments[selectedBlog.id] || []).length})</span>
                  </button>
                </div>
                
                {/* Comments Section */}
                <AnimatePresence>
                  {showComments && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t pt-6"
                      style={{ borderColor: '#3B1C32' }}
                    >
                      <h3 className="text-xl font-bold text-white mb-4">Comments</h3>
                      
                      {/* Add Comment */}
                      <div className="mb-6">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="w-full p-3 rounded-lg bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 resize-none"
                          style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}
                          rows="3"
                        />
                        <button
                          onClick={() => handleAddComment(selectedBlog.id)}
                          className="mt-3 px-6 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
                          style={{ backgroundColor: '#A64D79' }}
                        >
                          Post Comment
                        </button>
                      </div>
                      
                      {/* Comments List */}
                      <div className="space-y-4">
                        {(comments[selectedBlog.id] || []).map((comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-lg"
                            style={{ backgroundColor: '#3B1C32' }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">{comment.author}</span>
                              <span className="text-gray-400 text-sm">{comment.date}</span>
                            </div>
                            <p className="text-gray-300">{comment.text}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blogs;