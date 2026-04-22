import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VendorDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  const btnStyle = {
    backgroundColor: '#c4c4c4',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    padding: '20px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    minWidth: '160px',
    boxShadow: '1px 1px 3px rgba(0,0,0,0.3)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#4b74c8',
      fontFamily: 'Tahoma, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '120px',
      gap: '80px'
    }}>
      {/* Top Welcome Banner */}
      <div style={{
        backgroundColor: '#c4c4c4',
        width: '85%',
        maxWidth: '1000px',
        padding: '40px',
        textAlign: 'center',
        fontSize: '24px',
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '1px 1px 3px rgba(0,0,0,0.3)'
      }}>
        <div style={{ marginBottom: '5px' }}>Welcome</div>
        <div>Vendor</div>
      </div>

      {/* Buttons Container */}
      <div style={{
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '90%',
        maxWidth: '1200px'
      }}>
        <Link to="/vendor" style={btnStyle}>Your Item</Link>
        <Link to="/vendor" style={btnStyle}>Add New Item</Link>
        <Link to="/vendor" style={btnStyle}>Transection</Link>
        <button onClick={handleLogout} style={btnStyle}>LogOut</button>
      </div>
    </div>
  );
};

export default VendorDashboard;
