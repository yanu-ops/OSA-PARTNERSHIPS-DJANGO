import React from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';

const LogoutConfirmDialog = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 rounded-full p-2 mr-3">
            <AlertTriangle className="w-6 h-6 text-yellow-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to logout? You will need to login again to access your account.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            No
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Yes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmDialog;