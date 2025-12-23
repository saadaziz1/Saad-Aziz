import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../pages/AdminDashboard';
import ManageUsers from '../pages/ManageUsers';
import ManageVideos from '../pages/ManageVideos';
import ManageTMDBMovies from '../components/Admin/ManageTMDBMovies';
import ManageAddedMovies from '../components/Admin/ManageAddedMovies';

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  return user?.role === 'admin' || user?.role === 'superadmin' ? children : <Navigate to="/" />;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <AdminProtectedRoute>
            <ManageUsers />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/videos" 
        element={
          <AdminProtectedRoute>
            <ManageVideos />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/tmdb-movies" 
        element={
          <AdminProtectedRoute>
            <ManageTMDBMovies />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/added-movies" 
        element={
          <AdminProtectedRoute>
            <ManageAddedMovies />
          </AdminProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;