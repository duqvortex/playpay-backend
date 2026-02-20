import React from 'react';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      {...props}
      style={{
        padding: '10px',
        borderRadius: '8px',
        border: 'none',
        outline: 'none',
        background: '#111',
        color: '#fff',
        fontSize: '14px',
      }}
    />
  );
};

export default Input;

