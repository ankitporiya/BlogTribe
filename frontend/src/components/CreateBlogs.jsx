// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Save, 
//   Eye, 
//   Image, 
//   X, 
//   Upload, 
//   Calendar, 
//   User, 
//   Tag, 
//   FileText,
//   CheckCircle,
//   AlertCircle
// } from 'lucide-react';

// // Mock React Quill component since we can't import it directly
// const ReactQuill = ({ value, onChange, placeholder, modules, formats }) => {
//   return (
//     <div className="relative">
//       <textarea
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full h-64 p-4 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 resize-none"
//         style={{ 
//           backgroundColor: '#3B1C32', 
//           borderColor: '#6A1E55',
//           minHeight: '200px'
//         }}
//       />
//       <div className="absolute bottom-2 right-2 text-xs text-gray-400">
//         Rich text editor (React Quill simulation)
//       </div>
//     </div>
//   );
// };

// const CreateBlog = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     content: '',
//     image: '',
//     author: '',
//     tags: [],
//     status: 'draft' // draft, published
//   });

//   const [currentTag, setCurrentTag] = useState('');
//   const [showPreview, setShowPreview] = useState(false);
//   const [imagePreview, setImagePreview] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null); // success, error
//   const [errors, setErrors] = useState({});

//   const categories = [
//     'Technology',
//     'Business',
//     'Health',
//     'Design',
//     'Finance',
//     'Lifestyle',
//     'Education',
//     'Travel',
//     'Food',
//     'Entertainment'
//   ];

//   const quillModules = {
//     toolbar: [
//       [{ 'header': [1, 2, 3, false] }],
//       ['bold', 'italic', 'underline', 'strike'],
//       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//       ['blockquote', 'code-block'],
//       ['link', 'image'],
//       ['clean']
//     ],
//   };

//   const quillFormats = [
//     'header', 'bold', 'italic', 'underline', 'strike',
//     'list', 'bullet', 'blockquote', 'code-block',
//     'link', 'image'
//   ];

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: null
//       }));
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const imageUrl = event.target.result;
//         setImagePreview(imageUrl);
//         handleInputChange('image', imageUrl);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const addTag = () => {
//     if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
//       handleInputChange('tags', [...formData.tags, currentTag.trim()]);
//       setCurrentTag('');
//     }
//   };

//   const removeTag = (tagToRemove) => {
//     handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.title.trim()) {
//       newErrors.title = 'Title is required';
//     }
    
//     if (!formData.category) {
//       newErrors.category = 'Category is required';
//     }
    
//     if (!formData.content.trim()) {
//       newErrors.content = 'Content is required';
//     }
    
//     if (!formData.author.trim()) {
//       newErrors.author = 'Author name is required';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (status) => {
//     if (!validateForm()) return;
    
//     setIsSubmitting(true);
//     setSubmitStatus(null);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       const blogData = {
//         ...formData,
//         status,
//         id: Date.now(),
//         date: new Date().toISOString().split('T')[0],
//         likes: 0,
//         comments: 0
//       };
      
//       console.log('Blog saved:', blogData);
//       setSubmitStatus('success');
      
//       // Reset form after successful submission
//       setTimeout(() => {
//         setFormData({
//           title: '',
//           category: '',
//           content: '',
//           image: '',
//           author: '',
//           tags: [],
//           status: 'draft'
//         });
//         setImagePreview('');
//         setSubmitStatus(null);
//       }, 2000);
      
//     } catch (error) {
//       console.error('Error saving blog:', error);
//       setSubmitStatus('error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: { duration: 0.6, staggerChildren: 0.1 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: '#1A1A1D' }}>
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-8"
//         >
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//             Create New Blog
//           </h1>
//           <p className="text-gray-300 text-lg max-w-2xl mx-auto">
//             Share your thoughts and expertise with the world
//           </p>
//         </motion.div>

//         {/* Status Messages */}
//         <AnimatePresence>
//           {submitStatus && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
//                 submitStatus === 'success' 
//                   ? 'bg-green-600 bg-opacity-20 text-green-400' 
//                   : 'bg-red-600 bg-opacity-20 text-red-400'
//               }`}
//             >
//               {submitStatus === 'success' ? (
//                 <CheckCircle className="w-5 h-5" />
//               ) : (
//                 <AlertCircle className="w-5 h-5" />
//               )}
//               <span>
//                 {submitStatus === 'success' 
//                   ? 'Blog saved successfully!' 
//                   : 'Error saving blog. Please try again.'}
//               </span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Form */}
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="lg:col-span-2"
//           >
//             <div className="rounded-lg p-6 shadow-xl" style={{ backgroundColor: '#2A2A2D' }}>
//               <div className="space-y-6">
//                 {/* Title */}
//                 <motion.div variants={itemVariants}>
//                   <label className="block text-white font-medium mb-2">
//                     <FileText className="w-5 h-5 inline mr-2" />
//                     Blog Title
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.title}
//                     onChange={(e) => handleInputChange('title', e.target.value)}
//                     placeholder="Enter an engaging title for your blog"
//                     className={`w-full p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
//                       errors.title ? 'ring-red-500' : ''
//                     }`}
//                     style={{ backgroundColor: '#3B1C32', borderColor: errors.title ? '#ef4444' : '#6A1E55' }}
//                   />
//                   {errors.title && (
//                     <p className="text-red-400 text-sm mt-1">{errors.title}</p>
//                   )}
//                 </motion.div>

