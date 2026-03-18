import React from 'react';

/**
 * Reusable Input Component
 * Handles text, email, number, password, and more
 */
const Input = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  required = false,
  disabled = false,
  icon: Icon = null,
  label = '',
  error = '',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  const baseStyles = `
    w-full rounded-xl border-2 border-gray-200 
    focus:border-blue-600 focus:ring-2 focus:ring-blue-100 
    outline-none transition-all duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed
    placeholder-gray-400
  `;

  const errorClass = error ? 'border-red-500 focus:border-red-500' : '';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          className={`
            ${baseStyles}
            ${sizeStyles[size]}
            ${errorClass}
            ${Icon ? 'pl-10' : ''}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
