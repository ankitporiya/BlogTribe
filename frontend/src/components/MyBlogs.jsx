// import React, { useState, useEffect } from 'react';
// import { 
//   Edit, 
//   Trash2, 
//   Eye, 
//   Calendar, 
//   Tag, 
//   Heart, 
//   MessageSquare,
//   Plus,
//   Search,
//   Filter,
//   AlertCircle,
//   CheckCircle,
//   X
// } from 'lucide-react';

// const MyBlogs = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('');
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalBlogs: 0
//   });
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingBlog, setEditingBlog] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');

//   // Form states for editing
//   const [editForm, setEditForm] = useState({
//     title: '',
//     category: '',
//     content: '',
//     tags: '',
//     published: true,
//     image: null
//   });

//   // Categories for filter dropdown
//   const categories = ['Technology', 'Lifestyle', 'Health', 'Travel', 'Food', 'Business', 'Education', 'Entertainment'];

//   // Fetch user's blogs
//   const fetchMyBlogs = async (page = 1) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       // Try the user/me/blogs endpoint first
//       let response = await fetch(`http://localhost:5000/api/blogs/user/me/blogs?page=${page}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       // If that doesn't work, try without the 'me' part
//       if (!response.ok && response.status === 404) {
//         response = await fetch(`http://localhost:5000/api/blogs/user/blogs?page=${page}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       }

//       if (!response.ok) {
//         throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('API Response:', data); // Debug log
      
