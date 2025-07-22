// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import React, { useState } from "react";
// import { Upload, X, FileText, Tag, Eye, EyeOff } from "lucide-react";

// const CreateBlog = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     category: "",
//     content: "",
//     tags: "",
//     published: true,
//   });
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const categories = [
//     "Technology",
//     "Health",
//     "Travel",
//     "Food",
//     "Lifestyle",
//     "Education",
//     "Sports",
//     "Entertainment",
//     "Business",
//     "Other",
//   ];

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }

//       if (!file.type.startsWith("image/")) {
//         setError("Please select a valid image file");
//         return;
//       }

//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onload = (e) => setImagePreview(e.target.result);
//       reader.readAsDataURL(file);
//       setError("");
//     }
//   };

//   const removeImage = () => {
//     setSelectedImage(null);
//     setImagePreview(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("title", formData.title);
//       formDataToSend.append("category", formData.category);
//       formDataToSend.append("content", formData.content);
//       formDataToSend.append("tags", formData.tags);
//       formDataToSend.append("published", formData.published);
//       // formDataToSend.append('author', "Raam");
//       if (selectedImage) {
//         formDataToSend.append("image", selectedImage);
//       }

//       const response = await fetch("http://localhost:5000/api/blogs", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: formDataToSend,
//       });

//       const data = await response.json();

//       if (data.success) {
//         setSuccess("Blog created successfully!");
//         setFormData({
//           title: "",
//           category: "",
//           content: "",
//           // author: '',
//           tags: "",
//           published: true,
//         });
//         setSelectedImage(null);
//         setImagePreview(null);
//       } else {
//         setError(data.message || "Failed to create blog");
//       }
//     } catch (error) {
//       setError("Network error. Please try again.");
//       console.error("Error creating blog:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const wordCount = formData.content
//     .split(" ")
//     .filter((word) => word.length > 0).length;
//   const readTime = Math.ceil(wordCount / 200);

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Create New Blog
//         </h1>
//         <p className="text-gray-600">
//           Share your thoughts and ideas with the world
//         </p>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
//           {success}
//         </div>
//       )}

//       <div className="space-y-6">
//         {/* Title */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Title *
//           </label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleInputChange}
//             required
//             maxLength={200}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter your blog title..."
//           />
//           <p className="text-sm text-gray-500 mt-1">
//             {formData.title.length}/200 characters
//           </p>
//         </div>

//         {/* Category */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Category *
//           </label>
//           <select
//             name="category"
//             value={formData.category}
//             onChange={handleInputChange}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="">Select a category</option>
//             {categories.map((category) => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Image Upload */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Featured Image *
//           </label>
//           {!imagePreview ? (
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
//               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//               <div className="mt-4">
//                 <label className="cursor-pointer">
//                   <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
//                     Choose Image
//                   </span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="hidden"
//                     required
//                   />
//                 </label>
//               </div>
//               <p className="text-sm text-gray-500 mt-2">
//                 PNG, JPG, GIF up to 5MB
//               </p>
//             </div>
//           ) : (
//             <div className="relative">
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="w-full h-64 object-cover rounded-lg"
//               />
//               <button
//                 type="button"
//                 onClick={removeImage}
//                 className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Content *
//           </label>
//           <textarea
//             name="content"
//             value={formData.content}
//             onChange={handleInputChange}
//             required
//             rows={12}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Write your blog content here..."
//           />
//           <div className="flex justify-between text-sm text-gray-500 mt-2">
//             <span>{wordCount} words</span>
//             <span className="flex items-center">
//               <FileText className="h-4 w-4 mr-1" />
//               {readTime} min read
//             </span>
//           </div>
//         </div>

//         {/* Tags */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Tags
//           </label>
//           <div className="relative">
//             <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               name="tags"
//               value={formData.tags}
//               onChange={handleInputChange}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter tags separated by commas"
//             />
//           </div>
//           <p className="text-sm text-gray-500 mt-1">
//             Use commas to separate tags (e.g., react, javascript, web
//             development)
//           </p>
//         </div>

//         {/* Published Status */}
//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             name="published"
//             checked={formData.published}
//             onChange={handleInputChange}
//             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <label className="flex items-center text-sm font-medium text-gray-700">
//             {formData.published ? (
//               <Eye className="h-4 w-4 mr-2 text-green-500" />
//             ) : (
//               <EyeOff className="h-4 w-4 mr-2 text-gray-400" />
//             )}
//             Publish immediately
//           </label>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={() => {
//               setFormData({
//                 title: "",
//                 category: "",
//                 content: "",
//                 tags: "",
//                 published: true,
//               });
//               setSelectedImage(null);
//               setImagePreview(null);
//             }}
//             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//           >
//             Clear
//           </button>
//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Creating..." : "Create Blog"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateBlog;



