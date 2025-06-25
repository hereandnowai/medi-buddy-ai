
import React from 'react';
import { BRAND_CONFIG } from '../constants';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div 
        className={`animate-spin rounded-full border-4 border-t-transparent ${sizeClasses[size]}`}
        style={{ borderColor: BRAND_CONFIG.brand.colors.secondary, borderTopColor: 'transparent' }}
      ></div>
      {message && <p className="text-sm" style={{color: BRAND_CONFIG.brand.colors.secondary}}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