//       if (data.success) {
//         setBlogs(data.blogs || []);
//         setPagination(data.pagination || {
//           currentPage: 1,
//           totalPages: 1,
//           totalBlogs: 0
//         });
//       } else {
//         setError(data.message || 'Failed to fetch blogs');
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setError(err.message || 'An error occurred while fetching blogs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete blog
//   const handleDeleteBlog = async (blogId) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete blog');
//       }

//       const data = await response.json();
//       if (data.success) {
//         setSuccessMessage('Blog deleted successfully');
//         setBlogs(blogs.filter(blog => blog._id !== blogId));
//         setDeleteConfirm(null);
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } else {
//         setError(data.message || 'Failed to delete blog');
//       }
//     } catch (err) {
//       setError(err.message || 'An error occurred while deleting blog');
//     }
//   };

//   // Update blog
//   const handleUpdateBlog = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
      
//       formData.append('title', editForm.title);
//       formData.append('category', editForm.category);
//       formData.append('content', editForm.content);
//       formData.append('tags', editForm.tags);
//       formData.append('published', editForm.published);
      
//       if (editForm.image) {
//         formData.append('image', editForm.image);
//       }

//       const response = await fetch(`http://localhost:5000/api/blogs/${editingBlog._id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update blog');
//       }

//       const data = await response.json();
//       if (data.success) {
//         setSuccessMessage('Blog updated successfully');
//         setBlogs(blogs.map(blog => 
//           blog._id === editingBlog._id ? data.blog : blog
//         ));
//         setShowEditModal(false);
//         setEditingBlog(null);
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } else {
//         setError(data.message || 'Failed to update blog');
//       }
//     } catch (err) {
//       setError(err.message || 'An error occurred while updating blog');
//     }
//   };

//   // Open edit modal
//   const openEditModal = (blog) => {
//     setEditingBlog(blog);
//     setEditForm({
//       title: blog.title,
//       category: blog.category,
//       content: blog.content,
//       tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
//       published: blog.published,
//       image: null
//     });
//     setShowEditModal(true);
//   };

//   // Filter blogs based on search and category
//   const filteredBlogs = blogs.filter(blog => {
//     const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          blog.content.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = !filterCategory || blog.category === filterCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get like count properly
//   const getLikeCount = (blog) => {
//     if (Array.isArray(blog.likes)) {
//       return blog.likes.length;
//     }
//     return blog.likeCount || 0;
//   };

//   // Get comment count properly
//   const getCommentCount = (blog) => {
//     if (Array.isArray(blog.comments)) {
//       return blog.comments.length;
//     }
//     return blog.commentCount || 0;
//   };

//   useEffect(() => {
//     fetchMyBlogs();
//   }, []);

//   useEffect(() => {
//     if (error) {
//       setTimeout(() => setError(''), 5000);
//     }
//   }, [error]);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">My Blogs</h1>
//           <p className="text-gray-600">Manage your published blogs</p>
//         </div>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
//             <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
//             <span className="text-green-800">{successMessage}</span>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//             <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
//             <span className="text-red-800">{error}</span>
//           </div>
//         )}

//         {/* Debug Information */}
//         <div className="bg-gray-100 p-4 rounded-lg mb-6">
//           <h3 className="font-semibold mb-2">Debug Information:</h3>
//           <p>Loading: {loading.toString()}</p>
//           <p>Error: {error || 'None'}</p>
//           <p>Blogs count: {blogs.length}</p>
//           <p>Filtered blogs count: {filteredBlogs.length}</p>
//           <p>Token exists: {!!localStorage.getItem('token')}</p>
//           <p>Search term: "{searchTerm}"</p>
//           <p>Filter category: "{filterCategory}"</p>
//           {blogs.length > 0 && (
//             <details className="mt-2">
//               <summary className="cursor-pointer">Raw blog data</summary>
//               <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
//                 {JSON.stringify(blogs[0], null, 2)}
//               </pre>
//             </details>
//           )}
//         </div>

//         {/* Search and Filter */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search blogs..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div className="relative">
//               <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <select
//                 value={filterCategory}
//                 onChange={(e) => setFilterCategory(e.target.value)}
//                 className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Blogs Grid */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading your blogs...</p>
//           </div>
//         ) : filteredBlogs.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Plus className="h-8 w-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               {searchTerm || filterCategory ? 'No blogs match your filters' : 'No blogs found'}
//             </h3>
//             <p className="text-gray-600 mb-6">
//               {searchTerm || filterCategory 
//                 ? 'Try adjusting your search or filter criteria' 
//                 : 'You haven\'t published any blogs yet.'
//               }
//             </p>
//             <button 
//               onClick={() => {
//                 setSearchTerm('');
//                 setFilterCategory('');
//               }}
//               className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
//             >
//               {searchTerm || filterCategory ? 'Clear Filters' : 'Create Your First Blog'}
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredBlogs.map((blog) => (
//               <div key={blog._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
//                 <div className="relative">
//                   <img
//                     src={blog.image?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
//                     alt={blog.title}
//                     className="w-full h-48 object-cover"
//                     onError={(e) => {
//                       e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
//                     }}
//                   />
//                   <div className="absolute top-2 right-2">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       blog.published 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {blog.published ? 'Published' : 'Draft'}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
//                     {blog.title}
//                   </h3>
                  
//                   <div className="flex items-center text-sm text-gray-500 mb-3">
//                     <Calendar className="h-4 w-4 mr-1" />
//                     {formatDate(blog.createdAt)}
//                   </div>
                  
//                   <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                     <div className="flex items-center">
//                       <Tag className="h-4 w-4 mr-1" />
//                       {blog.category}
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <div className="flex items-center">
//                         <Eye className="h-4 w-4 mr-1" />
//                         {blog.views || 0}
//                       </div>
//                       <div className="flex items-center">
//                         <Heart className="h-4 w-4 mr-1" />
//                         {getLikeCount(blog)}
//                       </div>
//                       <div className="flex items-center">
//                         <MessageSquare className="h-4 w-4 mr-1" />
//                         {getCommentCount(blog)}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex justify-between items-center pt-4 border-t">
//                     <button
//                       onClick={() => openEditModal(blog)}
//                       className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
//                     >
//                       <Edit className="h-4 w-4 mr-1" />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => setDeleteConfirm(blog._id)}
//                       className="flex items-center text-red-600 hover:text-red-800 transition-colors"
//                     >
//                       <Trash2 className="h-4 w-4 mr-1" />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="mt-8 flex justify-center">
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => fetchMyBlogs(pagination.currentPage - 1)}
//                 disabled={!pagination.hasPrev}
//                 className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <span className="px-4 py-2 bg-blue-600 text-white rounded-md">
//                 {pagination.currentPage} of {pagination.totalPages}
//               </span>
//               <button
//                 onClick={() => fetchMyBlogs(pagination.currentPage + 1)}
//                 disabled={!pagination.hasNext}
//                 className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold text-gray-900">Edit Blog</h2>
//                 <button
//                   onClick={() => setShowEditModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     value={editForm.title}
//                     onChange={(e) => setEditForm({...editForm, title: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category
//                   </label>
//                   <select
//                     value={editForm.category}
//                     onChange={(e) => setEditForm({...editForm, category: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Content
//                   </label>
//                   <textarea
//                     value={editForm.content}
//                     onChange={(e) => setEditForm({...editForm, content: e.target.value})}
//                     rows={8}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Tags (comma-separated)
//                   </label>
//                   <input
//                     type="text"
//                     value={editForm.tags}
//                     onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="e.g., react, javascript, web development"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Image (optional)
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setEditForm({...editForm, image: e.target.files[0]})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
                
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="published"
//                     checked={editForm.published}
//                     onChange={(e) => setEditForm({...editForm, published: e.target.checked})}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
//                     Published
//                   </label>
//                 </div>
                
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowEditModal(false)}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleUpdateBlog}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                   >
//                     Update Blog
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex items-center mb-4">
//               <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
//               <h3 className="text-lg font-medium text-gray-900">Delete Blog</h3>
//             </div>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this blog? This action cannot be undone.
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setDeleteConfirm(null)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDeleteBlog(deleteConfirm)}
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBlogs;













