// // MainPage.jsx
// import React from 'react';
// import { useAuth } from '../components/AuthProvider';
// import { User } from 'lucide-react';

// const MainPage = () => {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold text-gray-800">BlogTribe - Main Page</h1>
//             <button
//               onClick={logout}
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//           <div className="text-center py-12">
//             <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//             <h2 className="text-xl font-semibold text-gray-700 mb-2">
//               Welcome, {user?.name}!
//             </h2>
//             <p className="text-gray-500">
//               This is the main page for regular users. Blog features will be implemented here. 
//               ANKIT
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainPage;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../components/AuthProvider';
import { User, FileText, PlusCircle, BookOpen, LogOut, Menu, X } from 'lucide-react';
import ProfilePage from '../components/Profile';
import BlogsPage from '../components/Blogs';
import CreateBlogPage from '../components/CreateBlogs';
import MyBlogsPage from '../components/MyBlogs';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { 
    x: -280, 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15,
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 12 }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05, 
    x: 8,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
};

const iconVariants = {
  hover: { 
    scale: 1.2, 
    rotate: 5,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
};

const loadingVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Mock components with Framer Motion
const Profile = () => (
  <motion.div 
    className="p-6" 
    style={{ background: 'linear-gradient(135deg, #1A1A1D 0%, #3B1C32 100%)' }}
    variants={contentVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
   
      <ProfilePage/>
    
  </motion.div>
);

const Blogs = () => (
  <motion.div 
    className="p-6 min-h-screen" 
    style={{ background: 'linear-gradient(135deg, #1A1A1D 0%, #6A1E55 100%)' }}
    variants={contentVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <BlogsPage/>
  </motion.div>
);

const CreateBlog = () => (
  <motion.div 
    className="p-6 min-h-screen" 
    style={{ background: 'linear-gradient(135deg, #3B1C32 0%, #A64D79 100%)' }}
    variants={contentVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >

      <CreateBlogPage/>
    </motion.div>
);

const MyBlogs = () => (
  <motion.div 
    className="p-6 min-h-screen" 
    style={{ background: 'linear-gradient(135deg, #1A1A1D 0%, #6A1E55 100%)' }}
    variants={contentVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <MyBlogsPage/>
  </motion.div>
);

const MainPage = () => {
  const { user, logout } = useAuth();
  const [activeComponent, setActiveComponent] = useState('blogs');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

// Fetch user profile
  const fetchProfile = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setProfileForm({
          name: data.user.name || '',
          phone: data.user.phone || '',
          bio: data.user.bio || '',
          profilePicture: data.user.profilePicture || ''
        });
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError('Error fetching profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User, component: Profile },
    { id: 'blogs', label: 'Blogs', icon: FileText, component: Blogs },
    { id: 'create', label: 'Create Blog', icon: PlusCircle, component: CreateBlog },
    { id: 'myblogs', label: 'My Blogs', icon: BookOpen, component: MyBlogs }
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeComponent)?.component || Blogs;

  // Loading screen
  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center" 
        style={{ background: 'linear-gradient(135deg, #1A1A1D 0%, #3B1C32 50%, #6A1E55 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <motion.div 
            className="w-16 h-16 border-4 border-white border-opacity-30 border-t-white rounded-full mx-auto mb-4"
            variants={loadingVariants}
            animate="animate"
          />
          <motion.h2 
            className="text-white text-xl font-semibold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading BlogTribe...
          </motion.h2>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen flex" 
      style={{ background: 'linear-gradient(135deg, #1A1A1D 0%, #3B1C32 50%, #6A1E55 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64
        ${sidebarOpen ? 'block' : 'hidden lg:block'}
      `}>
        <motion.div 
          className="h-full flex flex-col shadow-xl"
          style={{ background: 'linear-gradient(135deg, #1A1A1D 0%, #3B1C32 50%, #6A1E55 100%)' }}
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <motion.div 
            className="p-6 border-b border-gray-600"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <motion.h1 
                className="text-xl font-bold text-white"
                whileHover={{ scale: 1.05 }}
              >
                BlogTribe
              </motion.h1>
              <motion.button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>
          </motion.div>

          {/* Profile Section */}
          <motion.div 
            className="p-6 border-b border-gray-600"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-semibold shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(user?.name)
                )}
              </motion.div>
              <div>
                <motion.h3 
                  className="text-white font-semibold text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {user?.name || 'User'}
                </motion.h3>
                <motion.p 
                  className="text-gray-300 text-xs"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {user?.email || 'user@example.com'}
                </motion.p>
                <motion.p 
                  className="text-gray-300 text-xs"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                {user?.bio || ''}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.nav 
            className="flex-1 p-4 space-y-2"
            variants={itemVariants}
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveComponent(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${activeComponent === item.id 
                    ? 'bg-white bg-opacity-20 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }
                `}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <motion.div variants={iconVariants}>
                  <item.icon size={20} />
                </motion.div>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </motion.nav>

          {/* Logout Button */}
          <motion.div 
            className="p-4 border-t border-gray-600"
            variants={itemVariants}
          >
            <motion.button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500 hover:bg-opacity-20 hover:text-red-200 transition-all duration-200 group"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div variants={iconVariants}>
                <LogOut size={20} />
              </motion.div>
              <span className="font-medium">Logout</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <motion.div 
          className="lg:hidden shadow-md px-4 py-3 flex items-center justify-between" 
          style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={24} />
          </motion.button>
          <motion.h1 
            className="text-lg font-bold text-white"
            whileHover={{ scale: 1.05 }}
          >
            BlogTribe
          </motion.h1>
          <div className="w-10" />
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeComponent}
            className="h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MainPage;