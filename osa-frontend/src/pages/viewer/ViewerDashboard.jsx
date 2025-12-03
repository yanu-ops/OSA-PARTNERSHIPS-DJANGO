import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePartnerships } from '../../hooks/usePartnerships';
import Navbar from '../../components/common/Navbar';
import PartnershipFilters from '../../components/partnerships/PartnershipFilters';
import PartnershipList from '../../components/partnerships/PartnershipList';
import PartnershipModal from '../../components/partnerships/PartnershipModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ViewerDashboard = () => {
  useAuth();
  const {
    partnerships,
    loading,
    filters,
    updateFilters,
    clearFilters
  } = usePartnerships();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState(null);



  const handleView = (partnership) => {
    setSelectedPartnership(partnership);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-8">
      
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partnership Directory</h1>
          <p className="text-gray-600">Browse institutional partnerships</p>
        </div>

   

     
        <PartnershipFilters
          filters={filters}
          onFilterChange={updateFilters}
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
          userRole="viewer"
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
    </div>
  );
};

export default ViewerDashboard;