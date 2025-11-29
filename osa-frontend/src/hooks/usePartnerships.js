import { useState, useEffect, useCallback } from 'react';
import partnershipService from '../services/partnership.service';
import toast from 'react-hot-toast';

export const usePartnerships = (initialFilters = {}) => {
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchPartnerships = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await partnershipService.getAll(filters);
    
    if (result.success) {
      setPartnerships(result.data);
    } else {
      setError(result.message);
      toast.error(result.message || 'Failed to fetch partnerships');
    }
    
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchPartnerships();
  }, [fetchPartnerships]);

  const createPartnership = async (data) => {
    const result = await partnershipService.create(data);
    if (result.success) {
      toast.success('Partnership created successfully');
      fetchPartnerships();
      return { success: true };
    } else {
      toast.error(result.message || 'Failed to create partnership');
      return { success: false, message: result.message };
    }
  };

  const updatePartnership = async (id, data) => {
    const result = await partnershipService.update(id, data);
    if (result.success) {
      toast.success('Partnership updated successfully');
      fetchPartnerships();
      return { success: true };
    } else {
      toast.error(result.message || 'Failed to update partnership');
      return { success: false, message: result.message };
    }
  };

  const deletePartnership = async (id) => {
    const result = await partnershipService.delete(id);
    if (result.success) {
      toast.success('Partnership deleted successfully');
      fetchPartnerships();
      return { success: true };
    } else {
      toast.error(result.message || 'Failed to delete partnership');
      return { success: false, message: result.message };
    }
  };

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    partnerships,
    loading,
    error,
    filters,
    fetchPartnerships,
    createPartnership,
    updatePartnership,
    deletePartnership,
    updateFilters,
    clearFilters,
  };
};