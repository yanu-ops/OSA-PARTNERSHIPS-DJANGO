import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

// Public Pages
import PublicPartnerships from './pages/public/PublicPartnerships';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPanel from './pages/admin/AdminPanel';

// Department Pages
import DepartmentDashboard from './pages/department/DepartmentDashboard';

// Viewer Pages
import ViewerDashboard from './pages/viewer/ViewerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Route - No Login Required */}
            <Route path="/" element={<PublicPartnerships />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/panel"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* Department Routes */}
            <Route
              path="/department/dashboard"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['department']}>
                    <DepartmentDashboard />
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* Viewer Routes */}
            <Route
              path="/viewer/dashboard"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['viewer']}>
                    <ViewerDashboard />
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* 404 - Redirect to public page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#363636',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;