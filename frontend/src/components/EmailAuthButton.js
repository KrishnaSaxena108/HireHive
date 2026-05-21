import React from 'react';
import { Chrome } from 'lucide-react';

const EmailAuthButton = ({ onClick, disabled = false, label = "Continue with Google" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Chrome size={20} className="text-gray-600" />
      <span>{label}</span>
    </button>
  );
};

export default EmailAuthButton;
