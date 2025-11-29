import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Building2, Activity } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import StatsCard from '../../components/dashboard/StatsCard';
import DepartmentOverview from '../../components/admin/DepartmentOverview';
import AnalyticsCard from '../../components/admin/AnalyticsCard';
import UserManagement from '../../components/admin/UserManagement';
import PendingUsersManagement from '../../components/admin/PendingUsersManagement';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import adminService from '../../services/admin.service';
import partnershipService from '../../services/partnership.service';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [partnershipStats, setPartnershipStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [statsResult, partnershipResult] = await Promise.all([
      adminService.getDashboardStats(),
      partnershipService.getStatistics()
    ]);

    if (statsResult.success) {
      setDashboardStats(statsResult.data);
    } else {
      toast.error('Failed to fetch dashboard stats');
    }

    if (partnershipResult.success) {
      setPartnershipStats(partnershipResult.data);
    }

    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Partnerships"
            value={dashboardStats?.partnerships?.total || 0}
            icon={Building2}
            color="blue"
            subtitle={`${dashboardStats?.partnerships?.active || 0} active`}
          />
          <StatsCard
            title="For Renewal"
            value={dashboardStats?.partnerships?.for_renewal || 0}
            icon={Activity}
            color="yellow"
            subtitle="Require attention"
          />
          <StatsCard
            title="Expiring Soon"
            value={dashboardStats?.partnerships?.expiring_soon || 0}
            icon={TrendingUp}
            color="red"
            subtitle="Within 30 days"
          />
          <StatsCard
            title="Total Users"
            value={dashboardStats?.users?.total || 0}
            icon={Users}
            color="purple"
            subtitle={`${dashboardStats?.users?.active || 0} active`}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Department Overview
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'pending'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Users
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <DepartmentOverview stats={partnershipStats} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Partnership Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnalyticsCard
                  title="Active Partnerships"
                  current={partnershipStats?.active || 0}
                  previous={partnershipStats?.active - 5 || 0}
                  icon={Building2}
                  color="green"
                />
                <AnalyticsCard
                  title="Terminated"
                  current={partnershipStats?.terminated || 0}
                  previous={partnershipStats?.terminated + 2 || 0}
                  icon={Activity}
                  color="red"
                />
                <AnalyticsCard
                  title="For Renewal"
                  current={partnershipStats?.for_renewal || 0}
                  previous={partnershipStats?.for_renewal - 1 || 0}
                  icon={TrendingUp}
                  color="yellow"
                />
                <AnalyticsCard
                  title="Total Count"
                  current={partnershipStats?.total || 0}
                  previous={partnershipStats?.total - 3 || 0}
                  icon={Building2}
                  color="blue"
                />
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Partnerships by Department</h4>
                <div className="space-y-3">
                  {Object.entries(partnershipStats?.by_department || {}).map(([dept, count]) => (
                    <div key={dept} className="flex items-center">
                      <div className="w-32 text-sm font-medium text-gray-700">{dept}</div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all"
                            style={{
                              width: `${partnershipStats?.total > 0 ? (count / partnershipStats.total) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm font-semibold text-gray-900">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">User Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-3xl font-bold text-purple-900">{dashboardStats?.users?.admin || 0}</p>
                  <p className="text-sm text-purple-700 mt-1">Administrators</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-3xl font-bold text-blue-900">{dashboardStats?.users?.department || 0}</p>
                  <p className="text-sm text-blue-700 mt-1">Department Admins</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-3xl font-bold text-green-900">{dashboardStats?.users?.viewer || 0}</p>
                  <p className="text-sm text-green-700 mt-1">Viewers</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-3xl font-bold text-gray-900">{dashboardStats?.users?.active || 0}</p>
                  <p className="text-sm text-gray-700 mt-1">Active Users</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && <UserManagement />}

        {activeTab === 'pending' && <PendingUsersManagement />}
      </main>
    </div>
  );
};

export default AdminPanel;
