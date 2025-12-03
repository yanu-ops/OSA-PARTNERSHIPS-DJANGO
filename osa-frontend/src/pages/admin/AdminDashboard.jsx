import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePartnerships } from '../../hooks/usePartnerships';
import Sidebar from '../../components/common/Sidebar';
import PartnershipFilters from '../../components/partnerships/PartnershipFilters';
import PartnershipList from '../../components/partnerships/PartnershipList';
import PartnershipForm from '../../components/partnerships/PartnershipForm';
import PartnershipModal from '../../components/partnerships/PartnershipModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatsCard from '../../components/dashboard/StatsCard';
import { Building2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const {
    partnerships,
    loading,
    filters,
    updateFilters,
    clearFilters,
    createPartnership,
    updatePartnership,
    deletePartnership
  } = usePartnerships();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [partnershipToDelete, setPartnershipToDelete] = useState(null);

  const stats = {
    total: partnerships.length,
    active: partnerships.filter(p => p.status === 'active').length,
    for_renewal: partnerships.filter(p => p.status === 'for_renewal').length,
    terminated: partnerships.filter(p => p.status === 'terminated').length
  };

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
      if (result.success) {
        setIsFormOpen(false);
        setSelectedPartnership(null);
      }
    } else {
      const result = await createPartnership(data);
      if (result.success) {
        setIsFormOpen(false);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Partnerships"
            value={stats.total}
            icon={Building2}
            color="blue"
          />
          <StatsCard
            title="Active"
            value={stats.active}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="For Renewal"
            value={stats.for_renewal}
            icon={AlertCircle}
            color="yellow"
          />
          <StatsCard
            title="Terminated"
            value={stats.terminated}
            icon={XCircle}
            color="red"
          />
        </div>

 
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Partnerships</h2>
          <button
            onClick={handleCreateNew}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Partnership</span>
          </button>
        </div>

  
        <PartnershipFilters
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
          showDepartmentFilter={true}
        />

     
        <PartnershipList
          partnerships={partnerships}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onView={handleView}
          canEdit={true}
          showFullDetails={true}
          groupByDepartment={true}
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
        />


        <PartnershipModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedPartnership(null);
          }}
          partnership={selectedPartnership}
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

export default AdminDashboard;