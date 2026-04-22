import React, { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/productService';
import { addToCart } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';

  const fetchProducts = useCallback(async () => {
    try {
      const params = { limit: 50 };
      if (category) params.category = category;
      const res = await getProducts(params);
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  }, [category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart');
    }
  };

  const whiteBtnStyle = {
    backgroundColor: 'white',
    color: 'black',
    border: '2px solid #8BC34A',
    borderRadius: '8px',
    padding: '15px 40px',
    fontSize: '18px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block'
  };

  const blueBtnStyle = {
    backgroundColor: '#4b74c8',
    color: 'white',
    border: '1px solid #274278',
    borderRadius: '8px',
    padding: '15px 40px',
    fontSize: '20px',
    textAlign: 'center',
    minWidth: '200px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#c4c4c4',
      fontFamily: 'Tahoma, Arial, sans-serif',
      padding: '40px 60px'
    }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <Link to="/user/dashboard" style={whiteBtnStyle}>Home</Link>
        <div style={{...blueBtnStyle, marginTop: '30px'}}>{category || 'Vendor Name'}</div>
        <button onClick={handleLogout} style={whiteBtnStyle}>LogOut</button>
      </div>

      {/* Middle Bar */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ ...blueBtnStyle, display: 'inline-block', width: '250px', textAlign: 'left' }}>Products</div>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {products.length > 0 ? products.map(product => (
          <div key={product._id} style={{
            backgroundColor: '#4b74c8',
            border: '1px solid #274278',
            borderRadius: '25px',
            width: '240px',
            height: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '30px 20px',
            boxSizing: 'border-box',
            boxShadow: '1px 1px 4px rgba(0,0,0,0.3)'
          }}>
            <div style={{ color: 'white', fontSize: '20px', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.name}
            </div>
            <div style={{ color: 'white', fontSize: '18px' }}>
              ₹{product.price}
            </div>
            <button 
              onClick={() => handleAddToCart(product._id)}
              style={{
                backgroundColor: 'white',
                color: 'black',
                border: '2px solid #8BC34A',
                borderRadius: '4px',
                padding: '12px 0',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '80%',
                fontSize: '16px'
              }}>
              Add to Cart
            </button>
          </div>
        )) : (
          <div style={{ color: '#000', fontSize: '18px' }}>No products found.</div>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
