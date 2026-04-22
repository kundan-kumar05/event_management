import api from './api';

export const addMembership = (data) => api.post('/membership/add', data);
export const updateMembership = (data) => api.put('/membership/update', data);
export const getMyMembership = () => api.get('/membership/my');
export const getAllMemberships = () => api.get('/membership');