//////////////////////////////////////////////////////////////////////without editor
// import React, { useState } from "react";
// import { Upload, X, FileText, Tag, Eye, EyeOff } from "lucide-react";

// const CreateBlog = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     category: "",
//     content: "",
//     tags: "",
//     published: true,
//   });
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const categories = [
//     "Technology",
//     "Health",
//     "Travel",
//     "Food",
//     "Lifestyle",
//     "Education",
//     "Sports",
//     "Entertainment",
//     "Business",
//     "Other",
//   ];

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }

//       if (!file.type.startsWith("image/")) {
//         setError("Please select a valid image file");
//         return;
//       }

//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onload = (e) => setImagePreview(e.target.result);
//       reader.readAsDataURL(file);
//       setError("");
//     }
//   };

//   const removeImage = () => {
//     setSelectedImage(null);
//     setImagePreview(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("title", formData.title);
//       formDataToSend.append("category", formData.category);
//       formDataToSend.append("content", formData.content);
//       formDataToSend.append("tags", formData.tags);
//       formDataToSend.append("published", formData.published);
//       // formDataToSend.append('author', "Raam");
//       if (selectedImage) {
//         formDataToSend.append("image", selectedImage);
//       }

//       const response = await fetch("http://localhost:5000/api/blogs", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: formDataToSend,
//       });

//       const data = await response.json();

//       if (data.success) {
//         setSuccess("Blog created successfully!");
//         setFormData({
//           title: "",
//           category: "",
//           content: "",
//           // author: '',
//           tags: "",
//           published: true,
//         });
//         setSelectedImage(null);
//         setImagePreview(null);
//       } else {
//         setError(data.message || "Failed to create blog");
//       }
//     } catch (error) {
//       setError("Network error. Please try again.");
//       console.error("Error creating blog:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const wordCount = formData.content
//     .split(" ")
//     .filter((word) => word.length > 0).length;
//   const readTime = Math.ceil(wordCount / 200);

//   return (
//     <div className="max-w-full mx-auto p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#1A1A1D' }}>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2" style={{ color: '#A64D79' }}>
//           Create New Blog
//         </h1>
//         <p className="text-gray-300">
//           Share your thoughts and ideas with the world
//         </p>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 border rounded-lg" style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55', color: '#A64D79' }}>
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="mb-6 p-4 border rounded-lg" style={{ backgroundColor: '#3B1C32', borderColor: '#A64D79', color: '#A64D79' }}>
//           {success}
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Left Column: Title, Category, Image */}
//         <div className="space-y-6">
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
//               Title *
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               required
//               maxLength={200}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-white"
//               style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55', focusRingColor: '#A64D79' }}
//               placeholder="Enter your blog title..."
//             />
//             <p className="text-sm text-gray-400 mt-1">
//               {formData.title.length}/200 characters
//             </p>
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
//               Category *
//             </label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleInputChange}
//               required
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-white"
//               style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}
//             >
//               <option value="">Select a category</option>
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
//               Featured Image *
//             </label>
//             {!imagePreview ? (
//               <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-opacity-80 transition-colors" style={{ borderColor: '#6A1E55' }}>
//                 <Upload className="mx-auto h-12 w-12" style={{ color: '#A64D79' }} />
//                 <div className="mt-4">
//                   <label className="cursor-pointer">
//                     <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90" style={{ backgroundColor: '#A64D79' }}>
//                       Choose Image
//                     </span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden"
//                       required
//                     />
//                   </label>
//                 </div>
//                 <p className="text-sm text-gray-400 mt-2">
//                   PNG, JPG, GIF up to 5MB
//                 </p>
//               </div>
//             ) : (
//               <div className="relative">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-full h-64 object-cover rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="absolute top-2 right-2 p-1 text-white rounded-full hover:opacity-80"
//                   style={{ backgroundColor: '#6A1E55' }}
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Column: Content, Tags, Buttons */}
//         <div className="space-y-6">
//           {/* Content */}
//           <div>
//             <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
//               Content *
//             </label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleInputChange}
//               required
//               rows={12}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-white"
//               style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}
//               placeholder="Write your blog content here..."
//             />
//             <div className="flex justify-between text-sm text-gray-400 mt-2">
//               <span>{wordCount} words</span>
//               <span className="flex items-center">
//                 <FileText className="h-4 w-4 mr-1" />
//                 {readTime} min read
//               </span>
//             </div>
//           </div>

