//animated

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Using your original auth logic
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ Hook to navigate between pages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.message);
    } else {
      // ✅ Redirect based on role
      if (result.user.role === "admin") {
        navigate("/dashboard"); // or '/admin-panel'
      } else {
        navigate("/dashboard");
      }
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{
        background:
          "linear-gradient(135deg, #1A1A1D 0%, #3B1C32 50%, #6A1E55 100%)",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10"
        style={{ backgroundColor: "#1A1A1D", border: "1px solid #3B1C32" }}
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3"
            style={{ color: "#A64D79" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Login to BlogTribe
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base lg:text-lg mt-2"
            style={{ color: "#A64D79" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Welcome back! Please sign in to your account.
          </motion.p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="border rounded-lg mb-4 sm:mb-6 px-4 py-3 text-sm sm:text-base"
            style={{
              backgroundColor: "#3B1C32",
              borderColor: "#6A1E55",
              color: "#A64D79",
            }}
          >
            {error}
          </motion.div>
        )}

        <motion.form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <motion.div variants={itemVariants}>
            <label
              className="block text-sm sm:text-base font-medium mb-2 lg:mb-3"
              style={{ color: "#A64D79" }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: "#6A1E55" }}
              />
              <motion.input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 lg:py-4 rounded-lg outline-none text-sm sm:text-base transition-all duration-300 focus:ring-2"
                style={{
                  backgroundColor: "#3B1C32",
                  borderColor: "#6A1E55",
                  color: "#A64D79",
                  border: "1px solid #6A1E55",
                }}
                placeholder="Enter your email"
                required
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0 0 0 2px #A64D79",
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              className="block text-sm sm:text-base font-medium mb-2 lg:mb-3"
              style={{ color: "#A64D79" }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: "#6A1E55" }}
              />
              <motion.input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-2 sm:py-3 lg:py-4 rounded-lg outline-none text-sm sm:text-base transition-all duration-300 focus:ring-2"
                style={{
                  backgroundColor: "#3B1C32",
                  borderColor: "#6A1E55",
                  color: "#A64D79",
                  border: "1px solid #6A1E55",
                }}
                placeholder="Enter your password"
                required
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0 0 0 2px #A64D79",
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 flex items-center justify-center"
                style={{ color: "#6A1E55" }}
                whileHover={{ scale: 1.1, color: "#A64D79" }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </motion.button>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full py-2 sm:py-3 lg:py-4 px-4 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#A64D79",
              color: "#1A1A1D",
            }}
          >
            <motion.span
              animate={loading ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
              transition={loading ? { repeat: Infinity, duration: 1 } : {}}
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.span>
          </motion.button>
        </motion.form>

        <motion.div
          variants={itemVariants}
          className="mt-6 sm:mt-8 text-center"
        >
          <p className="text-sm sm:text-base" style={{ color: "#A64D79" }}>
            Don't have an account?{" "}
            <motion.button
              onClick={() => navigate("/register")}
              className="font-medium transition-colors duration-200"
              style={{ color: "#A64D79" }}
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 8px #A64D79",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Sign up here
            </motion.button>
          </p>
        </motion.div>

        {/* Demo credentials removed since using original auth */}
      </motion.div>
    </div>
  );
};

export default LoginPage;
