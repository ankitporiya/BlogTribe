import React, { useState } from "react";
import { motion } from "framer-motion";
// import RegisterPage from "../pages/RegisterPage";
import { useNavigate } from "react-router-dom";
import {
  PenTool,
  Users,
  Heart,
  MessageCircle,
  Search,
  Shield,
  TrendingUp,
  Star,
  Edit3,
  BookOpen,
  Globe,
  Zap,
  LogIn,
  UserPlus,
  Settings,
} from "lucide-react";

const LandingPage = ({ onSignIn, onSignUp }) => {
  const navigate = useNavigate();
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const features = [
    {
      icon: <Edit3 className="w-8 h-8" />,
      title: "Rich Text Editor",
      description:
        "Create beautiful blogs with our advanced rich text editor powered by Quill.js",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Likes & Comments",
      description:
        "Engage with your audience through likes and meaningful comments",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Search",
      description:
        "Find content easily with our intelligent search and category filtering",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Authentication",
      description:
        "JWT-based authentication ensures your account and data are protected",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Profile Management",
      description:
        "Customize your profile and manage all your authored blogs in one place",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Admin Dashboard",
      description:
        "Comprehensive admin panel to manage posts, users, and platform analytics",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Writers" },
    { number: "50K+", label: "Published Blogs" },
    { number: "100K+", label: "Monthly Readers" },
    { number: "99.9%", label: "Uptime" },
  ];

  const authButtons = [
    {
      icon: <LogIn className="w-5 h-5" />,
      title: "Sign In",
      description: "Access your existing account",
      gradient: "from-[#4A5568] to-[#718096]",
      hoverGradient: "from-[#718096] to-[#4A5568]",
      // onClick: onSignIn
      onClick: () => navigate("/login"),
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      title: "Sign Up",
      description: "Create a new account",
      gradient: "from-[#6A1E55] to-[#A64D79]",
      hoverGradient: "from-[#A64D79] to-[#6A1E55]",
      // onClick: onSignUp
      onClick: () => navigate("/register"),
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Admin Login",
      description: "Administrative access",
      gradient: "from-[#3B1C32] to-[#6A1E55]",
      hoverGradient: "from-[#6A1E55] to-[#3B1C32]",
      // onClick: onSignIn
      onClick: () => navigate("/login"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1D] via-[#3B1C32] to-[#6A1E55] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Logo */}
            <motion.div
              className="flex items-center justify-center space-x-3 mb-8"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-gradient-to-r from-[#6A1E55] to-[#A64D79] p-3 rounded-xl">
                <BookOpen className="w-8 h-8" />
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-[#A64D79] to-white bg-clip-text text-transparent">
                BlogSphere
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#A64D79] to-[#6A1E55] bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              Share Your Story
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Create, publish, and share your thoughts with the world. Join our
              community of passionate writers and readers.
            </motion.p>

            {/* Authentication Buttons */}
            <motion.div
              className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
              variants={staggerContainer}
            >
              {authButtons.map((button, index) => (
                <motion.div
                  onClick={button.onClick}
                  key={index}
                  className={`bg-gradient-to-r ${button.gradient} p-6 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer group`}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                      {button.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {button.title}
                    </h3>
                    <p className="text-sm text-gray-200">
                      {button.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <motion.button
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-gradient-to-r from-[#6A1E55] to-[#A64D79] rounded-lg text-lg font-semibold hover:from-[#A64D79] hover:to-[#6A1E55] transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PenTool className="w-5 h-5" />
                <span>Start Writing</span>
              </motion.button>
              <motion.button
                onClick={() => navigate("/login")}
                className="px-8 py-4 border border-[#A64D79] rounded-lg text-lg font-semibold hover:bg-[#A64D79]/20 transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-5 h-5" />
                <span>Explore Blogs</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1A1A1D]/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={scaleIn}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#A64D79] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#A64D79] to-white bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to create, manage, and share your content with
              the world
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#1A1A1D]/60 backdrop-blur-sm p-6 rounded-xl border border-[#3B1C32]/30 hover:border-[#A64D79]/50 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-[#A64D79] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#3B1C32] to-[#6A1E55]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Join thousands of writers who are already sharing their stories
              with the world
            </p>
            <motion.button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white text-[#1A1A1D] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-5 h-5" />
              <span>Get Started Now</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[#1A1A1D] border-t border-[#3B1C32]/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-[#6A1E55] to-[#A64D79] p-2 rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#A64D79] to-white bg-clip-text text-transparent">
                  BlogSphere
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Empowering writers and readers to connect through meaningful
                content. Built with modern technology and designed for the
                future.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#A64D79]">
                Quick Links
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#A64D79]">
                Community
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Writers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Readers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#3B1C32]/30 text-center text-gray-400">
            <p>&copy; 2024 BlogSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