//           {/* Tags */}
//           <div>
//             <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
//               Tags
//             </label>
//             <div className="relative">
//               <Tag className="absolute left-3 top-2.5 h-4 w-4" style={{ color: '#A64D79' }} />
//               <input
//                 type="text"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleInputChange}
//                 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-white"
//                 style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}
//                 placeholder="Enter tags separated by commas"
//               />
//             </div>
//             <p className="text-sm text-gray-400 mt-1">
//               Use commas to separate tags (e.g., react, javascript, web
//               development)
//             </p>
//           </div>

//           {/* Published Status */}
//           <div className="flex items-center space-x-3">
//             <input
//               type="checkbox"
//               name="published"
//               checked={formData.published}
//               onChange={handleInputChange}
//               className="h-4 w-4 border rounded"
//               style={{ accentColor: '#A64D79', borderColor: '#6A1E55' }}
//             />
//             <label className="flex items-center text-sm font-medium" style={{ color: '#A64D79' }}>
//               {formData.published ? (
//                 <Eye className="h-4 w-4 mr-2" style={{ color: '#A64D79' }} />
//               ) : (
//                 <EyeOff className="h-4 w-4 mr-2 text-gray-400" />
//               )}
//               Publish immediately
//             </label>
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={() => {
//                 setFormData({
//                   title: "",
//                   category: "",
//                   content: "",
//                   tags: "",
//                   published: true,
//                 });
//                 setSelectedImage(null);
//                 setImagePreview(null);
//               }}
//               className="px-6 py-2 border rounded-lg hover:opacity-80 text-white"
//               style={{ borderColor: '#6A1E55', backgroundColor: '#3B1C32' }}
//             >
//               Clear
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={loading}
//               className="px-6 py-2 text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{ backgroundColor: '#A64D79' }}
//             >
//               {loading ? "Creating..." : "Create Blog"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateBlog;


//////////////////////////////////////////////////////////editor:

import React, { useState, useRef } from "react";
import { Upload, X, FileText, Tag, Eye, EyeOff, Bold, Italic, Underline, List, ListOrdered, Link, AlignLeft, AlignCenter, AlignRight, Type, Strikethrough, Quote } from "lucide-react";

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    tags: "",
    published: true,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const contentRef = useRef(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const categories = [
    "Technology",
    "Health",
    "Travel",
    "Food",
    "Lifestyle",
    "Education",
    "Sports",
    "Entertainment",
    "Business",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const cleanHTML = (html) => {
    // Remove Tailwind CSS variables and unnecessary attributes
    let cleaned = html.replace(/style="[^"]*--tw-[^"]*"/g, '');
    cleaned = cleaned.replace(/data-start="[^"]*"/g, '');
    cleaned = cleaned.replace(/data-end="[^"]*"/g, '');
    cleaned = cleaned.replace(/data-is-last-node="[^"]*"/g, '');
    cleaned = cleaned.replace(/data-is-only-node="[^"]*"/g, '');
    cleaned = cleaned.replace(/style=""/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ');
    return cleaned.trim();
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      const rawContent = contentRef.current.innerHTML;
      const cleanedContent = cleanHTML(rawContent);
      setFormData((prev) => ({
        ...prev,
        content: cleanedContent,
      }));
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
    // Add a small delay to ensure DOM is updated before cleaning
    setTimeout(() => {
      handleContentChange();
    }, 10);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const formatBlock = (tag) => {
    execCommand('formatBlock', tag);
  };

  const editorButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: Strikethrough, command: 'strikethrough', title: 'Strikethrough' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { icon: Quote, command: () => formatBlock('blockquote'), title: 'Quote' },
    { icon: Type, command: () => formatBlock('h2'), title: 'Heading' },
    { icon: Link, command: insertLink, title: 'Insert Link' },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("tags", formData.tags);
      formDataToSend.append("published", formData.published);
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/blogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Blog created successfully!");
        setFormData({
          title: "",
          category: "",
          content: "",
          tags: "",
          published: true,
        });
        if (contentRef.current) {
          contentRef.current.innerHTML = "";
        }
        handleContentChange();
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        setError(data.message || "Failed to create blog");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Error creating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWordCount = () => {
    if (!contentRef.current) return 0;
    const text = contentRef.current.textContent || "";
    return text.split(" ").filter((word) => word.length > 0).length;
  };

  const wordCount = getWordCount();
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="max-w-full mx-auto p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#1A1A1D' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#A64D79' }}>
          Create New Blog
        </h1>
        <p className="text-gray-300">
          Share your thoughts and ideas with the world
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 border rounded-lg" style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55', color: '#A64D79' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 border rounded-lg" style={{ backgroundColor: '#3B1C32', borderColor: '#A64D79', color: '#A64D79' }}>
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Title, Category, Image */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              maxLength={200}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-white"
              style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}
              placeholder="Enter your blog title..."
            />
            <p className="text-sm text-gray-400 mt-1">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-white"
              style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
              Featured Image *
            </label>
            {!imagePreview ? (
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-opacity-80 transition-colors" style={{ borderColor: '#6A1E55' }}>
                <Upload className="mx-auto h-12 w-12" style={{ color: '#A64D79' }} />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90" style={{ backgroundColor: '#A64D79' }}>
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
                <p className="text-sm text-gray-400 mt-2">
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
                  className="absolute top-2 right-2 p-1 text-white rounded-full hover:opacity-80"
                  style={{ backgroundColor: '#6A1E55' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Content, Tags, Buttons */}
        <div className="space-y-6">
          {/* Content with Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
              Content *
            </label>
            
            {/* Editor Toolbar */}
            <div className="border rounded-t-lg p-2 flex flex-wrap gap-1" style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}>
              {editorButtons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => typeof button.command === 'function' ? button.command() : execCommand(button.command)}
                  className="p-2 rounded hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#6A1E55', color: '#A64D79' }}
                  title={button.title}
                >
                  <button.icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Editor Content Area */}
            <div
              ref={contentRef}
              contentEditable
              className="w-full px-4 py-3 border border-t-0 rounded-b-lg focus:ring-2 focus:border-transparent text-white min-h-[300px] outline-none"
              style={{ 
                backgroundColor: '#3B1C32', 
                borderColor: '#6A1E55',
                lineHeight: '1.6'
              }}
              onInput={handleContentChange}
              onPaste={(e) => {
                // Handle paste to avoid bringing in external styles
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
                setTimeout(() => handleContentChange(), 10);
              }}
              data-placeholder="Write your blog content here..."
              suppressContentEditableWarning={true}
            />

            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{wordCount} words</span>
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                {readTime} min read
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#A64D79' }}>
              Tags
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-2.5 h-4 w-4" style={{ color: '#A64D79' }} />
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-white"
                style={{ backgroundColor: '#3B1C32', borderColor: '#6A1E55' }}
                placeholder="Enter tags separated by commas"
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">
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
              className="h-4 w-4 border rounded"
              style={{ accentColor: '#A64D79', borderColor: '#6A1E55' }}
            />
            <label className="flex items-center text-sm font-medium" style={{ color: '#A64D79' }}>
              {formData.published ? (
                <Eye className="h-4 w-4 mr-2" style={{ color: '#A64D79' }} />
              ) : (
                <EyeOff className="h-4 w-4 mr-2 text-gray-400" />
              )}
              Publish immediately
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: "",
                  category: "",
                  content: "",
                  tags: "",
                  published: true,
                });
                if (contentRef.current) {
                  contentRef.current.innerHTML = "";
                }
                handleContentChange();
                setSelectedImage(null);
                setImagePreview(null);
              }}
              className="px-6 py-2 border rounded-lg hover:opacity-80 text-white"
              style={{ borderColor: '#6A1E55', backgroundColor: '#3B1C32' }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#A64D79' }}
            >
              {loading ? "Creating..." : "Create Blog"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        [contenteditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: #6B7280;
          pointer-events: none;
        }
        
        [contenteditable="true"] h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0;
          color: #A64D79;
        }
        
        [contenteditable="true"] blockquote {
          border-left: 4px solid #A64D79;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #D1D5DB;
        }
        
        [contenteditable="true"] ul {
          list-style-type: disc;
          list-style-position: inside;
          padding-left: 1.5rem;
          margin: 1rem 0;
          color: #D1D5DB;
        }
        
        [contenteditable="true"] ol {
          list-style-type: decimal;
          list-style-position: inside;
          padding-left: 1.5rem;
          margin: 1rem 0;
          color: #D1D5DB;
        }
        
        [contenteditable="true"] li {
          margin: 0.5rem 0;
          color: #D1D5DB;
          display: list-item;
        }
        
        [contenteditable="true"] ul li::marker {
          color: #A64D79;
        }
        
        [contenteditable="true"] ol li::marker {
          color: #A64D79;
        }
        
        [contenteditable="true"] a {
          color: #A64D79;
          text-decoration: underline;
        }
        
        [contenteditable="true"] p {
          margin: 0.5rem 0;
        }
        
        [contenteditable="true"] strike,
        [contenteditable="true"] s {
          text-decoration: line-through;
          color: #9CA3AF;
        }
      `}</style>
    </div>
  );
};

export default CreateBlog;