// import React, { useState, useEffect } from 'react';
// import { 
//   Edit, 
//   Trash2, 
//   Eye, 
//   Calendar, 
//   Tag, 
//   Heart, 
//   MessageSquare,
//   Plus,
//   Search,
//   Filter,
//   AlertCircle,
//   CheckCircle,
//   X,
//   User,
//   ChevronDown,
//   ChevronUp
// } from 'lucide-react';

// const MyBlogs = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('');
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalBlogs: 0
//   });
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingBlog, setEditingBlog] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [expandedBlog, setExpandedBlog] = useState(null);
//   const [showLikes, setShowLikes] = useState({});
//   const [showComments, setShowComments] = useState({});

//   // Form states for editing
//   const [editForm, setEditForm] = useState({
//     title: '',
//     category: '',
//     content: '',
//     tags: '',
//     published: true,
//     image: null
//   });

//   // Categories for filter dropdown
//   const categories = ['Technology', 'Lifestyle', 'Health', 'Travel', 'Food', 'Business', 'Education', 'Entertainment'];

//   // Fetch user's blogs
//   const fetchMyBlogs = async (page = 1) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       // Try the user/me/blogs endpoint first
//       let response = await fetch(`http://localhost:5000/api/blogs/user/me/blogs?page=${page}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       // If that doesn't work, try without the 'me' part
//       if (!response.ok && response.status === 404) {
//         response = await fetch(`http://localhost:5000/api/blogs/user/blogs?page=${page}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       }

//       if (!response.ok) {
//         throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('API Response:', data); // Debug log
      