//                 {/* Category and Author */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <motion.div variants={itemVariants}>
//                     <label className="block text-white font-medium mb-2">
//                       <Tag className="w-5 h-5 inline mr-2" />
//                       Category
//                     </label>
//                     <select
//                       value={formData.category}
//                       onChange={(e) => handleInputChange('category', e.target.value)}
//                       className={`w-full p-3 rounded-lg text-white focus:outline-none focus:ring-2 ${
//                         errors.category ? 'ring-red-500' : ''
//                       }`}
//                       style={{ backgroundColor: '#3B1C32', borderColor: errors.category ? '#ef4444' : '#6A1E55' }}
//                     >
//                       <option value="">Select a category</option>
//                       {categories.map(category => (
//                         <option key={category} value={category}>
//                           {category}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.category && (
//                       <p className="text-red-400 text-sm mt-1">{errors.category}</p>
//                     )}
//                   </motion.div>

//                   <motion.div variants={itemVariants}>
//                     <label className="block text-white font-medium mb-2">
//                       <User className="w-5 h-5 inline mr-2" />
//                       Author
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.author}
//                       onChange={(e) => handleInputChange('author', e.target.value)}
//                       placeholder="Your name"
//                       className={`w-full p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
//                         errors.author ? 'ring-red-500' : ''
//                       }`}
//                       style={{ backgroundColor: '#3B1C32', borderColor: errors.author ? '#ef4444' : '#6A1E55' }}
//                     />
//                     {errors.author && (
//                       <p className="text-red-400 text-sm mt-1">{errors.author}</p>
//                     )}
//                   </motion.div>
//                 </div>

//                 {/* Image Upload */}
//                 <motion.div variants={itemVariants}>
//                   <label className="block text-white font-medium mb-2">
//                     <Image className="w-5 h-5 inline mr-2" />
//                     Featured Image
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                       id="image-upload"
//                     />
//                     <label
//                       htmlFor="image-upload"
//                       className="w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-opacity-50 transition-all duration-300 flex flex-col items-center justify-center"
//                       style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}
//                     >
//                       <Upload className="w-8 h-8 text-gray-400 mb-2" />
//                       <span className="text-gray-400">Click to upload image</span>
//                       <span className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</span>
//                     </label>
//                   </div>
//                   {imagePreview && (
//                     <div className="mt-4 relative">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-full h-48 object-cover rounded-lg"
//                       />
//                       <button
//                         onClick={() => {
//                           setImagePreview('');
//                           handleInputChange('image', '');
//                         }}
//                         className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   )}
//                 </motion.div>

//                 {/* Tags */}
//                 <motion.div variants={itemVariants}>
//                   <label className="block text-white font-medium mb-2">
//                     Tags
//                   </label>
//                   <div className="flex flex-wrap gap-2 mb-3">
//                     {formData.tags.map((tag, index) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1 rounded-full text-sm text-white flex items-center space-x-2"
//                         style={{ backgroundColor: '#A64D79' }}
//                       >
//                         <span>{tag}</span>
//                         <button
//                           onClick={() => removeTag(tag)}
//                           className="hover:text-red-300 transition-colors"
//                         >
//                           <X className="w-3 h-3" />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                   <div className="flex space-x-2">
//                     <input
//                       type="text"
//                       value={currentTag}
//                       onChange={(e) => setCurrentTag(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
//                       placeholder="Add a tag"
//                       className="flex-1 p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2"
//                       style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}
//                     />
//                     <button
//                       onClick={addTag}
//                       className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
//                       style={{ backgroundColor: '#6A1E55' }}
//                     >
//                       Add
//                     </button>
//                   </div>
//                 </motion.div>

//                 {/* Content Editor */}
//                 <motion.div variants={itemVariants}>
//                   <label className="block text-white font-medium mb-2">
//                     Content
//                   </label>
//                   <ReactQuill
//                     value={formData.content}
//                     onChange={(value) => handleInputChange('content', value)}
//                     placeholder="Write your blog content here..."
//                     modules={quillModules}
//                     formats={quillFormats}
//                   />
//                   {errors.content && (
//                     <p className="text-red-400 text-sm mt-1">{errors.content}</p>
//                   )}
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Sidebar */}
//           <motion.div 
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3 }}
//             className="space-y-6"
//           >
//             {/* Action Buttons */}
//             <div className="rounded-lg p-6 shadow-xl" style={{ backgroundColor: '#2A2A2D' }}>
//               <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
//               <div className="space-y-3">
//                 <button
//                   onClick={() => handleSubmit('draft')}
//                   disabled={isSubmitting}
//                   className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//                   style={{ backgroundColor: '#6A1E55' }}
//                 >
//                   <Save className="w-5 h-5" />
//                   <span>{isSubmitting ? 'Saving...' : 'Save as Draft'}</span>
//                 </button>
                
