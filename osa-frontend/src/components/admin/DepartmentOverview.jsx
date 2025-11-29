import React from 'react';
import { Building2, TrendingUp, TrendingDown } from 'lucide-react';
import { DEPARTMENTS } from '../../utils/constants';

const DepartmentOverview = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Department Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DEPARTMENTS.map(dept => {
          const count = stats.by_department?.[dept.value] || 0;
          const hasPartnerships = count > 0;

          return (
            <div 
              key={dept.value}
              className={`p-4 rounded-lg border-2 transition-all ${
                hasPartnerships 
                  ? 'border-blue-200 bg-blue-50 hover:shadow-md' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{dept.value}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dept.label}</p>
                </div>
                <Building2 className={`w-5 h-5 ${hasPartnerships ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Partnerships</span>
                <span className={`text-2xl font-bold ${hasPartnerships ? 'text-blue-600' : 'text-gray-400'}`}>
                  {count}
                </span>
              </div>

              {hasPartnerships && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>Active department</span>
                  </div>
                </div>
              )}

              {!hasPartnerships && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center text-xs text-gray-400">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    <span>No partnerships</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentOverview;