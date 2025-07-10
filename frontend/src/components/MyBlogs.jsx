// import React, { useState, useEffect } from 'react';
// import { Edit, Trash2, Eye, Heart, MessageCircle, Calendar, Upload, X } from 'lucide-react';

// const MyBlogs = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [editingBlog, setEditingBlog] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const categories = [
//     'Technology', 'Health', 'Travel', 'Food', 'Lifestyle',
//     'Education', 'Sports', 'Entertainment', 'Business', 'Other'
//   ];

//   useEffect(() => {
//     fetchMyBlogs();
//   }, []);

//   const fetchMyBlogs = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/blogs/user/me/blogs', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
//       if (data.success) {
//         setBlogs(data.blogs);
//       } else {
//         setError(data.message || 'Failed to fetch blogs');
//       }
//     } catch (error) {
//       setError('Network error. Please try again.');
//       console.error('Error fetching blogs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (blog) => {
//     setEditingBlog({
//       ...blog,
//       tags: blog.tags.join(', ')
//     });
//     setSelectedImage(null);
//     setImagePreview(null);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         setError('Image size must be less than 5MB');
//         return;
//       }

//       if (!file.type.startsWith('image/')) {
//         setError('Please select a valid image file');
//         return;
//       }

//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onload = (e) => setImagePreview(e.target.result);
//       reader.readAsDataURL(file);
//       setError('');
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('title', editingBlog.title);
//       formData.append('category', editingBlog.category);
//       formData.append('content', editingBlog.content);
//       formData.append('tags', editingBlog.tags);
//       formData.append('published', editingBlog.published);

//       if (selectedImage) {
//         formData.append('image', selectedImage);
//       }

//       const response = await fetch(`/api/blogs/${editingBlog._id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: formData
//       });

//       const data = await response.json();
//       if (data.success) {
//         setBlogs(blogs.map(blog => 
//           blog._id === editingBlog._id ? data.blog : blog
//         ));
//         setEditingBlog(null);
//         setSelectedImage(null);
//         setImagePreview(null);
//       } else {
//         setError(data.message || 'Failed to update blog');
//       }
//     } catch (error) {
//       setError('Network error. Please try again.');
//       console.error('Error updating blog:', error);
//     }
//   };

//   const handleDelete = async (blogId) => {
//     try {
//       const response = await fetch(`/api/blogs/${blogId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       const data = await response.json();
//       if (data.success) {
//         setBlogs(blogs.filter(blog => blog._id !== blogId));
//         setDeleteConfirm(null);
//       } else {
//         setError(data.message || 'Failed to delete blog');
//       }
//     } catch (error) {
//       setError('Network error. Please try again.');
//       console.error('Error deleting blog:', error);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">My Blogs</h1>
//         <p className="text-gray-600">Manage your published blogs</p>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//           {error}
//         </div>
//       )}

//       {blogs.length === 0 ? (
//         <div className="text-center py-12">
//           <h3 className="text-lg font-medium text-gray-700 mb-2">No blogs yet</h3>
//           <p className="text-gray-500">Create your first blog to get started!</p>
//         </div>
//       ) : (
//         <div className="grid gap-6">
//           {blogs.map(blog => (
//             <div key={blog._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
//               <div className="md:flex">
//                 <div className="md:w-1/3">
//                   <img
//                     src={blog.image.url}
//                     alt={blog.title}
//                     className="w-full h-48 md:h-full object-cover"
//                   />
//                 </div>
//                 <div className="md:w-2/3 p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="flex-1">
//                       <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
//                         {blog.category}
//                       </span>
//                       <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                         {blog.title}
//                       </h3>
//                       <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
//                         <span className="flex items-center">
//                           <Calendar className="h-4 w-4 mr-1" />
//                           {formatDate(blog.createdAt)}
//                         </span>
//                         <span className="flex items-center">
//                           <Eye className="h-4 w-4 mr-1" />
//                           {blog.views}
//                         </span>
//                         <span className="flex items-center">
//                           <Heart className="h-4 w-4 mr-1" />
//                           {blog.likes.length}
//                         </span>
//                         <span className="flex items-center">
//                           <MessageCircle className="h-4 w-4 mr-1" />
//                           {blog.comments.length}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className={`px-2 py-1 text-xs rounded-full ${
//                         blog.published
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {blog.published ? 'Published' : 'Draft'}
//                       </span>
//                     </div>
//                   </div>
                  
//                   <p className="text-gray-600 mb-4 line-clamp-3">
//                     {blog.content.substring(0, 150)}...
//                   </p>
                  
//                   {blog.tags.length > 0 && (
//                     <div className="flex flex-wrap gap-1 mb-4">
//                       {blog.tags.map(tag => (
//                         <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   )}
                  
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleEdit(blog)}
//                       className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
//                     >
//                       <Edit className="h-4 w-4 mr-1" />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => setDeleteConfirm(blog._id)}
//                       className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
//                     >
//                       <Trash2 className="h-4 w-4 mr-1" />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editingBlog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-2xl font-bold text-gray-800">Edit Blog</h2>
//             </div>
            
//             <div className="p-6 space-y-6">
//               {/* Title */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Title *
//                 </label>
//                 <input
//                   type="text"
//                   value={editingBlog.title}
//                   onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               {/* Category */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category *
//                 </label>
//                 <select
//                   value={editingBlog.category}
//                   onChange={(e) => setEditingBlog({...editingBlog, category: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   {categories.map(category => (
//                     <option key={category} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Image */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Featured Image
//                 </label>
//                 <div className="space-y-4">
//                   <div>
//                     <img
//                       src={imagePreview || editingBlog.image.url}
//                       alt="Current"
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                   </div>
//                   <div>
//                     <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//                       <Upload className="h-4 w-4 mr-2" />
//                       Change Image
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="hidden"
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Content */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Content *
//                 </label>
//                 <textarea
//                   value={editingBlog.content}
//                   onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
//                   rows={10}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               {/* Tags */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Tags
//                 </label>
//                 <input
//                   type="text"
//                   value={editingBlog.tags}
//                   onChange={(e) => setEditingBlog({...editingBlog, tags: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter tags separated by commas"
//                 />
//               </div>

//               {/* Published Status */}
//               <div className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   checked={editingBlog.published}
//                   onChange={(e) => setEditingBlog({...editingBlog, published: e.target.checked})}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label className="text-sm font-medium text-gray-700">
//                   Published
//                 </label>
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
//               <button
//                 onClick={() => {
//                   setEditingBlog(null);
//                   setSelectedImage(null);
//                   setImagePreview(null);
//                 }}
//                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Update Blog
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full">
//             <div className="p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-2">
//                 Delete Blog
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete this blog? This action cannot be undone.
//               </p>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   onClick={() => setDeleteConfirm(null)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDelete(deleteConfirm)}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBlogs;