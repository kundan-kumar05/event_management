import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isVendor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const getDashboardPath = () => {
    if (isAdmin()) return '/admin/dashboard';
    if (isVendor()) return '/vendor/dashboard';
    return '/user/dashboard';
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={getDashboardPath()} className="navbar-brand">⚡ EventHub</Link>

        <div className="navbar-links">
          <Link to={getDashboardPath()} className={`navbar-link ${isActive(getDashboardPath())}`}>Dashboard</Link>
          <Link to="/products" className={`navbar-link ${isActive('/products')}`}>Products</Link>
          {user && !isAdmin() && !isVendor() && (
            <>
              <Link to="/cart" className={`navbar-link ${isActive('/cart')}`}>🛒 Cart</Link>
              <Link to="/orders" className={`navbar-link ${isActive('/orders')}`}>My Orders</Link>
              <Link to="/membership" className={`navbar-link ${isActive('/membership')}`}>Membership</Link>
            </>
          )}
          {isAdmin() && (
            <Link to="/admin" className={`navbar-link ${isActive('/admin')}`}>Admin Panel</Link>
          )}
          {isVendor() && (
            <Link to="/vendor" className={`navbar-link ${isActive('/vendor')}`}>Vendor Panel</Link>
          )}
        </div>

        <div className="navbar-user">
          <div className="user-pill">
            <span className={`role-dot ${user.role}`}></span>
            <span>{user.name}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'capitalize' }}>({user.role})</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
