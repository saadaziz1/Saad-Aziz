import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Browse from '../pages/Browse';
import MoviesShows from '../pages/MoviesShows';
import VideoPlayer from '../pages/VideoPlayer';
import Subscription from '../pages/Subscription';
import Profile from '../pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};

const UserRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  const getRedirectPath = () => {
    if (user?.role === 'superadmin') return '/superadmin';
    if (user?.role === 'admin') return '/admin';
    return '/browse';
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to={getRedirectPath()} /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to={getRedirectPath()} /> : <Signup />} 
        />
        <Route 
          path="/browse" 
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movies-shows" 
          element={
            <ProtectedRoute>
              <MoviesShows />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/watch/:id" 
          element={
            <ProtectedRoute>
              <VideoPlayer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/watch/tmdb/:type/:id" 
          element={
            <ProtectedRoute>
              <VideoPlayer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subscription" 
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  );
};

export default UserRoutes;