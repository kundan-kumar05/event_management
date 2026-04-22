import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

// Inline service calls via api directly
const fetchUsers = () => api.get('/users');
const fetchStats = () => api.get('/users/stats');
const removeUser = (id) => api.delete(`/users/${id}`);
const fetchAllProducts = () => api.get('/products/admin/all');
const approveProductAPI = (id, status) => api.put(`/products/${id}/approve`, { status });
const removeProduct = (id) => api.delete(`/products/${id}`);
const fetchAllOrders = () => api.get('/orders');
const updateStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
const fetchAllMemberships = () => api.get('/membership');

const TABS = ['Overview', 'Users', 'Products', 'Orders', 'Memberships'];

const AdminPanel = () => {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const loadData = useCallback(async (t) => {
    setLoading(true);
    try {
      if (t === 'Overview') {
        const res = await fetchStats();
        setStats(res.data.stats);
      } else if (t === 'Users') {
        const res = await fetchUsers();
        setUsers(res.data.users);
      } else if (t === 'Products') {
        const res = await fetchAllProducts();
        setProducts(res.data.products);
      } else if (t === 'Orders') {
        const res = await fetchAllOrders();
        setOrders(res.data.orders);
      } else if (t === 'Memberships') {
        const res = await fetchAllMemberships();
        setMemberships(res.data.memberships);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(tab); }, [tab, loadData]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await removeUser(id); setUsers(u => u.filter(x => x._id !== id)); showMsg('User deleted'); }
    catch (err) { showMsg('Failed to delete user', 'error'); }
  };

  const handleApproveProduct = async (id, status) => {
    try { await approveProductAPI(id, status); setProducts(p => p.map(x => x._id === id ? { ...x, status } : x)); showMsg(`Product ${status}`); }
    catch (err) { showMsg('Action failed', 'error'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await removeProduct(id); setProducts(p => p.filter(x => x._id !== id)); showMsg('Product deleted'); }
    catch (err) { showMsg('Failed', 'error'); }
  };

  const handleOrderStatus = async (id, status) => {
    try { await updateStatus(id, status); setOrders(o => o.map(x => x._id === id ? { ...x, status } : x)); showMsg('Status updated'); }
    catch (err) { showMsg('Failed', 'error'); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—';

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>⚙️ Admin Panel</h1>
          <p>Full platform management and oversight</p>
        </div>

        {msg && <div className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success'}`}>{msg.text}</div>}

        <div className="tabs">
          {TABS.map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            {/* OVERVIEW */}
            {tab === 'Overview' && stats && (
              <div className="animate-in">
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Total Users</div></div>
                  <div className="stat-card"><div className="stat-icon">📦</div><div className="stat-value">{stats.totalProducts}</div><div className="stat-label">Approved Products</div></div>
                  <div className="stat-card"><div className="stat-icon">🛒</div><div className="stat-value">{stats.totalOrders}</div><div className="stat-label">Total Orders</div></div>
                  <div className="stat-card"><div className="stat-icon">🎫</div><div className="stat-value">{stats.totalMemberships}</div><div className="stat-label">Active Memberships</div></div>
                  <div className="stat-card" style={{ borderColor: 'var(--border-hover)' }}>
                    <div className="stat-icon">💰</div>
                    <div className="stat-value" style={{ fontSize: '22px' }}>₹{stats.totalRevenue?.toLocaleString()}</div>
                    <div className="stat-label">Total Revenue</div>
                  </div>
                </div>

                {stats.usersByRole && (
                  <div className="card">
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Users by Role</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {stats.usersByRole.map(r => {
                        const pct = Math.round((r.count / stats.totalUsers) * 100);
                        const color = r._id === 'admin' ? 'var(--pink)' : r._id === 'vendor' ? 'var(--teal)' : 'var(--accent-light)';
                        return (
                          <div key={r._id}>
                            <div className="flex-between mb-1">
                              <span style={{ fontWeight: '600', textTransform: 'capitalize', color }}>{r._id}</span>
                              <span className="text-muted text-sm">{r.count} ({pct}%)</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '4px', transition: 'width 0.8s ease' }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* USERS */}
            {tab === 'Users' && (
              <div className="animate-in">
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td style={{ fontWeight: '600' }}>{u.name}</td>
                          <td className="text-muted">{u.email}</td>
                          <td><span className={`badge badge-${u.role === 'admin' ? 'processing' : u.role === 'vendor' ? 'active' : 'pending'}`} style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                          <td className="text-muted text-sm">{formatDate(u.createdAt)}</td>
                          <td>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {tab === 'Products' && (
              <div className="animate-in">
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Vendor</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td style={{ fontWeight: '600' }}>{p.name}</td>
                          <td className="text-muted">{p.category}</td>
                          <td style={{ color: 'var(--teal-light)', fontWeight: '700' }}>₹{p.price?.toLocaleString()}</td>
                          <td className="text-muted text-sm">{p.vendorId?.name || '—'}</td>
                          <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {p.status === 'pending' && <>
                                <button className="btn btn-sm btn-success" onClick={() => handleApproveProduct(p._id, 'approved')}>Approve</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleApproveProduct(p._id, 'rejected')}>Reject</button>
                              </>}
                              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {tab === 'Orders' && (
              <div className="animate-in">
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Update Status</th></tr></thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>#{o._id?.slice(-8).toUpperCase()}</td>
                          <td style={{ fontWeight: '600' }}>{o.userId?.name || '—'}</td>
                          <td className="text-muted">{o.products?.length}</td>
                          <td style={{ color: 'var(--teal-light)', fontWeight: '700' }}>₹{o.totalAmount?.toLocaleString()}</td>
                          <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                          <td>
                            <select className="form-control" style={{ padding: '6px 10px', fontSize: '13px', width: 'auto' }}
                              value={o.status} onChange={(e) => handleOrderStatus(o._id, e.target.value)}>
                              {['pending','processing','shipped','delivered','cancelled'].map(s => (
                                <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MEMBERSHIPS */}
            {tab === 'Memberships' && (
              <div className="animate-in">
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>User</th><th>Plan</th><th>Duration</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
                    <tbody>
                      {memberships.map(m => (
                        <tr key={m._id}>
                          <td style={{ fontWeight: '600' }}>{m.userId?.name || '—'}</td>
                          <td style={{ textTransform: 'capitalize' }}>{m.plan}</td>
                          <td>{m.duration}</td>
                          <td className="text-muted text-sm">{formatDate(m.startDate)}</td>
                          <td className="text-muted text-sm">{formatDate(m.endDate)}</td>
                          <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
