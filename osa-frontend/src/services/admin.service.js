import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

class AdminService {
  async getPendingUsers() {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.PENDING_USERS);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, data: [] };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch pending users',
        data: [],
      };
    }
  }

  async approveUser(id) {
    try {
      const response = await api.post(API_ENDPOINTS.ADMIN.APPROVE_USER(id));
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to approve user',
      };
    }
  }

  async rejectUser(id, reason) {
    try {
      const response = await api.post(API_ENDPOINTS.ADMIN.REJECT_USER(id), { reason });
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reject user',
      };
    }
  }



  async getAllUsers() {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.USERS);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, data: [] };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users',
        data: [],
      };
    }
  }

  async createUser(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.ADMIN.USERS, userData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create user',
      };
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await api.put(
        API_ENDPOINTS.ADMIN.USER_BY_ID(id),
        userData
      );
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user',
      };
    }
  }

  async deleteUser(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
      if (response.data.success) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
      };
    }
  }

  async changeUserPassword(id, newPassword) {
    try {
      const response = await api.post(
        API_ENDPOINTS.ADMIN.CHANGE_USER_PASSWORD(id),
        { newPassword }
      );
      if (response.data.success) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password',
      };
    }
  }

  async getDashboardStats() {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, data: null };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard stats',
        data: null,
      };
    }
  }

  async getAuditLogs() {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.AUDIT_LOGS);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, data: [] };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch audit logs',
        data: [],
      };
    }
  }
}

const adminService = new AdminService();
export default adminService;