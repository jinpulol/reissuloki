import React from 'react';

const LoadingIndicator: React.FC<{ message?: string }> = ({ message = 'Ladataan...' }) => (
  <div style={{ minHeight: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{message}</div>
);

export default LoadingIndicator;
