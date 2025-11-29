import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Logo1 } from './Logo';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Admin Panel', path: '/admin/panel', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => (
    <span className="bg-red-800 text-white px-2 py-1 rounded-full text-xs font-medium">
      Administrator
    </span>
  );

  return (
    <div className={`bg-red-700 shadow-lg h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} sticky top-0`}>
      

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-2 top-6 bg-white border-2 border-red-700 rounded-full p-1 hover:bg-red-50 transition-colors z-10"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-red-700" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-red-700" />
        )}
      </button>

      <div className="flex flex-col h-full">
      
        <div className="flex-1 p-4">
       
          <div className="mb-6 pb-4 border-b border-red-500">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <Logo1 size="medium" />
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">OSA Partnership</h2>
                  <p className="text-xs text-red-100"><strong>Monitoring System</strong></p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Logo1 size="medium" />
              </div>
            )}
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all ${
                      isActive ? 'bg-red-800 text-white font-medium' : 'text-white hover:bg-red-800'
                    }`
                  }
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

      
        <div className="border-t border-red-500">
          {!isCollapsed ? (
            <div className="p-4">
              <div className="mb-3 pb-3 border-b border-red-500">
                <div className="flex items-start space-x-2 mb-2">
                  <User className="w-4 h-4 text-white mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
                    <p className="text-xs text-red-100 truncate">{user?.email}</p>
                  </div>
                </div>
                {getRoleBadge()}
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          ) : (
            <div className="p-4 flex flex-col items-center space-y-3">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-white hover:bg-red-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
