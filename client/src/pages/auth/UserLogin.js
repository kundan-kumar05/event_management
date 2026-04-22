import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const UserLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.email || !form.password) return 'All fields are required';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      if (res.data.user.role !== 'user') {
        throw new Error('Unauthorized: User access required.');
      }
      login(res.data.user, res.data.token);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

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
          User Login
        </div>

        {error && <div style={{ color: '#d8000c', backgroundColor: '#ffd2d2', padding: '10px', textAlign: 'center', border: '1px solid #d8000c' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* User Id Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{
              backgroundColor: '#4b74c8',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '6px',
              border: '1px solid #274278',
              width: '150px',
              boxSizing: 'border-box'
            }}>
              Email Address
            </div>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange}
              style={{
                flex: 1,
                backgroundColor: '#9ebce9',
                border: '1px solid #4383e2',
                padding: '12px',
                fontSize: '16px',
                textAlign: 'center',
                outline: 'none',
                color: '#000'
              }} 
            />
          </div>

          {/* Password Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{
              backgroundColor: '#4b74c8',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '6px',
              border: '1px solid #274278',
              width: '150px',
              boxSizing: 'border-box'
            }}>
              Password
            </div>
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange}
              style={{
                flex: 1,
                backgroundColor: '#9ebce9',
                border: '1px solid #4383e2',
                padding: '12px',
                fontSize: '16px',
                textAlign: 'center',
                outline: 'none',
                color: '#000'
              }} 
            />
          </div>

          {/* Buttons Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(to bottom, #a3a3a3, #808080)',
                border: '1px solid #000',
                borderRadius: '10px',
                padding: '10px 40px',
                color: '#000',
                fontSize: '16px',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                background: 'linear-gradient(to bottom, #a3a3a3, #808080)',
                border: '1px solid #000',
                borderRadius: '10px',
                padding: '10px 40px',
                color: '#000',
                fontSize: '16px',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              {loading ? '...' : 'Login'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link to="/user/signup" style={{ color: '#000' }}>Don't have an account? Sign up here</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
