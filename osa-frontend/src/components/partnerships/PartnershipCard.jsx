import React from 'react';
import { Building2, Calendar, Mail, Phone, User, Edit, Trash2, Eye, Lock } from 'lucide-react';
import { formatDate, getStatusColor, getDepartmentLabel } from '../../utils/helpers';

const PartnershipCard = ({ partnership, onEdit, onDelete, onView, canEdit, showFullDetails, isLimitedAccess = false }) => {
  const statusColor = getStatusColor(partnership.status);


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
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {partnership.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

      
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-medium">{formatDate(partnership.date_established)} - {formatDate(partnership.expiration_date)}</p>
              </div>
            </div>

            {partnership.school_year && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">School Year:</span>
                <span className="ml-2">{partnership.school_year}</span>
              </div>
            )}
          </div>

   
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">
              🔒 Contact details restricted
            </p>
          </div>

      
          <div className="mt-4">
            <button
              onClick={() => onView(partnership)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>
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
    
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{partnership.business_name}</h3>
            <p className="text-sm text-gray-500">{getDepartmentLabel(partnership.department)}</p>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {partnership.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

  
        <div className="space-y-3 mb-4">
          {partnership.contact_person && (
            <div className="flex items-center text-sm text-gray-800">
              <User className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{partnership.contact_person}</span>
            </div>
          )}

          {showFullDetails && partnership.email && (
            <div className="flex items-center text-sm text-gray-800">
              <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{partnership.email}</span>
            </div>
          )}

          {showFullDetails && partnership.contact_number && (
            <div className="flex items-center text-sm text-gray-800">
              <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{partnership.contact_number}</span>
            </div>
          )}

          <div className="flex items-start text-sm text-gray-800">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-medium">{formatDate(partnership.date_established)} - {formatDate(partnership.expiration_date)}</p>
            </div>
          </div>

          {showFullDetails && partnership.remarks && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-800 mb-1">Remarks:</p>
              <p className="text-sm text-gray-800 line-clamp-2">{partnership.remarks}</p>
            </div>
          )}
        </div>

    
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onView(partnership)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>

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