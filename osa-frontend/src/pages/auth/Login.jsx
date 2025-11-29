import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {  Mail, Lock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Logo from '../../components/common/Logo';

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


  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email && formData.email.includes('@')) {
        setCheckingEmail(true);
        try {
          const response = await api.post('/auth/check-email-status', {
            email: formData.email
          });
          
          if (response.data.success) {
            setEmailStatus(response.data.status); 
          }
        } catch (error) {
          setEmailStatus(null);
        }
        setCheckingEmail(false);
      } else {
        setEmailStatus(null);
      }
    };

    const timeoutId = setTimeout(checkEmail, 500); 
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const getEmailStatusIcon = () => {
    if (checkingEmail) {
      return <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />;
    }

    if (emailStatus === 'approved') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }

    if (emailStatus === 'pending' || emailStatus === 'rejected' || emailStatus === 'not_found') {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }

    return null;
  };

  const getEmailStatusMessage = () => {
    if (emailStatus === 'approved') {
      return <p className="text-xs text-green-600 mt-1">✓ Account approved</p>;
    }
    if (emailStatus === 'pending') {
      return <p className="text-xs text-yellow-600 mt-1">⏳ Account pending approval</p>;
    }
    if (emailStatus === 'rejected') {
      return <p className="text-xs text-red-600 mt-1">✗ Account rejected by admin</p>;
    }
    if (emailStatus === 'not_found') {
      return <p className="text-xs text-red-600 mt-1">✗ Account not found</p>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4 relative">
  
      <div className="absolute top-6 left-6">
        <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-1xl">45</span>
        </div>
      </div>

      <div className="max-w-md w-full">

        <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
    <Logo size="xlarge" />
  </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-700">OSA Partnership Monitoring System</p>
        </div>


        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-700 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

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

            <button
              type="submit"
              disabled={loading || emailStatus === 'pending' || emailStatus === 'rejected'}
              className="w-full py-3 px-4 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>


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