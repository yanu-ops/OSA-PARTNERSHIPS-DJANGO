import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, FileText, Lock, Building2 } from 'lucide-react';
import { formatDate, getStatusColor, getDepartmentLabel } from '../../utils/helpers';

const PartnershipModal = ({ isOpen, onClose, partnership, isLimitedAccess = false }) => {
  if (!isOpen || !partnership) return null;

  const statusColor = getStatusColor(partnership.status);

  const hasLimitedData = !partnership.contact_person && !partnership.email && !partnership.address;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{partnership.business_name}</h2>
              {(isLimitedAccess || hasLimitedData) && (
                <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Limited Access</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">{getDepartmentLabel(partnership.department)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
 
          {(partnership.image_url || isLimitedAccess || hasLimitedData) && (
            <div>
              {partnership.image_url ? (
                <img
                  src={partnership.image_url}
                  alt={partnership.business_name}
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <Building2 className="w-24 h-24 text-blue-300" />
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Department
            </h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">{partnership.department}</p>
              <p className="text-xs text-blue-700 mt-1">{getDepartmentLabel(partnership.department)}</p>
            </div>
          </div>

          {partnership.remarks && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Remarks
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">{partnership.remarks}</p>
              </div>
            </div>
          )}


          {!isLimitedAccess && !hasLimitedData && (
            <>
      
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                  {partnership.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>


              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Partnership Duration
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date Established</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(partnership.date_established)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expiration Date</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(partnership.expiration_date)}</span>
                  </div>
                  {partnership.school_year && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">School Year</span>
                      <span className="text-sm font-medium text-gray-900">{partnership.school_year}</span>
                    </div>
                  )}
                </div>
              </div>

              {partnership.contact_person && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Contact Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {partnership.contact_person && (
                      <div className="flex items-start">
                        <User className="w-4 h-4 text-gray-400 mt-1 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Contact Person</p>
                          <p className="text-sm font-medium text-gray-900">{partnership.contact_person}</p>
                        </div>
                      </div>
                    )}

                    {partnership.email && (
                      <div className="flex items-start">
                        <Mail className="w-4 h-4 text-gray-400 mt-1 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-900">{partnership.email}</p>
                        </div>
                      </div>
                    )}

                    {partnership.contact_number && (
                      <div className="flex items-start">
                        <Phone className="w-4 h-4 text-gray-400 mt-1 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-900">{partnership.contact_number}</p>
                        </div>
                      </div>
                    )}

                    {partnership.address && (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="text-sm font-medium text-gray-900">{partnership.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {partnership.manager_supervisor_1 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Management</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Manager/Supervisor 1</p>
                      <p className="text-sm font-medium text-gray-900">{partnership.manager_supervisor_1}</p>
                    </div>
                    {partnership.manager_supervisor_2 && (
                      <div>
                        <p className="text-xs text-gray-500">Manager/Supervisor 2</p>
                        <p className="text-sm font-medium text-gray-900">{partnership.manager_supervisor_2}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {(isLimitedAccess || hasLimitedData) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 mb-1">Limited Access</p>
                  <p className="text-xs text-yellow-800">
                    You have limited access to this partnership. Only basic information is visible: business name, logo, department, and remarks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnershipModal;