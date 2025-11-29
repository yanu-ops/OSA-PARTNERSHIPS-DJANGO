import React from 'react';
import { Building2, Edit, Trash2, Lock } from 'lucide-react';
import { getDepartmentLabel } from '../../utils/helpers';

const PartnershipCard = ({ partnership, onEdit, onDelete, onView, canEdit, showFullDetails, isLimitedAccess = false }) => {
  if (isLimitedAccess) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden relative">
        {partnership.image_url ? (
          <div className="h-40 overflow-hidden bg-gray-100">
            <img
              src={partnership.image_url}
              alt={partnership.business_name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <Building2 className="w-16 h-16 text-blue-300" />
          </div>
        )}

        <div className="absolute top-4 right-4">
          <div className="bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>Limited</span>
          </div>
        </div>


        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{partnership.business_name}</h3>
            <p className="text-sm text-gray-500">{getDepartmentLabel(partnership.department)}</p>
          </div>

          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {partnership.department}
            </span>
          </div>

          {partnership.remarks && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-1">Description:</p>
              <p className="text-sm text-gray-600 line-clamp-3">{partnership.remarks}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              Limited access - Basic info only
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">

      {partnership.image_url ? (
        <div className="h-40 overflow-hidden bg-gray-100">
          <img
            src={partnership.image_url}
            alt={partnership.business_name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <Building2 className="w-16 h-16 text-blue-300" />
        </div>
      )}


      <div className="p-6">
  
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{partnership.business_name}</h3>
          <p className="text-sm text-gray-500">{getDepartmentLabel(partnership.department)}</p>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {partnership.department}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            partnership.status === 'active' ? 'bg-green-100 text-green-800' :
            partnership.status === 'for_renewal' ? 'bg-yellow-100 text-yellow-800' :
            partnership.status === 'terminated' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {partnership.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {partnership.contact_person && (
          <div className="mb-3 text-sm text-gray-700">
            <span className="font-medium">Contact:</span> {partnership.contact_person}
          </div>
        )}


        {partnership.remarks && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-1">Remarks:</p>
            <p className="text-sm text-gray-600 line-clamp-2">{partnership.remarks}</p>
          </div>
        )}

        <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(partnership)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => onDelete(partnership)}
                className="flex items-center justify-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnershipCard;