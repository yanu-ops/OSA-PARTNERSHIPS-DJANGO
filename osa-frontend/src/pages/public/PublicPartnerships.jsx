import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogIn, Search, Filter } from 'lucide-react';
import api from '../../services/api';
import { DEPARTMENTS } from '../../utils/constants';
import { getDepartmentLabel } from '../../utils/helpers';
import { usePagination } from '../../hooks/usePagination';
import  Logo   from '../../components/common/Logo';

const PublicPartnerships = () => {
  const navigate = useNavigate();
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    school_year: ''
  });

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

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const groupedPartnerships = partnerships.reduce((acc, partnership) => {
    const dept = partnership.department;
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(partnership);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-200 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">

      <nav className="bg-red-700 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">


            <div className="flex items-center space-x-3">
              <Logo size="medium" />
              <div>
                <h1 className="text-xl font-bold text-white">OSA Partnership System</h1>
                <p className="text-xs text-red-100">Public Partnership Directory</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Partnerships</p>
                <p className="text-3xl font-bold text-gray-900">{partnerships.length}</p>
              </div>
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-3xl font-bold text-gray-900">{Object.keys(groupedPartnerships).length}</p>
              </div>
              <Building2 className="w-10 h-10 text-green-600" />
            </div>
          </div>

        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search partnerships..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange({ department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept.value} value={dept.value}>{dept.value}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Year</label>
              <input
                type="text"
                placeholder="e.g., 2024-2025"
                value={filters.school_year}
                onChange={(e) => handleFilterChange({ school_year: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {Object.entries(groupedPartnerships).map(([dept, deptPartnerships]) => (
          <DepartmentSection key={dept} dept={dept} partnerships={deptPartnerships} />
        ))}

        {partnerships.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No partnerships found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}
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

const DepartmentSection = ({ dept, partnerships }) => {
  const pagination = usePagination(partnerships, 6);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{dept}</h3>
          <p className="text-sm text-gray-600">{getDepartmentLabel(dept)}</p>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {partnerships.length} partnerships
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {pagination.currentItems.map(partnership => (
          <PartnershipPublicCard key={partnership.id} partnership={partnership} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <div className="flex space-x-2">
            <button
              onClick={() => pagination.handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PartnershipPublicCard = ({ partnership }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-red-300 hover:shadow-lg transition-all overflow-hidden">
      {partnership.image_url ? (
        <div className="h-40 overflow-hidden bg-gray-100">
          <img
            src={partnership.image_url}
            alt={partnership.business_name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
          <Building2 className="w-16 h-16 text-red-300" />
        </div>
      )}

      <div className="p-4">
        <h4 className="font-semibold text-lg text-gray-900 mb-2">{partnership.business_name}</h4>
        <p className="text-sm text-gray-600 mb-3">{partnership.department}</p>

        {partnership.remarks && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-gray-700 line-clamp-3">{partnership.remarks}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPartnerships;
