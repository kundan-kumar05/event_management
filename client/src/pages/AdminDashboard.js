import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#c4c4c4',
      fontFamily: 'Tahoma, Arial, sans-serif',
      padding: '40px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
      }}>
        <div style={{
          backgroundColor: '#9ebce9',
          border: '1px solid #4383e2',
          padding: '12px',
          textAlign: 'center',
          fontSize: '18px',
          color: '#000'
        }}>
          Admin Dashboard - Welcome back, {user.name}!
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            { icon: '👥', label: 'Manage Users', desc: 'View, edit, delete users', link: '/admin' },
            { icon: '📦', label: 'Products', desc: 'Approve pending products', link: '/admin' },
            { icon: '📋', label: 'Orders', desc: 'Track & update order status', link: '/admin' },
            { icon: '🎫', label: 'Memberships', desc: 'Manage user memberships', link: '/admin' },
          ].map((item) => (
            <Link to={item.link} key={item.label} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'linear-gradient(to bottom, #a3a3a3, #808080)',
                border: '1px solid #000',
                borderRadius: '10px',
                padding: '20px',
                color: '#000',
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{item.icon}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{item.label}</div>
                <div style={{ fontSize: '14px' }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{
          backgroundColor: '#9ebce9',
          border: '1px solid #4383e2',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          color: '#000'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Quick Actions</h3>
            <p style={{ margin: 0 }}>Manage platform settings</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/admin" style={{
              background: 'linear-gradient(to bottom, #a3a3a3, #808080)', border: '1px solid #000', borderRadius: '10px', padding: '10px 20px', color: '#000', textDecoration: 'none', fontWeight: 'bold'
            }}>Open Admin Panel</Link>
            <Link to="/products" style={{
              background: 'linear-gradient(to bottom, #a3a3a3, #808080)', border: '1px solid #000', borderRadius: '10px', padding: '10px 20px', color: '#000', textDecoration: 'none', fontWeight: 'bold'
            }}>View Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
