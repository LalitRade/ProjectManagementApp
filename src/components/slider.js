// src/components/Slider.js
import React from 'react';

export const Slider = ({ min, max, value, onChange }) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className="slider"
    />
  );
};
