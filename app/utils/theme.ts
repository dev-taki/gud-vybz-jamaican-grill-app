import { COLORS } from '../config/colors';

// Theme utility functions for using primary colors
export const getPrimaryColorClasses = {
  // Button styles
  button: {
    primary: `bg-[${COLORS.primary.main}] text-white hover:bg-[${COLORS.primary.hover}]`,
    secondary: `bg-[${COLORS.secondary.main}] text-white hover:bg-[${COLORS.secondary.hover}]`,
    outline: `border border-[${COLORS.primary.main}] text-[${COLORS.primary.main}] hover:bg-[${COLORS.primary.main}] hover:text-white`,
  },
  
  // Text styles
  text: {
    primary: `text-[${COLORS.primary.main}]`,
    secondary: `text-[${COLORS.secondary.main}]`,
  },
  
  // Background styles
  background: {
    primary: `bg-[${COLORS.primary.main}]`,
    primaryLight: `bg-[${COLORS.border.light}]`,
    secondary: `bg-[${COLORS.secondary.main}]`,
  },
  
  // Border styles
  border: {
    primary: `border-[${COLORS.primary.main}]`,
    secondary: `border-[${COLORS.secondary.main}]`,
  },
  
  // Focus ring styles
  focus: {
    primary: `focus:ring-[${COLORS.primary.main}]`,
    secondary: `focus:ring-[${COLORS.secondary.main}]`,
  },
};

// Common button class combinations
export const buttonClasses = {
  primary: `bg-[${COLORS.primary.main}] text-white py-3 px-4 rounded-xl font-medium hover:bg-[${COLORS.primary.hover}] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`,
  secondary: `bg-[${COLORS.secondary.main}] text-white py-3 px-4 rounded-xl font-medium hover:bg-[${COLORS.secondary.hover}] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`,
  outline: `border border-[${COLORS.primary.main}] text-[${COLORS.primary.main}] py-3 px-4 rounded-xl font-medium hover:bg-[${COLORS.primary.main}] hover:text-white transition-colors`,
  ghost: `text-[${COLORS.primary.main}] py-3 px-4 rounded-xl font-medium hover:bg-[${COLORS.border.light}] hover:bg-opacity-10 transition-colors`,
};

// Get CSS custom properties for inline styles
export const getPrimaryColorStyle = () => ({
  '--color-primary': COLORS.primary.main,
  '--color-primary-hover': COLORS.primary.hover,
  '--color-primary-light': COLORS.border.light,
  '--color-primary-dark': COLORS.primary.dark,
} as React.CSSProperties);
