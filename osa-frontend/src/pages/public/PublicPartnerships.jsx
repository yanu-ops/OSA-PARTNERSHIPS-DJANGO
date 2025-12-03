import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import api from '../../services/api';
import  Logo   from '../../components/common/Logo';
import PartnershipFilters from '../../components/partnerships/PartnershipFilters';
import PartnershipList from '../../components/partnerships/PartnershipList';
import PartnershipModal from '../../components/partnerships/PartnershipModal';

const PublicPartnerships = () => {
  const navigate = useNavigate();
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    school_year: ''
  });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState(null);

  const handleView = (partnership) => {
    setSelectedPartnership(partnership);
    setIsViewModalOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ search: '', department: '', school_year: '' });
  };

  useEffect(() => {
    const fetchPartnerships = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.department) params.append('department', filters.department);
        if (filters.school_year) params.append('school_year', filters.school_year);
        if (filters.search) params.append('search', filters.search);

        const response = await api.get(`/partnerships/public?${params.toString()}`);

        if (response.data.success) {
          setPartnerships(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching partnerships:', error);
        setPartnerships([]);
      }
      setLoading(false);
    };

    fetchPartnerships();
  }, [filters]);



  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      <nav className="bg-red-700 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">


            <div className="flex items-center space-x-3">
              <Logo size="medium" />
              <div>
                <h1 className="text-xl font-bold text-white">OSA Partnership System</h1>
                <p className="text-xs text-red-100">Holy Cross of Davao College</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>

            </div>

          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">HCDC DEPARTMENTAL PARTNERSHIPS</h2>
          <p className="text-gray-600">Browse our partnerships across all departments</p>
        </div>

        <PartnershipFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          showDepartmentFilter={true}
        />

        <PartnershipList
        partnerships={partnerships}
        onEdit={() => {}}
        onDelete={() => {}}
        onView={handleView}
        canEdit={false}
        showFullDetails={false}
        groupByDepartment={true}
        userDepartment={null}
        userRole="public"
        itemsPerPage={3}
        />

        <PartnershipModal
        isOpen={isViewModalOpen}
        onClose={() => {
            setIsViewModalOpen(false);
            setSelectedPartnership(null);
        }}
        partnership={selectedPartnership}
        isLimitedAccess={true}
        />

      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">45</span>
            </div>
            <div className="text-left">
              <p className="font-semibold">Group 45</p>
              <p className="text-sm text-gray-400">OSA Partnership System</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 OSA Partnership Monitoring System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};



export default PublicPartnerships;
