import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const UserSignup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', agreeTerms: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return 'Valid email is required';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    if (!form.agreeTerms) return 'You must agree to the terms';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    setError('');
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password, role: 'user' });
      login(res.data.user, res.data.token);
      navigate('/user/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && data.errors.length > 0) {
        setError(data.errors[0].msg);
      } else {
        setError(data?.message || err.message || 'Registration failed.');
      }
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
        gap: '20px'
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
          User Signup
        </div>

        {error && <div style={{ color: '#d8000c', backgroundColor: '#ffd2d2', padding: '10px', textAlign: 'center', border: '1px solid #d8000c' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Full Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{
              backgroundColor: '#4b74c8',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '6px',
              border: '1px solid #274278',
              width: '180px',
              boxSizing: 'border-box'
            }}>
              Full Name
            </div>
            <input 
              type="text" 
              name="name" 
              value={form.name} 
              onChange={handleChange}
              style={{ flex: 1, backgroundColor: '#9ebce9', border: '1px solid #4383e2', padding: '12px', fontSize: '16px', textAlign: 'center', outline: 'none', color: '#000' }} 
            />
          </div>

          {/* Email Address */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{
              backgroundColor: '#4b74c8',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '6px',
              border: '1px solid #274278',
              width: '180px',
              boxSizing: 'border-box'
            }}>
              Email Address
            </div>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange}
              style={{ flex: 1, backgroundColor: '#9ebce9', border: '1px solid #4383e2', padding: '12px', fontSize: '16px', textAlign: 'center', outline: 'none', color: '#000' }} 
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{
              backgroundColor: '#4b74c8',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '6px',
              border: '1px solid #274278',
              width: '180px',
              boxSizing: 'border-box'
            }}>
              Password
            </div>
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange}
              style={{ flex: 1, backgroundColor: '#9ebce9', border: '1px solid #4383e2', padding: '12px', fontSize: '16px', textAlign: 'center', outline: 'none', color: '#000' }} 
            />
          </div>

          {/* Confirm Password */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{
              backgroundColor: '#4b74c8',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '6px',
              border: '1px solid #274278',
              width: '180px',
              boxSizing: 'border-box'
            }}>
              Confirm Password
            </div>
            <input 
              type="password" 
              name="confirmPassword" 
              value={form.confirmPassword} 
              onChange={handleChange}
              style={{ flex: 1, backgroundColor: '#9ebce9', border: '1px solid #4383e2', padding: '12px', fontSize: '16px', textAlign: 'center', outline: 'none', color: '#000' }} 
            />
          </div>

          {/* Terms */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} style={{ width: '16px', height: '16px' }} />
            <span style={{ color: '#000', cursor: 'pointer' }} onClick={() => setForm({...form, agreeTerms: !form.agreeTerms})}>
              I agree to the Terms of Service
            </span>
          </div>

          {/* Buttons Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(to bottom, #a3a3a3, #808080)', border: '1px solid #000', borderRadius: '10px', padding: '10px 40px', color: '#000', fontSize: '16px', cursor: 'pointer', minWidth: '150px'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                background: 'linear-gradient(to bottom, #a3a3a3, #808080)', border: '1px solid #000', borderRadius: '10px', padding: '10px 40px', color: '#000', fontSize: '16px', cursor: 'pointer', minWidth: '150px'
              }}
            >
              {loading ? '...' : 'Register'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Link to="/user/login" style={{ color: '#000' }}>Already registered? Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
