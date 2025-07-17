// import React, { useState, useEffect } from 'react';
// import { 
//   HardDrive, 
//   Database, 
//   Image, 
//   Users, 
//   FileText, 
//   TrendingUp, 
//   Activity,
//   Trash2,
//   RefreshCw,
//   AlertTriangle
// } from 'lucide-react';

// const Storage = () => {
//   const [storageData, setStorageData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('overview');

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem('token');
//   };

//   // Create headers with authentication
//   const getAuthHeaders = () => {
//     const token = getAuthToken();
//     return {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     };
//   };

//   // Fetch storage data
//   const fetchStorageData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const token = getAuthToken();
//       if (!token) {
//         setError('No authentication token found. Please log in.');
//         setLoading(false);
//         return;
//       }

//       const response = await fetch('http://localhost:5000/api/storage/usage', {
//         method: 'GET',
//         headers: getAuthHeaders()
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           setError('Authentication failed. Please log in again.');
//           // Optionally clear the token if it's invalid
//           localStorage.removeItem('token');
//           return;
//         }
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
      
//       if (data.success) {
//         setStorageData(data.data);
//       } else {
//         setError(data.message || 'Failed to fetch storage data');
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch storage data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle cleanup
//   const handleCleanup = async () => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         alert('No authentication token found. Please log in.');
//         return;
//       }

//       const response = await fetch('http://localhost:5000/api/storage/cleanup', {
//         method: 'POST',
//         headers: getAuthHeaders()
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           alert('Authentication failed. Please log in again.');
//           localStorage.removeItem('token');
//           return;
//         }
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
      
//       if (data.success) {
//         alert(`Cleanup completed: ${data.data.deletedBlogs} blogs deleted, ${data.data.freedSpace} freed`);
//         fetchStorageData(); // Refresh data
//       } else {
//         alert('Cleanup failed: ' + (data.message || 'Unknown error'));
//       }
//     } catch (err) {
//       alert('Cleanup failed: ' + err.message);
//     }
//   };

//   useEffect(() => {
//     fetchStorageData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <div className="flex items-center space-x-2 text-red-600 mb-2">
//             <AlertTriangle className="h-5 w-5" />
//             <span className="font-medium">Error</span>
//           </div>
//           <p className="text-red-700">{error}</p>
//           <button
//             onClick={fetchStorageData}
//             className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check if we have storage data
//   if (!storageData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="text-gray-600 mb-4">No storage data available</div>
//           <button
//             onClick={fetchStorageData}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
//           >
//             Load Data
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { summary, breakdown, categoryStats, monthlyGrowth, topCreators } = storageData;

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Storage Management</h1>
//             <p className="text-gray-600">Monitor and manage your application's storage usage</p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={fetchStorageData}
//               className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <RefreshCw className="h-4 w-4" />
//               <span>Refresh</span>
//             </button>
//             <button
//               onClick={handleCleanup}
//               className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//             >
//               <Trash2 className="h-4 w-4" />
//               <span>Cleanup</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Storage Overview Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-2 bg-blue-50 rounded-lg">
//               <HardDrive className="h-6 w-6 text-blue-600" />
//             </div>
//             <span className="text-sm text-gray-500">Total Storage</span>
//           </div>
//           <div className="text-2xl font-bold text-gray-900">{summary.totalEstimatedStorage}</div>
//           <div className="text-sm text-gray-500 mt-1">Estimated usage</div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-2 bg-green-50 rounded-lg">
//               <FileText className="h-6 w-6 text-green-600" />
//             </div>
//             <span className="text-sm text-gray-500">Total Blogs</span>
//           </div>
//           <div className="text-2xl font-bold text-gray-900">{summary.totalBlogs}</div>
//           <div className="text-sm text-gray-500 mt-1">Published articles</div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-2 bg-purple-50 rounded-lg">
//               <Users className="h-6 w-6 text-purple-600" />
//             </div>
//             <span className="text-sm text-gray-500">Total Users</span>
//           </div>
//           <div className="text-2xl font-bold text-gray-900">{summary.totalUsers}</div>
//           <div className="text-sm text-gray-500 mt-1">Registered users</div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-2 bg-orange-50 rounded-lg">
//               <Database className="h-6 w-6 text-orange-600" />
//             </div>
//             <span className="text-sm text-gray-500">Documents</span>
//           </div>
//           <div className="text-2xl font-bold text-gray-900">{summary.totalDocumentStorage}</div>
//           <div className="text-sm text-gray-500 mt-1">Database size</div>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="mb-6">
//         <nav className="flex space-x-8 border-b border-gray-200">
//           {[
//             { id: 'overview', label: 'Overview', icon: Activity },
//             { id: 'breakdown', label: 'Breakdown', icon: Database },
//             { id: 'categories', label: 'Categories', icon: FileText },
//             { id: 'creators', label: 'Top Creators', icon: Users },
//             { id: 'growth', label: 'Growth', icon: TrendingUp }
//           ].map(({ id, label, icon: Icon }) => (
//             <button
//               key={id}
//               onClick={() => setActiveTab(id)}
//               className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === id
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               <Icon className="h-4 w-4" />
//               <span>{label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Tab Content */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         {activeTab === 'overview' && (
//           <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Storage Overview</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <Database className="h-5 w-5 text-blue-600" />
//                     <span className="font-medium">Blog Documents</span>
//                   </div>
//                   <span className="text-gray-900">{breakdown.documents.blogs.formatted}</span>
//                 </div>
//                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <Users className="h-5 w-5 text-green-600" />
//                     <span className="font-medium">User Documents</span>
//                   </div>
//                   <span className="text-gray-900">{breakdown.documents.users.formatted}</span>
//                 </div>
//                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <Image className="h-5 w-5 text-purple-600" />
//                     <span className="font-medium">Images (Estimated)</span>
//                   </div>
//                   <span className="text-gray-900">{breakdown.images.formatted}</span>
//                 </div>
//               </div>
//               <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
//                 <h3 className="font-semibold text-gray-900 mb-2">Total Estimated Storage</h3>
//                 <div className="text-3xl font-bold text-gray-900 mb-2">
//                   {breakdown.total.estimatedFormatted}
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   Documents: {breakdown.total.documentsFormatted}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'breakdown' && (
//           <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Detailed Breakdown</h2>
//             <div className="space-y-6">
//               <div>
//                 <h3 className="font-medium text-gray-900 mb-3">Document Storage</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="bg-blue-50 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium text-blue-900">Blogs</span>
//                       <span className="text-blue-700">{breakdown.documents.blogs.count} items</span>
//                     </div>
//                     <div className="text-2xl font-bold text-blue-900">
//                       {breakdown.documents.blogs.formatted}
//                     </div>
//                   </div>
//                   <div className="bg-green-50 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium text-green-900">Users</span>
//                       <span className="text-green-700">{breakdown.documents.users.count} items</span>
//                     </div>
//                     <div className="text-2xl font-bold text-green-900">
//                       {breakdown.documents.users.formatted}
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div>
//                 <h3 className="font-medium text-gray-900 mb-3">Image Storage (Estimated)</h3>
//                 <div className="bg-purple-50 rounded-lg p-4">
//                   <div className="text-2xl font-bold text-purple-900 mb-2">
//                     {breakdown.images.formatted}
//                   </div>
//                   <div className="text-sm text-purple-700">
//                     Includes blog images and profile pictures
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'categories' && (
//           <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
//             <div className="space-y-4">
//               {categoryStats && categoryStats.length > 0 ? (
//                 categoryStats.map((category, index) => (
//                   <div key={category._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-900">{category._id}</div>
//                         <div className="text-sm text-gray-500">
//                           Avg. content length: {Math.round(category.avgContentLength)} chars
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-semibold text-gray-900">{category.count}</div>
//                       <div className="text-sm text-gray-500">articles</div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   No category data available
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === 'creators' && (
//           <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Top Content Creators</h2>
//             <div className="space-y-4">
//               {topCreators && topCreators.length > 0 ? (
//                 topCreators.map((creator, index) => (
//                   <div key={creator._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-900">{creator.name}</div>
//                         <div className="text-sm text-gray-500">{creator.email}</div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-semibold text-gray-900">{creator.blogCount} blogs</div>
//                       <div className="text-sm text-gray-500">{creator.estimatedStorage}</div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   No creator data available
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === 'growth' && (
//           <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Monthly Growth</h2>
//             <div className="space-y-4">
//               {monthlyGrowth && monthlyGrowth.length > 0 ? (
//                 monthlyGrowth.map((month, index) => (
//                   <div key={`${month._id.year}-${month._id.month}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-900">
//                           {new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           Avg. content: {Math.round(month.totalContentLength / month.blogCount)} chars
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-semibold text-gray-900">{month.blogCount} blogs</div>
//                       <div className="text-sm text-gray-500">{Math.round(month.totalContentLength / 1000)}K chars</div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   No growth data available
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Storage;




import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  Database, 
  Image, 
  Users, 
  FileText, 
  TrendingUp, 
  Activity,
  Trash2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

const Storage = () => {
  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Create headers with authentication
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch storage data from API
  const fetchStorageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/storage/usage', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          localStorage.removeItem('token');
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setStorageData(data.data);
      } else {
        setError(data.message || 'Failed to fetch storage data');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch storage data');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchStorageData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: '#1A1A1D'}}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{borderColor: '#A64D79'}}></div>
          <div className="text-white">Loading storage data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: '#1A1A1D'}}>
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-md backdrop-blur-sm" style={{backgroundColor: '#3B1C32', borderColor: '#6A1E55'}}>
          <div className="flex items-center space-x-2 text-red-400 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchStorageData}
            className="text-white px-4 py-2 rounded hover:opacity-80 transition-colors"
            style={{backgroundColor: '#A64D79'}}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if we have storage data
  if (!storageData) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: '#1A1A1D'}}>
        <div className="text-center">
          <div className="text-gray-300 mb-4">No storage data available</div>
          <button
            onClick={fetchStorageData}
            className="text-white px-4 py-2 rounded hover:opacity-80 transition-colors"
            style={{backgroundColor: '#A64D79'}}
          >
            Load Data
          </button>
        </div>
      </div>
    );
  }

  const { summary, breakdown, categoryStats, monthlyGrowth, topCreators } = storageData;

  return (
    <div className="min-h-screen" style={{backgroundColor: '#1A1A1D'}}>
      <div className="max-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Storage Management</h1>
              <p className="text-gray-300">Monitor and manage your application's storage usage</p>
            </div>
            
          </div>
        </div>

        {/* Storage Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-lg shadow-lg border p-6 backdrop-blur-sm" style={{backgroundColor: '#3B1C32', borderColor: '#6A1E55'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg" style={{backgroundColor: '#6A1E55'}}>
                <HardDrive className="h-6 w-6" style={{color: '#A64D79'}} />
              </div>
              <span className="text-sm text-gray-300">Total Storage</span>
            </div>
            <div className="text-2xl font-bold text-white">{summary?.totalEstimatedStorage || 'N/A'}</div>
            <div className="text-sm text-gray-400 mt-1">Estimated usage</div>
          </div>

          <div className="rounded-lg shadow-lg border p-6 backdrop-blur-sm" style={{backgroundColor: '#3B1C32', borderColor: '#6A1E55'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg" style={{backgroundColor: '#6A1E55'}}>
                <FileText className="h-6 w-6" style={{color: '#A64D79'}} />
              </div>
              <span className="text-sm text-gray-300">Total Blogs</span>
            </div>
            <div className="text-2xl font-bold text-white">{summary?.totalBlogs || 0}</div>
            <div className="text-sm text-gray-400 mt-1">Published articles</div>
          </div>

          <div className="rounded-lg shadow-lg border p-6 backdrop-blur-sm" style={{backgroundColor: '#3B1C32', borderColor: '#6A1E55'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg" style={{backgroundColor: '#6A1E55'}}>
                <Users className="h-6 w-6" style={{color: '#A64D79'}} />
              </div>
              <span className="text-sm text-gray-300">Total Users</span>
            </div>
            <div className="text-2xl font-bold text-white">{summary?.totalUsers || 0}</div>
            <div className="text-sm text-gray-400 mt-1">Registered users</div>
          </div>

          <div className="rounded-lg shadow-lg border p-6 backdrop-blur-sm" style={{backgroundColor: '#3B1C32', borderColor: '#6A1E55'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg" style={{backgroundColor: '#6A1E55'}}>
                <Database className="h-6 w-6" style={{color: '#A64D79'}} />
              </div>
              <span className="text-sm text-gray-300">Documents</span>
            </div>
            <div className="text-2xl font-bold text-white">{summary?.totalDocumentStorage || 'N/A'}</div>
            <div className="text-sm text-gray-400 mt-1">Database size</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b" style={{borderColor: '#6A1E55'}}>
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'breakdown', label: 'Breakdown', icon: Database },
              { id: 'categories', label: 'Categories', icon: FileText },
              { id: 'creators', label: 'Top Creators', icon: Users },
              { id: 'growth', label: 'Growth', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
                style={activeTab === id ? {borderColor: '#A64D79'} : {}}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="rounded-lg shadow-lg border backdrop-blur-sm" style={{backgroundColor: '#3B1C32', borderColor: '#6A1E55'}}>
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Storage Overview</h2>
              {breakdown ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border" style={{backgroundColor: '#6A1E55', borderColor: '#A64D79'}}>
                      <div className="flex items-center space-x-3">
                        <Database className="h-5 w-5" style={{color: '#A64D79'}} />
                        <span className="font-medium text-white">Blog Documents</span>
                      </div>
                      <span className="text-white">{breakdown.documents?.blogs?.formatted || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border" style={{backgroundColor: '#6A1E55', borderColor: '#A64D79'}}>
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5" style={{color: '#A64D79'}} />
                        <span className="font-medium text-white">User Documents</span>
                      </div>
                      <span className="text-white">{breakdown.documents?.users?.formatted || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border" style={{backgroundColor: '#6A1E55', borderColor: '#A64D79'}}>
                      <div className="flex items-center space-x-3">
                        <Image className="h-5 w-5" style={{color: '#A64D79'}} />
                        <span className="font-medium text-white">Images (Estimated)</span>
                      </div>
                      <span className="text-white">{breakdown.images?.formatted || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="rounded-lg p-6 border" style={{backgroundColor: '#6A1E55', borderColor: '#A64D79'}}>
                    <h3 className="font-semibold text-white mb-2">Total Estimated Storage</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      {breakdown.total?.estimatedFormatted || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-300">
                      Documents: {breakdown.total?.documentsFormatted || 'N/A'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No breakdown data available
                </div>
              )}
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Detailed Breakdown</h2>
              {breakdown ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-white mb-3">Document Storage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg p-4 border" style={{backgroundColor: '#6A1E55', borderColor: '#A64D79'}}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium" style={{color: '#A64D79'}}>Blogs</span>
                          <span style={{color: '#A64D79'}}>{breakdown.documents?.blogs?.count || 0} items</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {breakdown.documents?.blogs?.formatted || 'N/A'}
                        </div>
                      </div>
                      <div className="rounded-lg p-4 border" style={{backgroundColor: '#6A1E55', borderColor: '#A64D79'}}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium" style={{color: '#A64D79'}}>Users</span>
                          <span style={{color: '#A64D79'}}>{breakdown.documents?.users?.count || 0} items</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {breakdown.documents?.users?.formatted || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-white mb-3">Image Storage (Estimated)</h3>
                    <div className="rounded-lg p-4 border" style={{backgroundColor: '#6A1E55', borderColor: '#A64D79'}}>
                      <div className="text-2xl font-bold text-white mb-2">
                        {breakdown.images?.formatted || 'N/A'}
                      </div>
                      <div className="text-sm" style={{color: '#A64D79'}}>
                        Includes blog images and profile pictures
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No breakdown data available
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Category Distribution</h2>
              <div className="space-y-4">
                {categoryStats && categoryStats.length > 0 ? (
                  categoryStats.map((category, index) => (
                    <div key={category._id} className="flex items-center justify-between p-4 rounded-lg border" style={{backgroundColor: '#6A1E55', borderColor: '#A64D79'}}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{backgroundColor: '#A64D79'}}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white">{category._id}</div>
                          <div className="text-sm text-gray-300">
                            Avg. content length: {Math.round(category.avgContentLength)} chars
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{category.count}</div>
                        <div className="text-sm text-gray-300">articles</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No category data available
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'creators' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Top Content Creators</h2>
              <div className="space-y-4">
                {topCreators && topCreators.length > 0 ? (
                  topCreators.map((creator, index) => (
                    <div key={creator._id} className="flex items-center justify-between p-4 rounded-lg border" style={{backgroundColor: '#6A1E55', borderColor: '#A64D79'}}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{backgroundColor: '#A64D79'}}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white">{creator.name}</div>
                          <div className="text-sm text-gray-300">{creator.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{creator.blogCount} blogs</div>
                        <div className="text-sm text-gray-300">{creator.estimatedStorage}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No creator data available
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'growth' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Monthly Growth</h2>
              <div className="space-y-4">
                {monthlyGrowth && monthlyGrowth.length > 0 ? (
                  monthlyGrowth.map((month, index) => (
                    <div key={`${month._id.year}-${month._id.month}`} className="flex items-center justify-between p-4 rounded-lg border" style={{backgroundColor: '#6A1E55', borderColor: '#A64D79'}}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{backgroundColor: '#A64D79'}}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </div>
                          <div className="text-sm text-gray-300">
                            Avg. content: {Math.round(month.totalContentLength / month.blogCount)} chars
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{month.blogCount} blogs</div>
                        <div className="text-sm text-gray-300">{Math.round(month.totalContentLength / 1000)}K chars</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No growth data available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Storage;