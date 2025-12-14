import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

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

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
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
              <div>Profile Page</div>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            // <ProtectedRoute requiredRole="admin">
            // </ProtectedRoute>
            <Dashboard />

          } />
          <Route path="/admin/products" element={
            // <ProtectedRoute requiredRole="admin">
              
            // </ProtectedRoute>
            <Products />
          } />
          <Route path="/admin/orders" element={
            // <ProtectedRoute requiredRole="admin">
              
            // </ProtectedRoute>
            <Orders />
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
