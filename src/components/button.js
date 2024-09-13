// Button.js
import React from 'react';

export const Button = ({ children, onClick, className }) => (
    <button onClick={onClick} className={`p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white ${className}`}>
      {children}
    </button>
  );
  