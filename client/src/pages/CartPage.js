import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleQtyChange = async (productId, qty) => {
    if (qty < 1) return handleRemove(productId);
    try {
      const res = await updateCartItem(productId, qty);
      setCart(res.data.cart);
    } catch (err) { console.error(err); }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await removeFromCart(productId);
      setCart(res.data.cart);
    } catch (err) { console.error(err); }
  };

  const total = cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>🛒 My Cart</h1>
          <p>{cart?.items?.length || 0} items in your cart</p>
        </div>

        {!cart?.items?.length ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started</p>
            <Link to="/products" className="btn btn-primary mt-3">Browse Products</Link>
          </div>
        ) : (
          <div className="grid-2" style={{ alignItems: 'start' }}>
            <div>
              {cart.items.map((item) => (
                <div key={item.productId} className="cart-item">
                  <div className="cart-item-icon">📦</div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">₹{item.price?.toLocaleString()} each</div>
                  </div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => handleQtyChange(item.productId, item.quantity - 1)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleQtyChange(item.productId, item.quantity + 1)}>+</button>
                  </div>
                  <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: '700', color: 'var(--teal-light)' }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button className="btn btn-sm" style={{ color: 'var(--red)', background: 'none', border: 'none' }}
                    onClick={() => handleRemove(item.productId)}>✕</button>
                </div>
              ))}
            </div>

            <div className="card" style={{ position: 'sticky', top: '90px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex-between text-sm">
                    <span className="text-muted">{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
                  <div className="flex-between" style={{ fontSize: '20px', fontWeight: '800' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--teal-light)' }}>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <Link to="/checkout" className="btn btn-primary btn-block btn-lg mt-3">Proceed to Checkout →</Link>
              <Link to="/products" className="btn btn-secondary btn-block mt-2">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
