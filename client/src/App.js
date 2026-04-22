import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import AdminLogin from './pages/auth/AdminLogin';
import VendorLogin from './pages/auth/VendorLogin';
import UserLogin from './pages/auth/UserLogin';
import VendorSignup from './pages/auth/VendorSignup';
import UserSignup from './pages/auth/UserSignup';

import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import UserDashboard from './pages/UserDashboard';
import ProductListingPage from './pages/ProductListingPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MembershipPage from './pages/MembershipPage';
import AdminPanel from './pages/AdminPanel';
import VendorPanel from './pages/VendorPanel';
import OrderTrackingPage from './pages/OrderTrackingPage';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'vendor') return <Navigate to="/vendor/dashboard" replace />;
  return <Navigate to="/user/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/vendor/signup" element={<VendorSignup />} />
          <Route path="/user/signup" element={<UserSignup />} />

          {/* Fallback to legacy dashboard route redirects to actual role dashboard */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* User only */}
          <Route path="/user/dashboard" element={
            <ProtectedRoute roles={['user']}><UserDashboard /></ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute roles={['user']}><CartPage /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute roles={['user']}><CheckoutPage /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute roles={['user']}><OrderTrackingPage /></ProtectedRoute>
          } />
          <Route path="/membership" element={
            <ProtectedRoute roles={['user']}><MembershipPage /></ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>
          } />

          {/* Vendor only */}
          <Route path="/vendor/dashboard" element={
            <ProtectedRoute roles={['vendor']}><VendorDashboard /></ProtectedRoute>
          } />
          <Route path="/vendor" element={
            <ProtectedRoute roles={['vendor']}><VendorPanel /></ProtectedRoute>
          } />

          {/* All authenticated users */}
          <Route path="/products" element={
            <ProtectedRoute><ProductListingPage /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
