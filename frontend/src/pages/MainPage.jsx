// MainPage.jsx
import React from 'react';
import { useAuth } from '../components/AuthProvider';
import { User } from 'lucide-react';

const MainPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">BlogTribe - Main Page</h1>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Welcome, {user?.name}!
            </h2>
            <p className="text-gray-500">
              This is the main page for regular users. Blog features will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;