//       if (data.success) {
//         setBlogs(data.blogs || []);
//         setPagination(data.pagination || {
//           currentPage: 1,
//           totalPages: 1,
//           totalBlogs: 0
//         });
//       } else {
//         setError(data.message || 'Failed to fetch blogs');
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setError(err.message || 'An error occurred while fetching blogs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete blog
//   const handleDeleteBlog = async (blogId) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete blog');
//       }

//       const data = await response.json();
//       if (data.success) {
//         setSuccessMessage('Blog deleted successfully');
//         setBlogs(blogs.filter(blog => blog._id !== blogId));
//         setDeleteConfirm(null);
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } else {
//         setError(data.message || 'Failed to delete blog');
//       }
//     } catch (err) {
//       setError(err.message || 'An error occurred while deleting blog');
//     }
//   };

//   // Update blog
//   const handleUpdateBlog = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
      
//       formData.append('title', editForm.title);
//       formData.append('category', editForm.category);
//       formData.append('content', editForm.content);
//       formData.append('tags', editForm.tags);
//       formData.append('published', editForm.published);
      
//       if (editForm.image) {
//         formData.append('image', editForm.image);
//       }

//       const response = await fetch(`http://localhost:5000/api/blogs/${editingBlog._id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update blog');
//       }

//       const data = await response.json();
//       if (data.success) {
//         setSuccessMessage('Blog updated successfully');
//         setBlogs(blogs.map(blog => 
//           blog._id === editingBlog._id ? data.blog : blog
//         ));
//         setShowEditModal(false);
//         setEditingBlog(null);
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } else {
//         setError(data.message || 'Failed to update blog');
//       }
//     } catch (err) {
//       setError(err.message || 'An error occurred while updating blog');
//     }
//   };

//   // Open edit modal
//   const openEditModal = (blog) => {
//     setEditingBlog(blog);
//     setEditForm({
//       title: blog.title,
//       category: blog.category,
//       content: blog.content,
//       tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
//       published: blog.published,
//       image: null
//     });
//     setShowEditModal(true);
//   };

//   // Toggle likes display
//   const toggleLikes = (blogId) => {
//     setShowLikes(prev => ({
//       ...prev,
//       [blogId]: !prev[blogId]
//     }));
//   };

//   // Toggle comments display
//   const toggleComments = (blogId) => {
//     setShowComments(prev => ({
//       ...prev,
//       [blogId]: !prev[blogId]
//     }));
//   };

//   // Filter blogs based on search and category
//   const filteredBlogs = blogs.filter(blog => {
//     const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          blog.content.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = !filterCategory || blog.category === filterCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get like count properly
//   const getLikeCount = (blog) => {
//     if (Array.isArray(blog.likes)) {
//       return blog.likes.length;
//     }
//     return blog.likeCount || 0;
//   };

//   // Get comment count properly
//   const getCommentCount = (blog) => {
//     if (Array.isArray(blog.comments)) {
//       return blog.comments.length;
//     }
//     return blog.commentCount || 0;
//   };

//   // Get likes array
//   const getLikes = (blog) => {
//     if (Array.isArray(blog.likes)) {
//       return blog.likes;
//     }
//     return [];
//   };

//   // Get comments array
//   const getComments = (blog) => {
//     if (Array.isArray(blog.comments)) {
//       return blog.comments;
//     }
//     return [];
//   };

//   useEffect(() => {
//     fetchMyBlogs();
//   }, []);

//   useEffect(() => {
//     if (error) {
//       setTimeout(() => setError(''), 5000);
//     }
//   }, [error]);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">My Blogs</h1>
//           <p className="text-gray-600">Manage your published blogs</p>
//         </div>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
//             <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
//             <span className="text-green-800">{successMessage}</span>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//             <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
//             <span className="text-red-800">{error}</span>
//           </div>
//         )}

//         {/* Debug Information
//         <div className="bg-gray-100 p-4 rounded-lg mb-6">
//           <h3 className="font-semibold mb-2">Debug Information:</h3>
//           <p>Loading: {loading.toString()}</p>
//           <p>Error: {error || 'None'}</p>
//           <p>Blogs count: {blogs.length}</p>
//           <p>Filtered blogs count: {filteredBlogs.length}</p>
//           <p>Token exists: {!!localStorage.getItem('token')}</p>
//           <p>Search term: "{searchTerm}"</p>
//           <p>Filter category: "{filterCategory}"</p>
//           {blogs.length > 0 && (
//             <details className="mt-2">
//               <summary className="cursor-pointer">Raw blog data</summary>
//               <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
//                 {JSON.stringify(blogs[0], null, 2)}
//               </pre>
//             </details>
//           )}
//         </div> */}

//         {/* Search and Filter */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search blogs..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div className="relative">
//               <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <select
//                 value={filterCategory}
//                 onChange={(e) => setFilterCategory(e.target.value)}
//                 className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Blogs Grid */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading your blogs...</p>
//           </div>
//         ) : filteredBlogs.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Plus className="h-8 w-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               {searchTerm || filterCategory ? 'No blogs match your filters' : 'No blogs found'}
//             </h3>
//             <p className="text-gray-600 mb-6">
//               {searchTerm || filterCategory 
//                 ? 'Try adjusting your search or filter criteria' 
//                 : 'You haven\'t published any blogs yet.'
//               }
//             </p>
//             <button 
//               onClick={() => {
//                 setSearchTerm('');
//                 setFilterCategory('');
//               }}
//               className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
//             >
//               {searchTerm || filterCategory ? 'Clear Filters' : 'Create Your First Blog'}
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredBlogs.map((blog) => (
//               <div key={blog._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
//                 <div className="relative">
//                   <img
//                     src={blog.image?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
//                     alt={blog.title}
//                     className="w-full h-48 object-cover"
//                     onError={(e) => {
//                       e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
//                     }}
//                   />
//                   <div className="absolute top-2 right-2">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       blog.published 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {blog.published ? 'Published' : 'Draft'}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
//                     {blog.title}
//                   </h3>
                  
//                   <div className="flex items-center text-sm text-gray-500 mb-3">
//                     <Calendar className="h-4 w-4 mr-1" />
//                     {formatDate(blog.createdAt)}
//                   </div>
                  
//                   <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                     <div className="flex items-center">
//                       <Tag className="h-4 w-4 mr-1" />
//                       {blog.category}
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <div className="flex items-center">
//                         <Eye className="h-4 w-4 mr-1" />
//                         {blog.views || 0}
//                       </div>
//                       <button
//                         onClick={() => toggleLikes(blog._id)}
//                         className="flex items-center hover:text-red-500 transition-colors"
//                       >
//                         <Heart className="h-4 w-4 mr-1" />
//                         {getLikeCount(blog)}
//                       </button>
//                       <button
//                         onClick={() => toggleComments(blog._id)}
//                         className="flex items-center hover:text-blue-500 transition-colors"
//                       >
//                         <MessageSquare className="h-4 w-4 mr-1" />
//                         {getCommentCount(blog)}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Likes Section */}
//                   {showLikes[blog._id] && (
//                     <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center justify-between mb-2">
//                         <h4 className="font-medium text-gray-900">
//                           Likes ({getLikeCount(blog)})
//                         </h4>
                        
//                       </div>
                     
//                     </div>
//                   )}

//                   {/* Comments Section */}
//                   {showComments[blog._id] && (
//                     <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center justify-between mb-2">
//                         <h4 className="font-medium text-gray-900">
//                           Comments ({getCommentCount(blog)})
//                         </h4>
//                         <button
//                           onClick={() => toggleComments(blog._id)}
//                           className="text-gray-400 hover:text-gray-600"
//                         >
//                           <ChevronUp className="h-4 w-4" />
//                         </button>
//                       </div>
//                       <div className="space-y-3 max-h-40 overflow-y-auto">
//                         {getComments(blog).length > 0 ? (
//                           getComments(blog).map((comment, index) => (
//                             <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
//                               <div className="flex items-center space-x-2 mb-1">
//                                 <User className="h-4 w-4 text-gray-400" />
//                                 <span className="text-sm font-medium text-gray-900">
//                                   {comment.userDetails?.name || comment.userDetails?.username}
//                                 </span>
//                                 <span className="text-xs text-gray-500">
//                                   {formatDate(comment.createdAt || new Date())}
//                                 </span>
//                               </div>
//                               <p className="text-sm text-gray-700 ml-6">
//                                 {comment.content || comment.text || 'No content'}
//                               </p>
//                             </div>
//                           ))
//                         ) : (
//                           <p className="text-sm text-gray-500">No comments yet</p>
//                         )}
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="flex justify-between items-center pt-4 border-t">
//                     <button
//                       onClick={() => openEditModal(blog)}
//                       className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
//                     >
//                       <Edit className="h-4 w-4 mr-1" />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => setDeleteConfirm(blog._id)}
//                       className="flex items-center text-red-600 hover:text-red-800 transition-colors"
//                     >
//                       <Trash2 className="h-4 w-4 mr-1" />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="mt-8 flex justify-center">
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => fetchMyBlogs(pagination.currentPage - 1)}
//                 disabled={!pagination.hasPrev}
//                 className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <span className="px-4 py-2 bg-blue-600 text-white rounded-md">
//                 {pagination.currentPage} of {pagination.totalPages}
//               </span>
//               <button
//                 onClick={() => fetchMyBlogs(pagination.currentPage + 1)}
//                 disabled={!pagination.hasNext}
//                 className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold text-gray-900">Edit Blog</h2>
//                 <button
//                   onClick={() => setShowEditModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     value={editForm.title}
//                     onChange={(e) => setEditForm({...editForm, title: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category
//                   </label>
//                   <select
//                     value={editForm.category}
//                     onChange={(e) => setEditForm({...editForm, category: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Content
//                   </label>
//                   <textarea
//                     value={editForm.content}
//                     onChange={(e) => setEditForm({...editForm, content: e.target.value})}
//                     rows={8}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Tags (comma-separated)
//                   </label>
//                   <input
//                     type="text"
//                     value={editForm.tags}
//                     onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="e.g., react, javascript, web development"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Image (optional)
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setEditForm({...editForm, image: e.target.files[0]})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
                
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="published"
//                     checked={editForm.published}
//                     onChange={(e) => setEditForm({...editForm, published: e.target.checked})}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
//                     Published
//                   </label>
//                 </div>
                
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowEditModal(false)}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleUpdateBlog}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                   >
//                     Update Blog
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex items-center mb-4">
//               <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
//               <h3 className="text-lg font-medium text-gray-900">Delete Blog</h3>
//             </div>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this blog? This action cannot be undone.
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setDeleteConfirm(null)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDeleteBlog(deleteConfirm)}
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBlogs;










