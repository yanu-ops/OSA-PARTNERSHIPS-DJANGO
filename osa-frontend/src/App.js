  import React from 'react';
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { Toaster } from 'react-hot-toast';
  import { AuthProvider } from './context/AuthContext';
  import PrivateRoute from './routes/PrivateRoute';
  import RoleRoute from './routes/RoleRoute';


  import Login from './pages/auth/Login';
  import Register from './pages/auth/Register';


  import AdminDashboard from './pages/admin/AdminDashboard';
  import AdminPanel from './pages/admin/AdminPanel';

  import DepartmentDashboard from './pages/department/DepartmentDashboard';


  import ViewerDashboard from './pages/viewer/ViewerDashboard';

  function App() {
    return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
            
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

           
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

          
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>

         
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