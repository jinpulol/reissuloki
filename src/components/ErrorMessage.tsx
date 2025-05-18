import React from 'react';

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <p style={{ color: 'red' }}>{message}</p>
);

export default ErrorMessage;