////////////////////////////////////////////////////////////
import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Tag, 
  Heart, 
  MessageSquare,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  X,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [showLikes, setShowLikes] = useState({});
  const [showComments, setShowComments] = useState({});

  // Form states for editing
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    content: '',
    tags: '',
    published: true,
    image: null
  });

  // Categories for filter dropdown
  const categories = ['Technology', 'Lifestyle', 'Health', 'Travel', 'Food', 'Business', 'Education', 'Entertainment'];

  // Fetch user's blogs
  const fetchMyBlogs = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Try the user/me/blogs endpoint first
      let response = await fetch(`http://localhost:5000/api/blogs/user/me/blogs?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // If that doesn't work, try without the 'me' part
      if (!response.ok && response.status === 404) {
        response = await fetch(`http://localhost:5000/api/blogs/user/blogs?page=${page}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (data.success) {
        setBlogs(data.blogs || []);
        setPagination(data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalBlogs: 0
        });
      } else {
        setError(data.message || 'Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'An error occurred while fetching blogs');
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Blog deleted successfully');
        setBlogs(blogs.filter(blog => blog._id !== blogId));
        setDeleteConfirm(null);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to delete blog');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting blog');
    }
  };

  // Update blog
  const handleUpdateBlog = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('title', editForm.title);
      formData.append('category', editForm.category);
      formData.append('content', editForm.content);
      formData.append('tags', editForm.tags);
      formData.append('published', editForm.published);
      
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      const response = await fetch(`http://localhost:5000/api/blogs/${editingBlog._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update blog');
      }

      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Blog updated successfully');
        setBlogs(blogs.map(blog => 
          blog._id === editingBlog._id ? data.blog : blog
        ));
        setShowEditModal(false);
        setEditingBlog(null);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to update blog');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating blog');
    }
  };

  // Open edit modal
  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setEditForm({
      title: blog.title,
      category: blog.category,
      content: blog.content,
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      published: blog.published,
      image: null
    });
    setShowEditModal(true);
  };

  // Toggle likes display
  const toggleLikes = (blogId) => {
    setShowLikes(prev => ({
      ...prev,
      [blogId]: !prev[blogId]
    }));
  };

  // Toggle comments display
  const toggleComments = (blogId) => {
    setShowComments(prev => ({
      ...prev,
      [blogId]: !prev[blogId]
    }));
  };

  // Filter blogs based on search and category
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get like count properly
  const getLikeCount = (blog) => {
    if (Array.isArray(blog.likes)) {
      return blog.likes.length;
    }
    return blog.likeCount || 0;
  };

  // Get comment count properly
  const getCommentCount = (blog) => {
    if (Array.isArray(blog.comments)) {
      return blog.comments.length;
    }
    return blog.commentCount || 0;
  };

  // Get likes array
  const getLikes = (blog) => {
    if (Array.isArray(blog.likes)) {
      return blog.likes;
    }
    return [];
  };

  // Get comments array
  const getComments = (blog) => {
    if (Array.isArray(blog.comments)) {
      return blog.comments;
    }
    return [];
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(''), 5000);
    }
  }, [error]);

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in" >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.5s ease-out;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.4s ease-out;
        }
        .animate-delay-100 {
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }
        .animate-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        .animate-delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }
        .animate-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }
        .blog-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(166, 77, 121, 0.2);
        }
        .button-hover {
          transition: all 0.3s ease;
        }
        .button-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(106, 30, 85, 0.3);
        }
        .modal-backdrop {
          animation: fadeIn 0.3s ease-out;
        }
        .modal-content {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-in-up">
          <h1 className="text-3xl font-bold mb-4 animate-slide-in-left" style={{ color: '#A64D79' }}>My Blogs</h1>
          <p className="text-gray-300 animate-slide-in-left animate-delay-100">Manage your published blogs</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 border rounded-lg p-4 flex items-center animate-slide-in-up" style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}>
            <CheckCircle className="h-5 w-5 mr-2" style={{ color: '#A64D79' }} />
            <span className="text-green-300">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 border rounded-lg p-4 flex items-center animate-slide-in-up" style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}>
            <AlertCircle className="h-5 w-5 mr-2" style={{ color: '#A64D79' }} />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {/* Search and Filter */}
        <div className="rounded-lg shadow-sm p-6 mb-6 animate-slide-in-up animate-delay-200" style={{ backgroundColor: '#3B1C32' }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:border-transparent text-white placeholder-gray-400"
                style={{ 
                  backgroundColor: '#1A1A1D', 
                  borderColor: '#6A1E55',
                  focusRingColor: '#A64D79'
                }}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-md focus:ring-2 focus:border-transparent text-white"
                style={{ 
                  backgroundColor: '#1A1A1D', 
                  borderColor: '#6A1E55',
                  focusRingColor: '#A64D79'
                }}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#A64D79' }}></div>
            <p className="mt-4 text-gray-300">Loading your blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12 rounded-lg shadow-sm animate-scale-in" style={{ backgroundColor: '#3B1C32' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#1A1A1D' }}>
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: '#A64D79' }}>
              {searchTerm || filterCategory ? 'No blogs match your filters' : 'No blogs found'}
            </h3>
            <p className="text-gray-300 mb-6">
              {searchTerm || filterCategory 
                ? 'Try adjusting your search or filter criteria' 
                : 'You haven\'t published any blogs yet.'
              }
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
              }}
              className="text-white px-6 py-2 rounded-md transition-colors button-hover"
              style={{ backgroundColor: '#6A1E55', ':hover': { backgroundColor: '#A64D79' } }}
            >
              {searchTerm || filterCategory ? 'Clear Filters' : 'Create Your First Blog'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, index) => (
              <div key={blog._id} className={`blog-card rounded-lg shadow-sm overflow-hidden animate-slide-in-up ${index % 3 === 0 ? 'animate-delay-100' : index % 3 === 1 ? 'animate-delay-200' : 'animate-delay-300'}`} style={{ backgroundColor: '#3B1C32' }}>
                <div className="relative">
                  <img
                    src={blog.image?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      blog.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: '#A64D79' }}>
                    {blog.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(blog.createdAt)}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {blog.category}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {blog.views || 0}
                      </div>
                      <button
                        onClick={() => toggleLikes(blog._id)}
                        className="flex items-center hover:text-red-400 transition-colors"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {getLikeCount(blog)}
                      </button>
                      <button
                        onClick={() => toggleComments(blog._id)}
                        className="flex items-center transition-colors"
                        style={{ color: '#6A1E55' }}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {getCommentCount(blog)}
                      </button>
                    </div>
                  </div>

                  {/* Likes Section */}
                  {showLikes[blog._id] && (
                    <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#1A1A1D' }}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium" style={{ color: '#A64D79' }}>
                          Likes ({getLikeCount(blog)})
                        </h4>
                      </div>
                    </div>
                  )}

                  {/* Comments Section */}
                  {showComments[blog._id] && (
                    <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#1A1A1D' }}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium" style={{ color: '#A64D79' }}>
                          Comments ({getCommentCount(blog)})
                        </h4>
                        <button
                          onClick={() => toggleComments(blog._id)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {getComments(blog).length > 0 ? (
                          getComments(blog).map((comment, index) => (
                            <div key={index} className="border-b pb-2 last:border-b-0" style={{ borderColor: '#6A1E55' }}>
                              <div className="flex items-center space-x-2 mb-1">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium" style={{ color: '#A64D79' }}>
                                  {comment.userDetails?.name || comment.userDetails?.username}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(comment.createdAt || new Date())}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 ml-6">
                                {comment.content || comment.text || 'No content'}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400">No comments yet</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: '#6A1E55' }}>
                    <button
                      onClick={() => openEditModal(blog)}
                      className="flex items-center transition-colors button-hover"
                      style={{ color: '#A64D79' }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(blog._id)}
                      className="flex items-center hover:text-red-400 transition-colors text-red-500 button-hover"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center animate-slide-in-up animate-delay-400">
            <div className="flex space-x-2">
              <button
                onClick={() => fetchMyBlogs(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors button-hover"
                style={{ 
                  backgroundColor: '#3B1C32',
                  borderColor: '#6A1E55',
                  color: '#A64D79'
                }}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-white rounded-md animate-scale-in" style={{ backgroundColor: '#6A1E55' }}>
                {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchMyBlogs(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors button-hover"
                style={{ 
                  backgroundColor: '#3B1C32',
                  borderColor: '#6A1E55',
                  color: '#A64D79'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-backdrop">
          <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content" style={{ backgroundColor: '#3B1C32' }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#A64D79' }}>Edit Blog</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent text-white"
                    style={{ 
                      backgroundColor: '#1A1A1D', 
                      borderColor: '#6A1E55',
                      focusRingColor: '#A64D79'
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent text-white"
                    style={{ 
                      backgroundColor: '#1A1A1D', 
                      borderColor: '#6A1E55',
                      focusRingColor: '#A64D79'
                    }}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
                    Content
                  </label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                    rows={8}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent text-white"
                    style={{ 
                      backgroundColor: '#1A1A1D', 
                      borderColor: '#6A1E55',
                      focusRingColor: '#A64D79'
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent text-white placeholder-gray-400"
                    style={{ 
                      backgroundColor: '#1A1A1D', 
                      borderColor: '#6A1E55',
                      focusRingColor: '#A64D79'
                    }}
                    placeholder="e.g., react, javascript, web development"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
                    New Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditForm({...editForm, image: e.target.files[0]})}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent text-white"
                    style={{ 
                      backgroundColor: '#1A1A1D', 
                      borderColor: '#6A1E55',
                      focusRingColor: '#A64D79'
                    }}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={editForm.published}
                    onChange={(e) => setEditForm({...editForm, published: e.target.checked})}
                    className="h-4 w-4 focus:ring-blue-500 border-gray-300 rounded"
                    style={{ accentColor: '#A64D79' }}
                  />
                  <label htmlFor="published" className="ml-2 block text-sm text-gray-300">
                    Published
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border rounded-md text-gray-300 hover:bg-gray-700 button-hover"
                    style={{ borderColor: '#6A1E55' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateBlog}
                    className="px-4 py-2 text-white rounded-md transition-colors button-hover"
                    style={{ backgroundColor: '#6A1E55' }}
                  >
                    Update Blog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-backdrop">
          <div className="rounded-lg max-w-md w-full p-6 modal-content" style={{ backgroundColor: '#3B1C32' }}>
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium" style={{ color: '#A64D79' }}>Delete Blog</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border rounded-md text-gray-300 hover:bg-gray-700 button-hover"
                style={{ borderColor: '#6A1E55' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBlog(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 button-hover"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;