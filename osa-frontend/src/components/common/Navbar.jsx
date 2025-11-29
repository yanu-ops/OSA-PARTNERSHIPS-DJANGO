import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, ChevronDown } from 'lucide-react';
import  { Logo1 } from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    const roleColors = {
      admin: 'bg-red-800 text-white',
      department: 'bg-red-800 text-white',
      viewer: 'bg-red-800 text-white'
    };
    
    const roleLabels = {
      admin: 'Administrator',
      department: 'Department',
      viewer: 'Viewer'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user?.role]}`}>
        {roleLabels[user?.role]}
      </span>
    );
  };

  return (
    <nav className="bg-red-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center space-x-3">
          <Logo1 size="medium" />
          <div>
            <h1 className="text-xl font-bold text-white">OSA Partnership System</h1>
            <p className="text-xs text-red-100">Holy Cross of Davao College, Inc.</p>
            </div>
          </div>

          
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-white" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{user?.full_name}</p>
                  <p className="text-xs text-red-100">{user?.email}</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                  <div className="mt-2">{getRoleBadge()}</div>
                  {user?.department && (
                    <p className="text-xs text-gray-500 mt-1">Department: {user.department}</p>
                  )}
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;