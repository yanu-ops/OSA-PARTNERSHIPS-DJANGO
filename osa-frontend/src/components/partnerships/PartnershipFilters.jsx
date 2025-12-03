import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { DEPARTMENTS, PARTNERSHIP_STATUS } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

const PartnershipFilters = ({ filters, onFilterChange, onClearFilters, showDepartmentFilter = true }) => {
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  
  const showStatusFilter = user?.role === 'admin';

  const handleSearch = () => {
    onFilterChange({ search: searchInput });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${showStatusFilter ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search partnerships..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition-colors"
            >
              Search
            </button>
          </div>
        </div>


        {showDepartmentFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filters.department || ''}
              onChange={(e) => onFilterChange({ department: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept.value} value={dept.value}>{dept.value}</option>
              ))}
            </select>
          </div>
        )}

        {showStatusFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent"
            >
              <option value="">All Status</option>
              {PARTNERSHIP_STATUS.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        )}

  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">School Year</label>
          <input
            type="text"
            placeholder="e.g., 2024-2025"
            value={filters.school_year || ''}
            onChange={(e) => onFilterChange({ school_year: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default PartnershipFilters;