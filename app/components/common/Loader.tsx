'use client';

import React from 'react';

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray' | 'custom';
  customColor?: string;
  className?: string;
  text?: string;
  showText?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'primary',
  customColor,
  className = '',
  text,
  showText = false,
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'border-gray-200 border-t-[#8c52ff]',
    white: 'border-gray-300 border-t-white',
    gray: 'border-gray-200 border-t-gray-600',
    custom: '',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const borderWidths = {
    xs: 'border',
    sm: 'border',
    md: 'border-2',
    lg: 'border-2',
    xl: 'border-4',
  };

  const getBorderColor = () => {
    if (color === 'custom' && customColor) {
      return `border-gray-200 border-t-[${customColor}]`;
    }
    return colorClasses[color];
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${borderWidths[size]} ${getBorderColor()} rounded-full animate-spin`}
        style={color === 'custom' && customColor ? { borderTopColor: customColor } : {}}
      />
      {showText && (
        <p className={`${textSizes[size]} text-gray-500 mt-2 font-light`}>
          {text || 'Loading...'}
        </p>
      )}
    </div>
  );
};

// Convenience components for common use cases
export const PageLoader: React.FC<{ text?: string }> = ({ text }) => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader size="xl" text={text} showText={true} />
  </div>
);

export const ButtonLoader: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
  <Loader size={size} color="white" />
);

export const InlineLoader: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
  <Loader size={size} color="primary" />
);

export const CardLoader: React.FC<{ text?: string }> = ({ text }) => (
  <div className="flex items-center justify-center py-8">
    <Loader size="lg" text={text} showText={true} />
  </div>
);
