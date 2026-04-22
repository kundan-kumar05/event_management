import api from './api';

export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart', data);
export const updateCartItem = (productId, quantity) => api.put(`/cart/${productId}`, { quantity });
export const removeFromCart = (productId) => api.delete(`/cart/${productId}`);
export const clearCart = () => api.delete('/cart/clear');

export const placeOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/my');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getAllOrders = () => api.get('/orders');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
