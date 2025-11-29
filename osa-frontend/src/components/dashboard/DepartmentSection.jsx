import React from 'react';
import { Building2, ChevronRight } from 'lucide-react';
import { getDepartmentLabel } from '../../utils/helpers';

const DepartmentSection = ({ department, partnerships, onViewAll }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{department}</h3>
            <p className="text-sm text-gray-500">{getDepartmentLabel(department)}</p>
          </div>
        </div>
        
        <button
          onClick={onViewAll}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Partnerships</span>
          <span className="font-semibold text-gray-900">{partnerships.length}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Active</span>
          <span className="font-semibold text-green-600">
            {partnerships.filter(p => p.status === 'active').length}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">For Renewal</span>
          <span className="font-semibold text-yellow-600">
            {partnerships.filter(p => p.status === 'for_renewal').length}
          </span>
        </div>
      </div>

      {partnerships.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No partnerships yet</p>
        </div>
      )}
    </div>
  );
};

export default DepartmentSection;