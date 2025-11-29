import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Users as UsersIcon, Shield, Eye, Building2, Key } from 'lucide-react';
import adminService from '../../services/admin.service';
import UserForm from './UserForm';
import ConfirmDialog from '../common/ConfirmDialog';
import ChangePasswordModal from './ChangePasswordModal';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [userToChangePassword, setUserToChangePassword] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); 

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await adminService.getAllUsers();
    if (result.success) {
      setUsers(result.data);
    } else {
      toast.error(result.message || 'Failed to fetch users');
    }
    setLoading(false);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleChangePasswordClick = (user) => {
    setUserToChangePassword(user);
    setIsChangePasswordOpen(true);
  };

  const handleChangePasswordSubmit = async (newPassword) => {
    if (userToChangePassword) {
      const result = await adminService.changeUserPassword(userToChangePassword.id, newPassword);
      if (result.success) {
        toast.success('Password changed successfully');
        setIsChangePasswordOpen(false);
        setUserToChangePassword(null);
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      const result = await adminService.deleteUser(userToDelete.id);
      if (result.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        toast.error(result.message || 'Failed to delete user');
      }
    }
  };

  const handleFormSubmit = async (userData) => {
    let result;
    if (selectedUser) {
      result = await adminService.updateUser(selectedUser.id, userData);
    } else {
      result = await adminService.createUser(userData);
    }

    if (result.success) {
      toast.success(selectedUser ? 'User updated successfully' : 'User created successfully');
      setIsFormOpen(false);
      fetchUsers();
    } else {
      toast.error(result.message || 'Operation failed');
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      department: 'bg-blue-100 text-blue-800',
      viewer: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

 
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || user.role === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const userStats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    department: users.filter(u => u.role === 'department').length,
    viewer: users.filter(u => u.role === 'viewer').length,
    active: users.filter(u => u.is_active).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
    
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-md p-4 border border-purple-200">
          <p className="text-sm text-purple-700">Administrators</p>
          <p className="text-2xl font-bold text-purple-900">{userStats.admin}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-4 border border-blue-200">
          <p className="text-sm text-blue-700">Departments</p>
          <p className="text-2xl font-bold text-blue-900">{userStats.department}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4 border border-green-200">
          <p className="text-sm text-green-700">Viewers</p>
          <p className="text-2xl font-bold text-green-900">{userStats.viewer}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-gray-900">{userStats.active}</p>
        </div>
      </div>

  
      <div className="bg-white rounded-lg shadow-md border border-gray-200">

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UsersIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">User Management</h3>
            </div>
            <button
              onClick={handleCreateUser}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>

 
          <div className="mt-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, role, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

  
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UsersIcon className="w-4 h-4" />
              <span>All Users</span>
              <span className="ml-2 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                {userStats.total}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'admin'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Administrators</span>
              <span className="ml-2 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                {userStats.admin}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('department')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'department'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Departments</span>
              <span className="ml-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {userStats.department}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('viewer')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'viewer'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Viewers</span>
              <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                {userStats.viewer}
              </span>
            </button>
          </nav>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'No users found matching your search' : `No ${activeTab !== 'all' ? activeTab : ''} users found`}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.department || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleChangePasswordClick(user)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Change password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

  
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{filteredUsers.length}</span> of{' '}
              <span className="font-medium text-gray-900">{users.length}</span> total users
              {activeTab !== 'all' && ` (${activeTab} only)`}
            </p>
          </div>
        )}
      </div>

      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
      />


      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.full_name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => {
          setIsChangePasswordOpen(false);
          setUserToChangePassword(null);
        }}
        onSubmit={handleChangePasswordSubmit}
        user={userToChangePassword}
      />
    </div>
  );
};

export default UserManagement;