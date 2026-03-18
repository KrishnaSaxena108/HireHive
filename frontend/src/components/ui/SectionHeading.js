import React from 'react';

/**
 * Reusable SectionHeading Component
 * For consistent section headers across pages
 */
const SectionHeading = ({
  title,
  subtitle = null,
  centered = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        ${centered ? 'text-center' : ''}
        mb-8 ${className}
      `}
      {...props}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
