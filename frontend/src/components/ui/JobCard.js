import React from 'react';
import { Briefcase, DollarSign, Clock } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

/**
 * Reusable JobCard Component
 * Displays job listing with consistent styling
 */
const JobCard = ({
  job,
  onApply = () => {},
  onViewDetails = () => {},
  showStatus = true,
  showAction = true,
  actionLabel = 'Apply Now',
  actionVariant = 'primary',
  compact = false,
  ...props
}) => {
  const { title, description, budget, status, category, skills = [] } = job;

  if (compact) {
    return (
      <div
        className={`
          rounded-xl p-4 bg-white border border-gray-200
          hover:shadow-md hover:border-blue-200 transition-all duration-200
          flex flex-col justify-between
        `}
        {...props}
      >
        <div>
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
            {showStatus && (
              <Badge
                variant={status === 'OPEN' ? 'success' : 'neutral'}
                size="sm"
              >
                {status || 'Open'}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">{description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <DollarSign size={14} className="text-emerald-600" />
            <span>${budget}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-2xl p-6 bg-white shadow-md border border-gray-100
        hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group
        flex flex-col justify-between
      `}
      {...props}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
            <Briefcase size={24} />
          </div>
          {showStatus && (
            <Badge
              variant={status === 'OPEN' ? 'success' : status === 'IN_PROGRESS' ? 'warning' : 'neutral'}
              size="sm"
            >
              {status || 'Open'}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {description}
        </p>

        {/* Metadata */}
        <div className="space-y-3 mb-4">
          {/* Budget */}
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <DollarSign size={16} className="text-emerald-600" />
            <span>${budget}</span>
            {/* Type */}
            <span className="text-gray-400 text-sm font-normal ml-2 flex items-center gap-1">
              <Clock size={14} /> Fixed Price
            </span>
          </div>

          {/* Category */}
          {category && (
            <div>
              <Badge variant="primary" size="sm">
                {category}
              </Badge>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, idx) => (
                <Badge key={idx} variant="secondary" size="sm">
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge variant="neutral" size="sm">
                  +{skills.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {showAction && (
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button
            onClick={() => onViewDetails(job)}
            variant="outline"
            size="md"
            fullWidth
          >
            Details
          </Button>
          <Button
            onClick={() => onApply(job)}
            variant={actionVariant}
            size="md"
            fullWidth
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobCard;
