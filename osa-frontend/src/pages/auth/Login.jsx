// src/pages/auth/Login.jsx
// With email status check and approval indicator

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import authService from '../../services/auth.service';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Debounce email check
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (formData.email && formData.email.includes('@')) {
        checkEmailStatus(formData.email);
      } else {
        setEmailStatus(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.email]);

  const checkEmailStatus = async (email) => {
    setCheckingEmail(true);
    const result = await authService.checkEmailStatus(email);
    setCheckingEmail(false);
    setEmailStatus(result);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const getEmailStatusIcon = () => {
    if (checkingEmail) {
      return <Clock className="w-5 h-5 text-gray-400 animate-spin" />;
    }

    if (!emailStatus || !emailStatus.exists) {
      return null;
    }

    if (emailStatus.status === 'approved') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }

    if (emailStatus.status === 'pending') {
      return <Clock className="w-5 h-5 text-yellow-600" />;
    }

    if (emailStatus.status === 'rejected') {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }

    return null;
  };

  const getEmailStatusMessage = () => {
    if (!emailStatus || !emailStatus.exists) {
      return null;
    }

    if (emailStatus.status === 'approved') {
      return (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-green-800">
            ✓ Account approved! You can proceed to login.
          </p>
        </div>
      );
    }

    if (emailStatus.status === 'pending') {
      return (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
          <Clock className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            ⏳ Account pending approval. Please wait for admin verification.
          </p>
        </div>
      );
    }

    if (emailStatus.status === 'rejected') {
      return (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <XCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium">
              ✗ Account rejected
            </p>
            {emailStatus.rejection_reason && (
              <p className="text-xs text-red-700 mt-1">
                Reason: {emailStatus.rejection_reason}
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if email is approved before attempting login
    if (emailStatus && emailStatus.exists && emailStatus.status !== 'approved') {
      if (emailStatus.status === 'pending') {
        setError('Your account is pending admin approval. Please wait for verification.');
      } else if (emailStatus.status === 'rejected') {
        setError('Your account has been rejected. Please contact support.');
      }
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login successful!');
      
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (result.user.role === 'department') {
        navigate('/department/dashboard');
      } else {
        navigate('/viewer/dashboard');
      }
    } else {
      setError(result.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-700 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-700">OSA Partnership Monitoring System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-700 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email with Status Indicator */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getEmailStatusIcon()}
                </div>
              </div>
              {getEmailStatusMessage()}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (emailStatus && emailStatus.exists && emailStatus.status !== 'approved')}
              className="w-full py-3 px-4 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-700 hover:text-blue-800 font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;