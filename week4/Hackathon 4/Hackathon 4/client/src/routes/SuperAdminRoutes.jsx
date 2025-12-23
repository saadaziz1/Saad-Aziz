import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SuperAdminDashboard from '../pages/SuperAdminDashboard';
import SuperAdminUsers from '../pages/SuperAdminUsers';
import SuperAdminAdmins from '../pages/SuperAdminAdmins';
import SuperAdminPlans from '../pages/SuperAdminPlans';
import SuperAdminVideos from '../pages/SuperAdminVideos';
import ManageTMDBMovies from '../components/Admin/ManageTMDBMovies';
import ManageAddedMovies from '../components/Admin/ManageAddedMovies';

const SuperAdminProtectedRoute = ({ children }) => {
  const { isSuperAdmin, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  return isSuperAdmin ? children : <Navigate to="/" />;
};

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <SuperAdminProtectedRoute>
            <SuperAdminDashboard />
          </SuperAdminProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <SuperAdminProtectedRoute>
            <SuperAdminUsers />
          </SuperAdminProtectedRoute>
        } 
      />
      <Route 
        path="/admins" 
        element={
          <SuperAdminProtectedRoute>
            <SuperAdminAdmins />
          </SuperAdminProtectedRoute>
        } 
      />
      <Route 
        path="/videos" 
        element={
          <SuperAdminProtectedRoute>
            <SuperAdminVideos />
          </SuperAdminProtectedRoute>
        } 
      />
      <Route 
        path="/plans" 
        element={
          <SuperAdminProtectedRoute>
            <SuperAdminPlans />
          </SuperAdminProtectedRoute>
        } 
      />
      <Route 
        path="/tmdb-movies" 
        element={
          <SuperAdminProtectedRoute>
            <ManageTMDBMovies />
          </SuperAdminProtectedRoute>
        } 
      />
      <Route 
        path="/added-movies" 
        element={
          <SuperAdminProtectedRoute>
            <ManageAddedMovies />
          </SuperAdminProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default SuperAdminRoutes;