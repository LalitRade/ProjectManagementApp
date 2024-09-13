// Input.js
import React from 'react';

export const Input = ({ value, onChange, placeholder, className, type = 'text' }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-2 border rounded-lg ${className}`}
    />
  );
  