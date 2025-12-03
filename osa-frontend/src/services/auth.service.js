import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        return { success: true, user, token };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  }

  async register(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      if (response.data.success) {
        return { 
          success: true, 
          user: response.data.data,
          message: response.data.message 
        };
      }
      
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  async checkEmailStatus(email) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.CHECK_EMAIL, { email });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      return { exists: false, status: null };
    } catch (error) {
      return { exists: false, status: null };
    }
  }

  async getProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
      if (response.data.success) {
        const user = response.data.data;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password',
      };
    }
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = '/login';
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

const authService = new AuthService();
export default authService;