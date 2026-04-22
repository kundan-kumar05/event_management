import React from 'react';

const LoadingSpinner = ({ message = 'Loading…' }) => (
  <div className="loading-container" style={{ flexDirection: 'column', gap: '16px' }}>
    <div className="spinner"></div>
    <p className="text-muted">{message}</p>
  </div>
);

export default LoadingSpinner;
