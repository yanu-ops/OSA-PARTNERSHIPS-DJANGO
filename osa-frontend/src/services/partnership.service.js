import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

class PartnershipService {
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.status) params.append('status', filters.status);
      if (filters.school_year) params.append('school_year', filters.school_year);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(
        `${API_ENDPOINTS.PARTNERSHIPS.BASE}?${params.toString()}`
      );
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, data: [] };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch partnerships',
        data: [],
      };
    }
  }

  async getById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.PARTNERSHIPS.BY_ID(id));
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch partnership',
      };
    }
  }

  async create(partnershipData) {
    try {
     
      const response = await api.post(
        API_ENDPOINTS.PARTNERSHIPS.BASE,
        partnershipData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create partnership',
      };
    }
  }

  async update(id, partnershipData) {
    try {
    
      const response = await api.put(
        API_ENDPOINTS.PARTNERSHIPS.BY_ID(id),
        partnershipData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update partnership',
      };
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.PARTNERSHIPS.BY_ID(id));
      if (response.data.success) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete partnership',
      };
    }
  }

  async getStatistics() {
    try {
      const response = await api.get(API_ENDPOINTS.PARTNERSHIPS.STATISTICS);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, data: null };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch statistics',
        data: null,
      };
    }
  }
}

const partnershipService = new PartnershipService();
export default partnershipService;