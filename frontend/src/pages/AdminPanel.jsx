////////////////charts/////

import React, { useState, useEffect, useRef } from "react";
import Storage from "../components/Storage";
import { useAuth } from "../components/AuthProvider";
import {
  Shield,
  Users,
  FileText,
  BarChart3,
  Search,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  Filter,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import * as Chart from "chart.js";

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [blogStats, setBlogStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState({}); // Track loading state for individual actions
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  // API base URL
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch users
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        `${VITE_API_BASE_URL}/api/auth/users?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication failed. Please login again.");
          logout();
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch blog statistics
  const fetchBlogStats = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        `${VITE_API_BASE_URL}/api/blogs/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication failed. Please login again.");
          logout();
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setBlogStats(data.stats);
      } else {
        setError(data.message || "Failed to fetch blog stats");
      }
    } catch (err) {
      console.error("Fetch blog stats error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        `${VITE_API_BASE_URL}/api/auth/users/${userId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication failed. Please login again.");
          logout();
          return;
        }
        if (response.status === 400) {
          setError("ADMIN can't deactivate themselves");
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        // Update local state
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, isActive: !u.isActive } : u
          )
        );
      } else {
        setError(data.message || "Failed to toggle user status");
      }
    } catch (err) {
      console.error("Toggle user status error:", err);
      setError(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    // Prevent user from deleting themselves
    if (userId === user?._id) {
      setError("You cannot delete your own account");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        `${VITE_API_BASE_URL}/api/auth/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication failed. Please login again.");
          logout();
          return;
        }
        if (response.status === 403) {
          setError("You do not have permission to delete this user.");
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        // Remove from local state
        setUsers(users.filter((u) => u._id !== userId));

        // Update pagination if needed
        if (filteredUsers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          // Refresh current page to get accurate count
          fetchUsers(currentPage);
        }
      } else {
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete user error:", err);
      setError(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Refresh data
  const refreshData = async () => {
    setRefreshing(true);
    if (activeTab === "users") {
      await fetchUsers(currentPage);
    } else if (activeTab === "overview") {
      await fetchBlogStats();
    }
    setRefreshing(false);
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load initial data
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers(currentPage);
    } else if (activeTab === "overview") {
      fetchBlogStats();
    }
  }, [activeTab, currentPage]);

  // Create charts when blogStats is available
  useEffect(() => {
    if (blogStats && activeTab === "overview") {
      createPieChart();
      createBarChart();
    }

    // Cleanup function
    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
    };
  }, [blogStats, activeTab]);

  // Create pie chart for category distribution
  const createPieChart = () => {
    if (!pieChartRef.current || !blogStats) return;

    // Destroy existing chart
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
    }

    const ctx = pieChartRef.current.getContext("2d");

    // Register Chart.js components
    Chart.Chart.register(
      Chart.ArcElement,
      Chart.Tooltip,
      Chart.Legend,
      Chart.Title,
      Chart.PieController
    );

    // const colors = ['#6A1E55', '#A64D79', '#3B1C32', '#8B4D6D', '#5A1A47', '#7A2F5A', '#4A1538', '#9A5F82'];
    const colors = [
      "#1E88E5", // Blue
      "#43A047", // Green
      "#FB8C00", // Orange
      "#E53935", // Red
      "#8E24AA", // Purple
      "#00ACC1", // Cyan
      "#FDD835", // Yellow
      "#6D4C41", // Brown
    ];
    pieChartInstance.current = new Chart.Chart(ctx, {
      type: "pie",
      data: {
        labels: blogStats.categoryStats.map((cat) => cat._id),
        datasets: [
          {
            data: blogStats.categoryStats.map((cat) => cat.count),
            backgroundColor: colors,
            borderColor: "#1A1A1D",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#A64D79",
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: "#1A1A1D",
            titleColor: "#FFFFFF",
            bodyColor: "#A64D79",
            borderColor: "#6A1E55",
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  };

  // Create bar chart for top authors
  const createBarChart = () => {
    if (!barChartRef.current || !blogStats) return;

    // Destroy existing chart
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }

    const ctx = barChartRef.current.getContext("2d");

    // Register Chart.js components
    Chart.Chart.register(
      Chart.BarElement,
      Chart.CategoryScale,
      Chart.LinearScale,
      Chart.Tooltip,
      Chart.Legend,
      Chart.Title,
      Chart.BarController
    );

    barChartInstance.current = new Chart.Chart(ctx, {
      type: "bar",
      data: {
        labels: blogStats.topAuthors.map((author) => author.name),
        datasets: [
          {
            label: "Number of Blogs",
            data: blogStats.topAuthors.map((author) => author.count),
            backgroundColor: [
              "#1E88E5",
              "#43A047",
              "#FB8C00",
              "#E53935",
              "#8E24AA",
              "#00ACC1",
              "#FDD835",
              "#6D4C41",
            ],
            borderColor: [
              "#1565C0",
              "#2E7D32",
              "#EF6C00",
              "#C62828",
              "#6A1B9A",
              "#00838F",
              "#FBC02D",
              "#4E342E",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#1A1A1D",
            titleColor: "#FFFFFF",
            bodyColor: "#A64D79",
            borderColor: "#6A1E55",
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#A64D79",
              stepSize: 1,
            },
            grid: {
              color: "#6A1E55",
            },
          },
          x: {
            ticks: {
              color: "#A64D79",
            },
            grid: {
              color: "#6A1E55",
            },
          },
        },
      },
    });
  };

  const StatCard = ({ title, value, icon: Icon, color = "bg-[#6A1E55]" }) => (
    <div className="bg-[#3B1C32] rounded-lg p-6 border border-[#6A1E55]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#A64D79] text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active
          ? "bg-[#6A1E55] text-white"
          : "text-[#A64D79] hover:text-white hover:bg-[#3B1C32]"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  // Colors for pie chart
  const COLORS = [
    "#6A1E55",
    "#A64D79",
    "#3B1C32",
    "#8B4D6D",
    "#5A1A47",
    "#7A2F5A",
    "#4A1538",
    "#9A5F82",
  ];

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1D] p-3 border border-[#6A1E55] rounded-lg">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-[#A64D79]">{payload[0].value} blogs</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1D] p-3 border border-[#6A1E55] rounded-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-[#A64D79]">{payload[0].value} blogs</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#1A1A1D] text-white">
      {/* Header */}
      <div className="bg-[#3B1C32] border-b border-[#6A1E55] px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-[#6A1E55] p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">BlogTribe Admin Panel</h1>
              <p className="text-[#A64D79]">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-[#3B1C32] hover:bg-[#6A1E55] rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#3B1C32] border-b border-[#6A1E55] px-6 py-3">
        <div className="flex space-x-4">
          <TabButton
            id="overview"
            label="Overview"
            icon={BarChart3}
            active={activeTab === "overview"}
          />
          <TabButton
            id="users"
            label="Users"
            icon={Users}
            active={activeTab === "users"}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 bg-red-900 border border-red-700 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-300">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6A1E55] mx-auto"></div>
                <p className="mt-4 text-[#A64D79]">Loading statistics...</p>
              </div>
            ) : blogStats ? (
              <div className="space-y-6">
                {/* Blog Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Blogs"
                    value={blogStats.totalBlogs}
                    icon={FileText}
                    color="bg-blue-600"
                  />
                  <StatCard
                    title="Published Blogs"
                    value={blogStats.publishedBlogs}
                    icon={Eye}
                    color="bg-green-600"
                  />
                  <StatCard
                    title="Draft Blogs"
                    value={blogStats.draftBlogs}
                    icon={FileText}
                    color="bg-yellow-600"
                  />
                  <StatCard
                    title="Total Users"
                    value={users.length}
                    icon={Users}
                    color="bg-[#6A1E55]"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Distribution Pie Chart */}
                  <div className="bg-[#3B1C32] rounded-lg p-6 border border-[#6A1E55]">
                    <h3 className="text-lg font-semibold mb-4">
                      Category Distribution
                    </h3>
                    <div className="h-80">
                      <canvas
                        ref={pieChartRef}
                        className="w-full h-full"
                      ></canvas>
                    </div>
                  </div>

                  {/* Top Authors Bar Chart */}
                  <div className="bg-[#3B1C32] rounded-lg p-6 border border-[#6A1E55]">
                    <h3 className="text-lg font-semibold mb-4">Top Authors</h3>
                    <div className="h-80">
                      <canvas
                        ref={barChartRef}
                        className="w-full h-full"
                      ></canvas>
                    </div>
                  </div>
                </div>
                <Storage />
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-[#6A1E55]" />
                <p className="text-[#A64D79]">No statistics available</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A64D79] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[#3B1C32] border border-[#6A1E55] rounded-lg text-white placeholder-[#A64D79] focus:outline-none focus:ring-2 focus:ring-[#6A1E55]"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6A1E55] mx-auto"></div>
                <p className="mt-4 text-[#A64D79]">Loading users...</p>
              </div>
            ) : (
              <div className="bg-[#3B1C32] rounded-lg border border-[#6A1E55] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#1A1A1D]">
                      <tr>
                        <th className="text-left p-4 text-[#A64D79]">User</th>
                        <th className="text-left p-4 text-[#A64D79]">Role</th>
                        <th className="text-left p-4 text-[#A64D79]">Status</th>
                        <th className="text-left p-4 text-[#A64D79]">
                          Last Login
                        </th>
                        <th className="text-left p-4 text-[#A64D79]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#6A1E55]">
                      {filteredUsers.map((userItem) => (
                        <tr key={userItem._id} className="hover:bg-[#1A1A1D]">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-[#6A1E55] p-2 rounded-full">
                                <span className="text-white font-bold">
                                  {userItem.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {userItem.name}
                                </p>
                                <p className="text-[#A64D79] text-sm">
                                  {userItem.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                userItem.role === "admin"
                                  ? "bg-red-900 text-red-300"
                                  : "bg-[#1A1A1D] text-[#A64D79]"
                              }`}
                            >
                              {userItem.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                userItem.isActive
                                  ? "bg-green-900 text-green-300"
                                  : "bg-red-900 text-red-300"
                              }`}
                            >
                              {userItem.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="p-4 text-[#A64D79]">
                            {userItem.lastLogin
                              ? new Date(
                                  userItem.lastLogin
                                ).toLocaleDateString()
                              : "Never"}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleUserStatus(userItem._id)}
                                disabled={
                                  userItem._id === user?._id ||
                                  actionLoading[userItem._id]
                                }
                                className={`p-2 rounded-lg transition-colors relative ${
                                  userItem.isActive
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={
                                  userItem._id === user?._id
                                    ? "Cannot modify your own status"
                                    : userItem.isActive
                                    ? "Deactivate"
                                    : "Activate"
                                }
                              >
                                {actionLoading[userItem._id] ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : userItem.isActive ? (
                                  <UserX className="w-4 h-4 text-white" />
                                ) : (
                                  <UserCheck className="w-4 h-4 text-white" />
                                )}
                              </button>
                              <button
                                onClick={() => deleteUser(userItem._id)}
                                disabled={
                                  userItem._id === user?._id ||
                                  actionLoading[userItem._id]
                                }
                                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                                title={
                                  userItem._id === user?._id
                                    ? "Cannot delete your own account"
                                    : "Delete User"
                                }
                              >
                                {actionLoading[userItem._id] ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 text-white" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* No users found message */}
                {filteredUsers.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-[#6A1E55]" />
                    <p className="text-[#A64D79]">No users found</p>
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="bg-[#1A1A1D] px-6 py-3 flex items-center justify-between">
                    <div className="text-sm text-[#A64D79]">
                      Showing {(currentPage - 1) * 10 + 1} to{" "}
                      {Math.min(currentPage * 10, pagination.totalUsers)} of{" "}
                      {pagination.totalUsers} users
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="px-3 py-1 bg-[#3B1C32] hover:bg-[#6A1E55] rounded text-sm disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-[#A64D79]">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-3 py-1 bg-[#3B1C32] hover:bg-[#6A1E55] rounded text-sm disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
