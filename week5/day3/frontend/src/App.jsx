import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import { Toaster } from './components/ui/toaster';
import { useNotifications } from './hooks/useNotifications';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Footer from './components/layout/Footer';
import ProductsPage from './pages/products/ProductsPage';
import { ProductPage } from './pages/products/ProductPage';
import CheckoutPage from './pages/cart/CheckoutPage';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import ProductForm from './pages/admin/ProductForm';
import Profile from './pages/Profile';

const App = () => {
  // Initialize real-time notifications
  useNotifications();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-container ">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          
          {/* Protected Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout pageTitle="Dashboard"><Dashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout pageTitle="Products"><Products /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products/new" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout pageTitle="Add Product"><ProductForm /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products/edit/:id" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout pageTitle="Edit Product"><ProductForm /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout pageTitle="Orders"><Orders /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="superadmin">
              <AdminLayout pageTitle="Users"><Users /></AdminLayout>
            </ProtectedRoute>
          } />
          
        </Routes>
        
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default App;
