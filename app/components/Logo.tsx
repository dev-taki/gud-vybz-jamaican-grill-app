import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'minimal' | 'stacked';
  className?: string;
  showTagline?: boolean;
  color?: 'default' | 'white' | 'primary';
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'default',
  className = '', 
  showTagline = false,
  color = 'default'
}) => {
  // Check if using image logo or text logo
  const logoType = process.env.NEXT_PUBLIC_LOGO_TYPE!; // 'text' or 'image'
  const logoImagePath = process.env.NEXT_PUBLIC_LOGO_IMAGE_PATH!; // Path to image file
  const logoTextMain = process.env.NEXT_PUBLIC_LOGO_TEXT_MAIN!; // Main text (e.g., "Topped")
  const logoTextSub = process.env.NEXT_PUBLIC_LOGO_TEXT_SUB!; // Sub text (e.g., "off co.")
  const logoTagline = process.env.NEXT_PUBLIC_LOGO_TAGLINE!; // Tagline (e.g., "luxury designs")

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl'
  };

  const imageSizeClasses = {
    sm: { width: 80, height: 40 },
    md: { width: 120, height: 60 },
    lg: { width: 160, height: 80 },
    xl: { width: 200, height: 100 },
    '2xl': { width: 240, height: 120 }
  };

  const taglineSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl'
  };

  const colorClasses = {
    default: {
      main: 'text-gray-900',
      tagline: 'text-gray-600'
    },
    white: {
      main: 'text-white',
      tagline: 'text-gray-200'
    },
    primary: {
      main: 'text-gray-900',
      tagline: 'text-gray-700'
    }
  };

  const colors = colorClasses[color];

  // If using image logo
  if (logoType === 'image') {
    const imageSize = imageSizeClasses[size];
    const isExternalUrl = logoImagePath.startsWith('http');
    
    return (
      <div className={`text-center ${className}`}>
        <div className="flex justify-center">
          <Image
            src={logoImagePath}
            alt={process.env.NEXT_PUBLIC_PWA_NAME!}
            width={imageSize.width}
            height={imageSize.height}
            className="object-contain"
            priority
            unoptimized={isExternalUrl} // Disable optimization for external URLs
          />
        </div>
        {showTagline && logoTagline && (
          <div className={`font-medium ${taglineSizeClasses[size]} ${colors.tagline} mt-2 uppercase`} style={{ letterSpacing: '0.8em', fontFamily: 'var(--font-family-montserrat)' }}>
            {logoTagline}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`text-center ${className}`}>
        <div className={`hatton-ultralight text-[64.5px] ${colors.main} leading-none uppercase`}>
          {logoTextMain}
        </div>
        <div className={`hatton-ultralight text-[64.5px] ${colors.main} leading-none uppercase -mt-1`}>
          {logoTextSub}
        </div>
        {showTagline && logoTagline && (
          <div className={`font-medium text-[11.2px] ${colors.tagline} mt-1 uppercase`} style={{ letterSpacing: '0.8em', fontFamily: 'var(--font-family-montserrat)' }}>
            {logoTagline}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`text-center ${className}`}>
        <div className={`hatton-ultralight text-[64.5px] ${colors.main} leading-none uppercase`}>
          {logoTextMain}
        </div>
        <div className={`hatton-ultralight text-[64.5px] ${colors.main} leading-none uppercase -mt-1`}>
          {logoTextSub}
        </div>
        {showTagline && logoTagline && (
          <div className={`font-medium text-[11.2px] ${colors.tagline} mt-1 uppercase`} style={{ letterSpacing: '0.8em', fontFamily: 'var(--font-family-montserrat)' }}>
            {logoTagline}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`text-center ${className}`}>
      <div className={`hatton-ultralight text-[64.5px] ${colors.main} leading-none uppercase`}>
        {logoTextMain}
      </div>
      <div className={`hatton-ultralight text-[64.5px] ${colors.main} leading-none uppercase -mt-1`}>
        {logoTextSub}
      </div>
      {showTagline && logoTagline && (
        <div className={`font-medium text-[11.2px] ${colors.tagline} mt-1 uppercase`} style={{ letterSpacing: '0.8em', fontFamily: 'var(--font-family-montserrat)' }}>
          {logoTagline}
        </div>
      )}
    </div>
  );
};

export default Logo;
