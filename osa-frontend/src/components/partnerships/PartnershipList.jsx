import React from 'react';
import PartnershipCard from './PartnershipCard';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';

const PartnershipList = ({ 
  partnerships, 
  onEdit, 
  onDelete, 
  onView, 
  canEdit, 
  showFullDetails, 
  groupByDepartment = false, 
  userDepartment = null,
  userRole = null,
  itemsPerPage = 3 
}) => {
  
 
  const isLimitedAccess = (partnership) => {
   
    if (userRole === 'viewer') {
      return true;
    }
    
  
    if (userRole === 'department' && userDepartment) {
      return partnership.department !== userDepartment;
    }
    

    return false;
  };

  
    const mainPagination = usePagination(partnerships, itemsPerPage);

  if (partnerships.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No partnerships found</h3>
        <p className="text-gray-500">Try adjusting your filters or create a new partnership.</p>
      </div>
    );
  }

  if (groupByDepartment) {
    const grouped = partnerships.reduce((acc, partnership) => {
      const dept = partnership.department;
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(partnership);
      return acc;
    }, {});

    return (
      <div className="space-y-8">
        {Object.entries(grouped).map(([dept, deptPartnerships]) => {
          return (
            <DepartmentSection
              key={dept}
              dept={dept}
              deptPartnerships={deptPartnerships}
              itemsPerPage={itemsPerPage}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              canEdit={canEdit}
              showFullDetails={showFullDetails}
              isLimitedAccess={isLimitedAccess}
              userDepartment={userDepartment}
            />
          );
        })}
      </div>
    );
  }


  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {mainPagination.currentItems.map(partnership => (
          <PartnershipCard
            key={partnership.id}
            partnership={partnership}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            canEdit={canEdit && !isLimitedAccess(partnership)}
            showFullDetails={showFullDetails && !isLimitedAccess(partnership)}
            isLimitedAccess={isLimitedAccess(partnership)}
          />
        ))}
      </div>
      
      {mainPagination.totalPages > 1 && (
        <SimplePagination pagination={mainPagination} />
      )}
    </div>
  );
};


const DepartmentSection = ({ 
  dept, 
  deptPartnerships, 
  itemsPerPage,
  onEdit,
  onDelete,
  onView,
  canEdit,
  showFullDetails,
  isLimitedAccess,
  userDepartment
}) => {
  const deptPagination = usePagination(deptPartnerships, itemsPerPage);

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-bold text-gray-900">{dept}</h3>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            {deptPartnerships.length} {deptPartnerships.length === 1 ? 'partnership' : 'partnerships'}
          </span>
        </div>
        {userDepartment && dept !== userDepartment && (
          <span className="text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded-full">
            Limited Access
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {deptPagination.currentItems.map(partnership => (
          <PartnershipCard
            key={partnership.id}
            partnership={partnership}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            canEdit={canEdit && !isLimitedAccess(partnership)}
            showFullDetails={showFullDetails && !isLimitedAccess(partnership)}
            isLimitedAccess={isLimitedAccess(partnership)}
          />
        ))}
      </div>

      
      {deptPagination.totalPages > 1 && (
        <SimplePagination pagination={deptPagination} />
      )}
    </div>
  );
};


const SimplePagination = ({ pagination }) => {
  const { currentPage, totalPages, handlePageChange, totalItems } = pagination;
  
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-sm text-gray-700">
        Page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
        <span className="text-gray-500 ml-2">
          ({totalItems} total)
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center space-x-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
            currentPage === 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center space-x-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
            currentPage === totalPages
              ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PartnershipList;