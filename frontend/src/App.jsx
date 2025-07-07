

// // App.jsx
// import React, { useState } from 'react';
// // import React, { useState } from 'react';
// import { AuthProvider, useAuth } from './components/AuthProvider';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import MainPage from './pages/MainPage';
// import AdminPanel from './pages/AdminPanel';
// import LandingPage from './pages/LandingPage';

// const InnerApp = () => {
//   const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'login' | 'register'
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (user) {
//     return user.role === 'admin' ? <AdminPanel /> : <MainPage />;
//   }

//   if (currentPage === 'login') {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           <LoginPage onSwitchToRegister={() => setCurrentPage('register')} />
//         </div>
//       </div>
//     );
//   }

//   if (currentPage === 'register') {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           <RegisterPage onSwitchToLogin={() => setCurrentPage('login')} />
//         </div>
//       </div>
//     );
//   }

//   return <LandingPage onSignIn={() => setCurrentPage('login')} onSignUp={() => setCurrentPage('register')} />;
// };

// const App = () => (
//   <AuthProvider>
//     <InnerApp />
//   </AuthProvider>
// );

// export default App;


// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import AdminPanel from './pages/AdminPanel';
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  return children;
};

const RoleBasedRoute = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminPanel /> : <MainPage />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <RoleBasedRoute />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
