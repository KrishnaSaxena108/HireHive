import React from 'react';

/**
 * Reusable StatCard Component
 * Used in dashboard for statistics display
 */
const StatCard = ({
  icon: Icon,
  label,
  value,
  trend = null,
  trendDirection = 'up', // up or down
  backgroundColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  ...props
}) => {
  const trendClass = trendDirection === 'up' ? 'text-green-600' : 'text-red-600';

  return (
    <div
      className={`
        rounded-2xl p-6 shadow-md
        hover:shadow-lg hover:-translate-y-1 transition-all duration-200
        bg-white border border-gray-100
      `}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${backgroundColor} p-3 rounded-xl ${iconColor}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trendClass}`}>
            {trendDirection === 'up' ? '↑' : '↓'} {trend}%
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatCard;
