import React, { useState, useEffect } from "react";
import {
  User,
  Edit2,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Phone,
  Mail,
  Calendar,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    bio: "",
    profilePicture: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setProfileForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
          bio: data.user.bio || "",
          profilePicture: data.user.profilePicture || "",
        });
      } else {
        setError(data.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      setError("Error fetching profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setSuccess("Profile updated successfully");
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Error updating profile: " + err.message);
    }
  };

  // Change password
  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();

      if (data.success) {
        setSuccess("Password changed successfully");
        setShowPasswordModal(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError("Error changing password: " + err.message);
    }
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  // Cancel edit
  const cancelEdit = () => {
    setIsEditing(false);
    setProfileForm({
      name: user.name || "",
      phone: user.phone || "",
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
    });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(""), 5000);
    }
  }, [error]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1D] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-full h-12 w-12 border-b-2 border-[#A64D79] animate-spin"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py- sm:py-8 px-2 sm:px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="bg-[#3B1C32] rounded-xl shadow-2xl border border-[#6A1E55] overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#6A1E55] to-[#A64D79] h-24 sm:h-32 relative">
            <div className="absolute -bottom-8 sm:-bottom-12 left-4 sm:left-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 sm:w-24 sm:h-24 bg-[#3B1C32] rounded-full p-1 shadow-lg border-2 border-[#A64D79]"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#1A1A1D] flex items-center justify-center">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-[#A64D79]" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          <div className="pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {user?.name}
                </h1>
                <p className="text-[#A64D79] text-sm sm:text-base">
                  {user?.email}
                </p>
                {user?.role === "admin" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center mt-2"
                  >
                    <Shield className="w-4 h-4 text-[#A64D79] mr-1" />
                    <span className="text-sm text-[#A64D79] font-medium">
                      Administrator
                    </span>
                  </motion.div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#6A1E55] border border-[#A64D79] rounded-lg hover:bg-[#A64D79] focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:ring-offset-2 focus:ring-offset-[#3B1C32] transition-colors duration-200"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </motion.button>
                {!isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#A64D79] border border-transparent rounded-lg hover:bg-[#6A1E55] focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:ring-offset-2 focus:ring-offset-[#3B1C32] transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </motion.button>
                ) : (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={cancelEdit}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#6A1E55] border border-[#A64D79] rounded-lg hover:bg-[#A64D79] focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:ring-offset-2 focus:ring-offset-[#3B1C32] transition-colors duration-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={updateProfile}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#3B1C32] transition-colors duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-red-900/50 border border-red-500 rounded-lg p-4 backdrop-blur-sm"
            >
              <div className="flex">
                <div className="text-red-200 text-sm">{error}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-green-900/50 border border-green-500 rounded-lg p-4 backdrop-blur-sm"
            >
              <div className="flex">
                <div className="text-green-200 text-sm">{success}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Information */}
        <motion.div
          variants={itemVariants}
          className="mt-6 sm:mt-8 bg-[#3B1C32] rounded-xl shadow-2xl border border-[#6A1E55]"
        >
          <div className="px-4 sm:px-8 py-6 border-b border-[#6A1E55]">
            <h2 className="text-lg font-semibold text-white">
              Profile Information
            </h2>
          </div>

          <div className="px-4 sm:px-8 py-6 space-y-6">
            {/* Name */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-[#A64D79] mb-2">
                Full Name
              </label>
              {isEditing ? (
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-[#1A1A1D] border border-[#6A1E55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                />
              ) : (
                <div className="flex items-center text-white">
                  <User className="w-4 h-4 mr-2 text-[#A64D79]" />
                  {user?.name}
                </div>
              )}
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-[#A64D79] mb-2">
                Email Address
              </label>
              <div className="flex items-center text-white">
                <Mail className="w-4 h-4 mr-2 text-[#A64D79]" />
                {user?.email}
                <span className="ml-2 text-xs text-gray-400">
                  (Cannot be changed)
                </span>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-[#A64D79] mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="tel"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-[#1A1A1D] border border-[#6A1E55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                />
              ) : (
                <div className="flex items-center text-white">
                  <Phone className="w-4 h-4 mr-2 text-[#A64D79]" />
                  {user?.phone || "Not provided"}
                </div>
              )}
            </motion.div>

            {/* Bio */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-[#A64D79] mb-2">
                Bio
              </label>
              {isEditing ? (
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#1A1A1D] border border-[#6A1E55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="text-white">
                  {user?.bio || "No bio provided"}
                </div>
              )}
            </motion.div>

            {/* Profile Picture URL */}
            {isEditing && (
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-[#A64D79] mb-2">
                  Profile Picture URL
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="url"
                  name="profilePicture"
                  value={profileForm.profilePicture}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-[#1A1A1D] border border-[#6A1E55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="https://example.com/profile.jpg"
                />
              </motion.div>
            )}

            {/* Account Details */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-[#6A1E55]"
            >
              <div>
                <label className="block text-sm font-medium text-[#A64D79] mb-2">
                  Account Status
                </label>
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      user?.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-white">
                    {user?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A64D79] mb-2">
                  Member Since
                </label>
                <div className="flex items-center text-white">
                  <Calendar className="w-4 h-4 mr-2 text-[#A64D79]" />
                  <span className="text-sm">
                    {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                  </span>
                </div>
              </div>

              {user?.lastLogin && (
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-[#A64D79] mb-2">
                    Last Login
                  </label>
                  <div className="text-white text-sm">
                    {formatDate(user.lastLogin)}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Password Change Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-[#3B1C32] rounded-xl shadow-2xl max-w-md w-full border border-[#6A1E55]"
              >
                <div className="px-6 py-4 border-b border-[#6A1E55]">
                  <h3 className="text-lg font-semibold text-white">
                    Change Password
                  </h3>
                </div>

                <div className="px-6 py-4 space-y-4">
                  {/* Alerts */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 bg-red-900/50 border border-red-500 rounded-lg p-4 backdrop-blur-sm"
                      >
                        <div className="flex">
                          <div className="text-red-200 text-sm">{error}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 bg-green-900/50 border border-green-500 rounded-lg p-4 backdrop-blur-sm"
                      >
                        <div className="flex">
                          <div className="text-green-200 text-sm">
                            {success}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div>
                    <label className="block text-sm font-medium text-[#A64D79] mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 bg-[#1A1A1D] border border-[#6A1E55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4 text-[#A64D79]" />
                        ) : (
                          <Eye className="w-4 h-4 text-[#A64D79]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A64D79] mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 bg-[#1A1A1D] border border-[#6A1E55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4 text-[#A64D79]" />
                        ) : (
                          <Eye className="w-4 h-4 text-[#A64D79]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A64D79] mb-2">
                      Confirm New Password
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 bg-[#1A1A1D] border border-[#6A1E55] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[#6A1E55] flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-[#6A1E55] border border-[#A64D79] rounded-lg hover:bg-[#A64D79] focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:ring-offset-2 focus:ring-offset-[#3B1C32] transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={changePassword}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-[#A64D79] border border-transparent rounded-lg hover:bg-[#6A1E55] focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:ring-offset-2 focus:ring-offset-[#3B1C32] transition-colors duration-200"
                  >
                    Change Password
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Profile;
