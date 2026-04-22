import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { loading } = useAuth();

  if (loading) return null;
  
  // Allow all users to view the portal selector

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#c4c4c4',
      fontFamily: 'Tahoma, Arial, sans-serif'
    }}>
      <div style={{
        width: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}>
        {/* Top Banner */}
        <div style={{
          backgroundColor: '#9ebce9',
          border: '1px solid #4383e2',
          padding: '12px',
          textAlign: 'center',
          fontSize: '18px',
          color: '#000'
        }}>
          Event Management System - Portal Selector
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link to="/user/login" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(to bottom, #a3a3a3, #808080)', border: '1px solid #000', borderRadius: '10px', padding: '20px', color: '#000', textAlign: 'center', cursor: 'pointer'
            }}>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>User Portal</h2>
              <p style={{ margin: 0 }}>Browse products, manage your cart, and track your orders.</p>
            </div>
          </Link>
          <Link to="/vendor/login" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(to bottom, #a3a3a3, #808080)', border: '1px solid #000', borderRadius: '10px', padding: '20px', color: '#000', textAlign: 'center', cursor: 'pointer'
            }}>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Vendor Portal</h2>
              <p style={{ margin: 0 }}>List your products, manage inventory, and track approvals.</p>
            </div>
          </Link>
          <Link to="/admin/login" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(to bottom, #a3a3a3, #808080)', border: '1px solid #000', borderRadius: '10px', padding: '20px', color: '#000', textAlign: 'center', cursor: 'pointer'
            }}>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Admin Portal</h2>
              <p style={{ margin: 0 }}>Full platform management, approvals, and oversight.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
