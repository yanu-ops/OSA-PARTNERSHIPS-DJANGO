import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePartnerships } from '../../hooks/usePartnerships';
import Navbar from '../../components/common/Navbar';
import PartnershipFilters from '../../components/partnerships/PartnershipFilters';
import PartnershipList from '../../components/partnerships/PartnershipList';
import PartnershipForm from '../../components/partnerships/PartnershipForm';
import PartnershipModal from '../../components/partnerships/PartnershipModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getDepartmentLabel } from '../../utils/helpers';

const DepartmentDashboard = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('own'); 
  
  
  const ownPartnershipsHook = usePartnerships({ department: user?.department });
  const allPartnershipsHook = usePartnerships();

 
  const currentHook = viewMode === 'own' ? ownPartnershipsHook : allPartnershipsHook;

  const {
    partnerships,
    loading,
    filters,
    updateFilters,
    clearFilters,
    createPartnership,
    updatePartnership,
    deletePartnership
  } = currentHook;

  
  const ownPartnerships = ownPartnershipsHook.partnerships || [];

 
  const otherPartnershipsAll = (allPartnershipsHook.partnerships || []).filter(
    p => p.department !== user?.department
  );
  const otherPartnershipsCount = otherPartnershipsAll.length;


  const otherPartnerships = viewMode === 'all'
    ? (partnerships || []).filter(p => p.department !== user?.department)
    : [];

  const displayPartnerships = viewMode === 'own' ? ownPartnerships : otherPartnerships;


  const stats = {
    total: ownPartnerships.length,
    active: ownPartnerships.filter(p => p.status === 'active').length,
    for_renewal: ownPartnerships.filter(p => p.status === 'for_renewal').length,
    terminated: ownPartnerships.filter(p => p.status === 'terminated').length
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [partnershipToDelete, setPartnershipToDelete] = useState(null);

  const handleCreateNew = () => {
    setSelectedPartnership(null);
    setIsFormOpen(true);
  };

  const handleEdit = (partnership) => {
    setSelectedPartnership(partnership);
    setIsFormOpen(true);
  };

  const handleView = (partnership) => {
    setSelectedPartnership(partnership);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (partnership) => {
    setPartnershipToDelete(partnership);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (partnershipToDelete) {
      await deletePartnership(partnershipToDelete.id);
      setPartnershipToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleFormSubmit = async (data) => {
    if (selectedPartnership) {
      const result = await updatePartnership(selectedPartnership.id, data);
      if (result?.success) {
        setIsFormOpen(false);
        setSelectedPartnership(null);
      }
    } else {
      const result = await createPartnership(data);
      if (result?.success) {
        setIsFormOpen(false);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-8">
  
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.department} Department Dashboard
          </h1>
          <p className="text-gray-700">{getDepartmentLabel(user?.department)}</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex space-x-2 bg-white rounded-lg shadow-md border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('own')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'own'
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              My Partnerships ({ownPartnerships.length})
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Other Departments ({otherPartnershipsCount})
            </button>
          </div>

          {viewMode === 'own' && (
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Partnership</span>
            </button>
          )}
        </div>


   
        <PartnershipFilters
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
          showDepartmentFilter={viewMode === 'all'}
        />

       
        <PartnershipList
          partnerships={displayPartnerships}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onView={handleView}
          canEdit={viewMode === 'own'}
          showFullDetails={true}
          groupByDepartment={viewMode === 'all'}
          userDepartment={user?.department}
          userRole={user?.role}
          itemsPerPage={3}
        />

      
        <PartnershipForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedPartnership(null);
          }}
          onSubmit={handleFormSubmit}
          partnership={selectedPartnership}
          loading={false}
          userDepartment={user?.department}
        />

  
        <PartnershipModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedPartnership(null);
          }}
          partnership={selectedPartnership}
          isLimitedAccess={viewMode === 'all'}
        />

       
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Partnership"
          message={`Are you sure you want to delete the partnership with ${partnershipToDelete?.business_name}? This action cannot be undone.`}
        />
      </main>
    </div>
  );
};

export default DepartmentDashboard;