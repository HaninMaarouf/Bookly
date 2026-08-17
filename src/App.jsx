import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserApp from './pages/UserApp';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminRoute from './pages/AdminRoute';
import './css/index.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/dashboard" element={<UserApp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <AdminRoute>
            <AdminUserDetail />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}