//                 <button
//                   onClick={() => handleSubmit('published')}
//                   disabled={isSubmitting}
//                   className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//                   style={{ backgroundColor: '#A64D79' }}
//                 >
//                   <Calendar className="w-5 h-5" />
//                   <span>{isSubmitting ? 'Publishing...' : 'Publish Now'}</span>
//                 </button>
                
//                 <button
//                   onClick={() => setShowPreview(true)}
//                   className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
//                   style={{ backgroundColor: '#3B1C32' }}
//                 >
//                   <Eye className="w-5 h-5" />
//                   <span>Preview</span>
//                 </button>
//               </div>
//             </div>

//             {/* Tips */}
//             <div className="rounded-lg p-6 shadow-xl" style={{ backgroundColor: '#2A2A2D' }}>
//               <h3 className="text-xl font-bold text-white mb-4">Writing Tips</h3>
//               <div className="space-y-3 text-gray-300">
//                 <div className="flex items-start space-x-3">
//                   <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#A64D79' }}></div>
//                   <p className="text-sm">Use compelling headlines to grab attention</p>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#A64D79' }}></div>
//                   <p className="text-sm">Add relevant images to break up text</p>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#A64D79' }}></div>
//                   <p className="text-sm">Use tags to help readers find your content</p>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#A64D79' }}></div>
//                   <p className="text-sm">Write in short paragraphs for better readability</p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Preview Modal */}
//       <AnimatePresence>
//         {showPreview && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
//             onClick={() => setShowPreview(false)}
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
//               style={{ backgroundColor: '#1A1A1D' }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="relative">
//                 {formData.image && (
//                   <img
//                     src={formData.image}
//                     alt={formData.title}
//                     className="w-full h-64 object-cover"
//                   />
//                 )}
//                 <button
//                   onClick={() => setShowPreview(false)}
//                   className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-300"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
              
//               <div className="p-8">
//                 <div className="flex items-center justify-between mb-6">
//                   {formData.category && (
//                     <div 
//                       className="px-3 py-1 rounded-full text-sm font-medium text-white"
//                       style={{ backgroundColor: '#A64D79' }}
//                     >
//                       {formData.category}
//                     </div>
//                   )}
//                   <div className="flex items-center space-x-4 text-gray-300">
//                     {formData.author && (
//                       <div className="flex items-center">
//                         <User className="w-4 h-4 mr-1" />
//                         {formData.author}
//                       </div>
//                     )}
//                     <div className="flex items-center">
//                       <Calendar className="w-4 h-4 mr-1" />
//                       {new Date().toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>
                
//                 <h2 className="text-3xl font-bold text-white mb-6">
//                   {formData.title || 'Blog Title'}
//                 </h2>
                
//                 {formData.tags.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mb-6">
//                     {formData.tags.map((tag, index) => (
//                       <span
//                         key={index}
//                         className="px-2 py-1 rounded-full text-xs text-white"
//                         style={{ backgroundColor: '#6A1E55' }}
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                 )}
                
//                 <div className="text-gray-300 leading-relaxed">
//                   {formData.content ? (
//                     <div dangerouslySetInnerHTML={{ __html: formData.content }} />
//                   ) : (
//                     <p className="text-gray-500 italic">No content yet. Start writing your blog!</p>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default CreateBlog;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import React, { useState } from 'react';
import { Upload, X, FileText, Tag, Eye, EyeOff } from 'lucide-react';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    tags: '',
    published: true
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'Technology', 'Health', 'Travel', 'Food', 'Lifestyle', 
    'Education', 'Sports', 'Entertainment', 'Business', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('published', formData.published);
      // formDataToSend.append('author', "Raam");
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Blog created successfully!');
        setFormData({
          title: '',
          category: '',
          content: '',
          // author: '',
          tags: '',
          published: true
        });
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        setError(data.message || 'Failed to create blog');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error creating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const wordCount = formData.content.split(' ').filter(word => word.length > 0).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Blog</h1>
        <p className="text-gray-600">Share your thoughts and ideas with the world</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            maxLength={200}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your blog title..."
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.title.length}/200 characters
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image *
          </label>
          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Choose Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write your blog content here..."
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{wordCount} words</span>
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {readTime} min read
            </span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tags separated by commas"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Use commas to separate tags (e.g., react, javascript, web development)
          </p>
        </div>

        {/* Published Status */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="flex items-center text-sm font-medium text-gray-700">
            {formData.published ? (
              <Eye className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <EyeOff className="h-4 w-4 mr-2 text-gray-400" />
            )}
            Publish immediately
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                category: '',
                content: '',
                tags: '',
                published: true
              });
              setSelectedImage(null);
              setImagePreview(null);
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Blog'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;

