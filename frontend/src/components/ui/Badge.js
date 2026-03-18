import React from 'react';

/**
 * Reusable Badge Component
 * For skills, tags, status indicators
 */
const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon = null,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantStyles = {
    primary: 'bg-blue-100 text-blue-700',
    secondary: 'bg-emerald-100 text-emerald-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    neutral: 'bg-gray-200 text-gray-700',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold rounded-full
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
};

export default Badge;
