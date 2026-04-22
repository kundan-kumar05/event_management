import React, { useState, useEffect, useCallback } from 'react';
import { getMyProducts, addProduct, updateProduct } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EMPTY_FORM = { name: '', price: '', category: 'Electronics', description: 'No description', stock: 10 };

const VendorPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadProducts = useCallback(async () => {
    try {
      const res = await getMyProducts();
      setProducts(res.data.products);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({ name: product.name, price: product.price, category: product.category, description: product.description, stock: product.stock });
  };

  const handleReset = () => { setForm(EMPTY_FORM); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return alert('Name and Price are required');
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) || 10, description: form.description || 'No description' };
      if (editingId) {
        const res = await updateProduct(editingId, payload);
        setProducts(p => p.map(x => x._id === editingId ? res.data.product : x));
      } else {
        const res = await addProduct(payload);
        setProducts(p => [res.data.product, ...p]);
      }
      handleReset();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  const topBtnStyle = {
    backgroundColor: 'white',
    color: 'black',
    border: '2px solid #8BC34A',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  };

  const inputStyle = {
    backgroundColor: '#c4c4c4',
    border: '1px solid #999',
    borderRadius: '6px',
    padding: '15px',
    width: '100%',
    textAlign: 'center',
    outline: 'none',
    fontSize: '16px',
    boxSizing: 'border-box',
    color: '#000'
  };

  const headerStyle = {
    backgroundColor: '#4b74c8',
    color: 'white',
    border: '1px solid #274278',
    padding: '15px 10px',
    textAlign: 'center',
    fontSize: '14px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#c4c4c4',
      fontFamily: 'Tahoma, Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Top Navbar */}
      <div style={{
        backgroundColor: '#4b74c8',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #274278',
        marginBottom: '40px'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>
          Welcome '{user?.name || 'Vendor Name'}'
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={topBtnStyle}>Product Status</button>
          <button style={topBtnStyle}>Request Item</button>
          <button style={topBtnStyle}>View Product</button>
          <button style={topBtnStyle} onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        {/* Left Section: Add Product */}
        <div style={{
          backgroundColor: '#4b74c8',
          padding: '40px 30px',
          border: '1px solid #274278',
          width: '350px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center'
        }}>
          <input 
            type="text" 
            name="name" 
            placeholder="Product Name" 
            value={form.name} 
            onChange={handleChange}
            style={inputStyle} 
          />
          <input 
            type="number" 
            name="price" 
            placeholder="Product Price" 
            value={form.price} 
            onChange={handleChange}
            style={inputStyle} 
          />
          <div style={{...inputStyle, padding: '15px', color: '#555', cursor: 'pointer', backgroundColor: '#c4c4c4'}}>
            Product Image
          </div>
          
          <button onClick={handleSubmit} style={{
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 24px',
            marginTop: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {editingId ? 'Update The Product' : 'Add The Peoduct'}
          </button>
        </div>

        {/* Right Section: Product Table */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ width: '120px', ...headerStyle }}>Product Image</div>
            <div style={{ width: '150px', ...headerStyle }}>Product Name</div>
            <div style={{ width: '120px', ...headerStyle }}>Product Price</div>
            <div style={{ width: '120px', ...headerStyle }}>Action</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {products.map(p => (
              <div key={p._id} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {/* Image */}
                <div style={{
                  backgroundColor: '#4b74c8',
                  color: 'white',
                  width: '120px',
                  height: '120px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #274278',
                  boxSizing: 'border-box'
                }}>
                  Image
                </div>

                {/* Name */}
                <div style={{
                  backgroundColor: '#4b74c8',
                  color: 'white',
                  width: '150px',
                  padding: '20px 10px',
                  textAlign: 'center',
                  border: '1px solid #274278',
                  boxSizing: 'border-box'
                }}>
                  {p.name}
                </div>

                {/* Price */}
                <div style={{
                  backgroundColor: '#4b74c8',
                  color: 'white',
                  width: '120px',
                  padding: '20px 10px',
                  textAlign: 'center',
                  border: '1px solid #274278',
                  boxSizing: 'border-box'
                }}>
                  {p.price} Rs/-
                </div>

                {/* Action */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '120px' }}>
                  <button onClick={() => {
                     // Add delete functionality if needed, for now just a stub to match UI
                     alert('Delete clicked');
                  }} style={{
                    backgroundColor: '#4b74c8',
                    color: 'white',
                    border: '1px solid #274278',
                    borderBottom: '1px solid #ff7b00',
                    padding: '15px 0',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}>Delete</button>
                  <button onClick={() => handleEdit(p)} style={{
                    backgroundColor: '#4b74c8',
                    color: 'white',
                    border: '1px solid #274278',
                    padding: '15px 0',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}>Update</button>
                </div>
              </div>
            ))}
            
            {/* If no products, show an empty placeholder matching the image exactly */}
            {products.length === 0 && (
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#4b74c8', color: 'white', width: '120px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #274278', boxSizing: 'border-box' }}>Image</div>
                <div style={{ backgroundColor: '#4b74c8', color: 'white', width: '150px', padding: '20px 10px', textAlign: 'center', border: '1px solid #274278', boxSizing: 'border-box' }}>Image Name</div>
                <div style={{ backgroundColor: '#4b74c8', color: 'white', width: '120px', padding: '20px 10px', textAlign: 'center', border: '1px solid #274278', boxSizing: 'border-box' }}>Rs/-</div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '120px' }}>
                  <button style={{ backgroundColor: '#4b74c8', color: 'white', border: '1px solid #274278', borderBottom: '1px solid #ff7b00', padding: '15px 0', cursor: 'pointer', boxSizing: 'border-box' }}>Delete</button>
                  <button style={{ backgroundColor: '#4b74c8', color: 'white', border: '1px solid #274278', padding: '15px 0', cursor: 'pointer', boxSizing: 'border-box' }}>Update</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPanel;
