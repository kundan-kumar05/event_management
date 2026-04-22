import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, placeOrder } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ shippingAddress: '', paymentMethod: 'COD', agreeTerms: false });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCart().then(res => setCart(res.data.cart)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const total = cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shippingAddress.trim()) return setError('Shipping address is required');
    if (!form.agreeTerms) return setError('Please agree to the terms to proceed');
    setError('');
    setPlacing(true);
    try {
      const res = await placeOrder({ shippingAddress: form.shippingAddress, paymentMethod: form.paymentMethod });
      setSuccess(res.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (success) {
    return (
      <div className="page">
        <div className="container">
          <div className="card animate-in" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Order Placed!</h2>
            <p className="text-muted">Your order #{success._id?.slice(-8).toUpperCase()} has been placed successfully.</p>
            <div style={{ margin: '24px 0', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '20px', fontWeight: '800', color: 'var(--teal-light)' }}>
              Total: ₹{success.totalAmount?.toLocaleString()}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate('/orders')}>Track Orders</button>
              <button className="btn btn-secondary" onClick={() => navigate('/products')}>Continue Shopping</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
          <p>Complete your order details below</p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <div className="card mb-3">
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Shipping Details</h3>
              <div className="form-group">
                <label className="form-label">Shipping Address</label>
                <textarea
                  id="checkout-address"
                  name="shippingAddress"
                  className="form-control"
                  placeholder="Enter your full shipping address…"
                  rows={3}
                  value={form.shippingAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="card mb-3">
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[{ value: 'COD', label: '💵 Cash on Delivery' }, { value: 'Online', label: '💳 Online Payment (Coming Soon)' }].map((pm) => (
                  <label key={pm.value} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: `2px solid ${form.paymentMethod === pm.value ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', transition: 'var(--transition)' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.value}
                      checked={form.paymentMethod === pm.value}
                      onChange={handleChange}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <span style={{ fontWeight: '600' }}>{pm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input
                id="checkout-terms"
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
                style={{ marginTop: '2px', accentColor: 'var(--accent)', width: '16px', height: '16px' }}
              />
              <label htmlFor="checkout-terms" style={{ fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                I confirm that my order details are correct and agree to the <span style={{ color: 'var(--accent-light)' }}>Terms of Service</span>
              </label>
            </div>

            <button id="checkout-submit" type="submit" className="btn btn-primary btn-block btn-lg" disabled={placing}>
              {placing ? 'Placing Order…' : `Place Order — ₹${total.toLocaleString()}`}
            </button>
          </form>

          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Order Summary</h3>
            {cart?.items?.map((item) => (
              <div key={item.productId} className="flex-between mb-2">
                <span className="text-muted text-sm">{item.name} × {item.quantity}</span>
                <span className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
              <div className="flex-between">
                <span style={{ fontSize: '18px', fontWeight: '800' }}>Total</span>
                <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--teal-light)' }}>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
