import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const OrderTrackingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMyOrders()
      .then(res => { setOrders(res.data.orders); if (res.data.orders.length > 0) setSelected(res.data.orders[0]); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const stepIndex = (status) => STATUS_STEPS.indexOf(status);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>📦 My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="grid-2" style={{ alignItems: 'start' }}>
            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="card"
                  style={{ cursor: 'pointer', borderColor: selected?._id === order._id ? 'var(--accent)' : 'var(--border)' }}
                  onClick={() => setSelected(order)}
                >
                  <div className="flex-between mb-2">
                    <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-muted)' }}>
                      #{order._id?.slice(-8).toUpperCase()}
                    </span>
                    <span className={`badge badge-${order.status}`}>{order.status}</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-muted text-sm">{order.products?.length} item(s) · {formatDate(order.createdAt)}</span>
                    <span style={{ fontWeight: '800', color: 'var(--teal-light)' }}>₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Detail */}
            {selected && (
              <div className="card animate-in" style={{ position: 'sticky', top: '90px' }}>
                <div className="flex-between mb-3">
                  <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Order #{selected._id?.slice(-8).toUpperCase()}</h3>
                  <span className={`badge badge-${selected.status}`}>{selected.status}</span>
                </div>

                {/* Progress Steps */}
                {selected.status !== 'cancelled' && (
                  <div className="order-steps mb-3">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className={`step ${i <= stepIndex(selected.status) ? (i < stepIndex(selected.status) ? 'done' : 'active') : ''}`}>
                        <div className="step-dot">
                          {i < stepIndex(selected.status) ? '✓' : i + 1}
                        </div>
                        <div className="step-label" style={{ textTransform: 'capitalize' }}>{step}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '16px' }}>
                  {selected.products?.map((p, i) => (
                    <div key={i} className="flex-between mb-2">
                      <span className="text-sm">{p.name} × {p.quantity}</span>
                      <span className="font-bold text-sm">₹{(p.price * p.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <div className="flex-between">
                    <span style={{ fontWeight: '700' }}>Total</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--teal-light)' }}>₹{selected.totalAmount?.toLocaleString()}</span>
                  </div>
                  {selected.shippingAddress && (
                    <div className="text-muted text-sm mt-2">📍 {selected.shippingAddress}</div>
                  )}
                  <div className="text-muted text-sm mt-1">🕐 {formatDate(selected.createdAt)}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
