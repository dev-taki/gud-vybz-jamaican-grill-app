'use client';

import React from 'react';
import { FONT_CLASSES } from '../../config/fonts';

interface FontProviderProps {
  children: React.ReactNode;
}

// Font utility component for logos
export const Logo: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <span className={`${FONT_CLASSES.logo} ${className}`} {...props}>
    {children}
  </span>
);

// Font utility component for headings
export const Heading1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <h1 className={`${FONT_CLASSES.heading1} ${className}`} {...props}>
    {children}
  </h1>
);

export const Heading2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <h2 className={`${FONT_CLASSES.heading2} ${className}`} {...props}>
    {children}
  </h2>
);

export const Heading3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <h3 className={`${FONT_CLASSES.heading3} ${className}`} {...props}>
    {children}
  </h3>
);

export const Heading4: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <h4 className={`${FONT_CLASSES.heading4} ${className}`} {...props}>
    {children}
  </h4>
);

export const Heading5: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <h5 className={`${FONT_CLASSES.heading5} ${className}`} {...props}>
    {children}
  </h5>
);

export const Heading6: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <h6 className={`${FONT_CLASSES.heading6} ${className}`} {...props}>
    {children}
  </h6>
);

// Font utility component for paragraphs
export const Paragraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <p className={`${FONT_CLASSES.paragraph} ${className}`} {...props}>
    {children}
  </p>
);

export const ParagraphSmall: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <p className={`${FONT_CLASSES.paragraphSmall} ${className}`} {...props}>
    {children}
  </p>
);

export const ParagraphLarge: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <p className={`${FONT_CLASSES.paragraphLarge} ${className}`} {...props}>
    {children}
  </p>
);

// Font utility component for body text
export const Body: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <div className={`${FONT_CLASSES.body} ${className}`} {...props}>
    {children}
  </div>
);

export const BodySmall: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <div className={`${FONT_CLASSES.bodySmall} ${className}`} {...props}>
    {children}
  </div>
);

export const BodyLarge: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <div className={`${FONT_CLASSES.bodyLarge} ${className}`} {...props}>
    {children}
  </div>
);

// Main FontProvider component
export const FontProvider: React.FC<FontProviderProps> = ({ children }) => {
  return <>{children}</>;
};

// Export all font classes for direct use
export { FONT_CLASSES };
