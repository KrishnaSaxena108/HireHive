import React from 'react';

/**
 * Reusable Card Component
 * Used for consistent card styling across the app
 */
const Card = ({
  children,
  className = '',
  hoverable = false,
  shadow = 'md',
  rounded = 'xl',
  padding = 'md',
  border = false,
  ...props
}) => {
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowStyles = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const roundedStyles = {
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
  };

  const hoverClass = hoverable ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group' : '';
  const borderClass = border ? 'border border-gray-200' : '';

  return (
    <div
      className={`
        bg-white
        ${paddingStyles[padding]}
        ${shadowStyles[shadow]}
        ${roundedStyles[rounded]}
        ${hoverClass}
        ${borderClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
