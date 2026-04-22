import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showVendorMenu, setShowVendorMenu] = useState(false);

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  const btnStyle = {
    backgroundColor: '#4b74c8',
    color: 'white',
    border: '1px solid #274278',
    borderRadius: '8px',
    padding: '15px 30px',
    fontSize: '16px',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '160px',
    boxSizing: 'border-box',
    boxShadow: '1px 1px 3px rgba(0,0,0,0.3)'
  };

  const dropdownItemStyle = {
    display: 'block',
    padding: '12px 10px',
    color: 'white',
    textDecoration: 'none',
    borderBottom: '1px solid #274278',
    textAlign: 'center',
    fontSize: '14px',
    backgroundColor: '#4b74c8'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#c4c4c4',
      fontFamily: 'Tahoma, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '60px',
      gap: '80px'
    }}>
      {/* Top Welcome Banner */}
      <div style={{
        backgroundColor: '#4b74c8',
        width: '90%',
        maxWidth: '1200px',
        padding: '20px',
        textAlign: 'center',
        fontSize: '18px',
        color: 'white',
        border: '1px solid #274278',
        textTransform: 'uppercase'
      }}>
        WELCOME {user?.name || 'USER'}
      </div>

      {/* Buttons Row Container */}
      <div style={{
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '90%',
        maxWidth: '1200px'
      }}>
        {/* Vendor Dropdown */}
        <div 
          style={{ position: 'relative' }} 
          onMouseEnter={() => setShowVendorMenu(true)} 
          onMouseLeave={() => setShowVendorMenu(false)}
        >
          <div style={btnStyle}>Vendor</div>
          {showVendorMenu && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              backgroundColor: '#4b74c8', 
              border: '1px solid #274278', 
              borderRadius: '4px', 
              width: '100%', 
              zIndex: 10,
              boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}>
              <Link to="/products?category=catering" style={dropdownItemStyle} onMouseOver={(e) => e.target.style.backgroundColor = '#274278'} onMouseOut={(e) => e.target.style.backgroundColor = '#4b74c8'}>catering</Link>
              <Link to="/products?category=florist" style={dropdownItemStyle} onMouseOver={(e) => e.target.style.backgroundColor = '#274278'} onMouseOut={(e) => e.target.style.backgroundColor = '#4b74c8'}>florist</Link>
              <Link to="/products?category=decoration" style={{...dropdownItemStyle, borderBottom: 'none'}} onMouseOver={(e) => e.target.style.backgroundColor = '#274278'} onMouseOut={(e) => e.target.style.backgroundColor = '#4b74c8'}>decoration</Link>
            </div>
          )}
        </div>

        {/* Other Buttons */}
        <Link to="/cart" style={btnStyle}>Cart</Link>
        <Link to="/products" style={btnStyle}>Guest List</Link>
        <Link to="/orders" style={btnStyle}>Order Status</Link>
      </div>

      {/* Logout Button */}
      <div>
        <button onClick={handleLogout} style={btnStyle}>LogOut</button>
      </div>
    </div>
  );
};

export default UserDashboard;
