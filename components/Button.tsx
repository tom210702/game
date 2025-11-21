import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', active, className = '', ...props 
}) => {
  const baseStyle = "transition-all duration-200 font-medium rounded-xl shadow-sm transform active:translate-y-px active:shadow-none";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/30",
    secondary: "bg-blue-400 text-white hover:bg-blue-500 shadow-blue-400/30",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-red-500/30",
    warning: "bg-orange-400 text-white hover:bg-orange-500 shadow-orange-400/30",
  };

  const activeStyle = active ? "bg-blue-600 ring-2 ring-blue-300 inset-shadow" : "";

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${activeStyle} px-6 py-3 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
