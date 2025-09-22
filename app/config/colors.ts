// Color Configuration - Dynamic colors from environment variables
// Only includes colors that are actually used in the application
//
// Environment Variables (add to .env.local):
// 
// Business Configuration:
// NEXT_PUBLIC_BUSINESS_ID=your-business-id
// NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
//
// Cookie Configuration:
// NEXT_PUBLIC_COOKIE_AUTH_TOKEN=topped-off-co
// NEXT_PUBLIC_COOKIE_USER_ROLE=topped-off-co_role
//
// PWA Configuration (Icon Dynamic Only):
// NEXT_PUBLIC_PWA_NAME=Topped Off Co.
// NEXT_PUBLIC_PWA_SHORT_NAME=ToppedOffCo
// NEXT_PUBLIC_PWA_DESCRIPTION=Topped Off Co. App
// NEXT_PUBLIC_PWA_ICON_192=https://cdn.example.com/mobile-icon.png
// NEXT_PUBLIC_PWA_ICON_512=https://cdn.example.com/mobile-icon.png

// Logo Configuration (Dynamic):
// NEXT_PUBLIC_LOGO_TYPE=text
// NEXT_PUBLIC_LOGO_TEXT_MAIN=Topped
// NEXT_PUBLIC_LOGO_TEXT_SUB=off co.
// NEXT_PUBLIC_LOGO_TAGLINE=luxury designs
// NEXT_PUBLIC_LOGO_IMAGE_PATH=https://cdn.example.com/logo.png
//
// Color Configuration:
// NEXT_PUBLIC_PRIMARY_COLOR=#3B3B3B
// NEXT_PUBLIC_PRIMARY_HOVER=#333333
// NEXT_PUBLIC_PRIMARY_DARK=#2D2D2D
// NEXT_PUBLIC_PRIMARY_DISABLED=#d1d5db
// NEXT_PUBLIC_SECONDARY_COLOR=#6B7280
// NEXT_PUBLIC_SECONDARY_HOVER=#5B6366
// NEXT_PUBLIC_SECONDARY_DARK=#4B5563
// NEXT_PUBLIC_SECONDARY_DISABLED=#d1d5db
// NEXT_PUBLIC_BACKGROUND_PRIMARY=#FFFFFF
// NEXT_PUBLIC_BACKGROUND_SECONDARY=#F9FAFB
// NEXT_PUBLIC_TEXT_PRIMARY=#000000
// NEXT_PUBLIC_TEXT_PRIMARY_HOVER=#1F2937
// NEXT_PUBLIC_TEXT_SECONDARY=#3B3B3B
// NEXT_PUBLIC_TEXT_SECONDARY_HOVER=#111827
// NEXT_PUBLIC_BORDER_PRIMARY=#e5e5e5
// NEXT_PUBLIC_BORDER_SECONDARY=#d1d5db
// NEXT_PUBLIC_BORDER_LIGHT=#f5f5f5
//
// Square Payment Configuration:
// NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-kMtm2Q79PLnqxFMcwlTmcg
// NEXT_PUBLIC_SQUARE_LOCATION_ID=LBGJZKB82ED85
//

export const COLORS = {
  // Primary Colors - Most used colors
  primary: {
    main: process.env.NEXT_PUBLIC_PRIMARY_COLOR!,
    hover: process.env.NEXT_PUBLIC_PRIMARY_HOVER!,
    dark: process.env.NEXT_PUBLIC_PRIMARY_DARK!,
    disabled: process.env.NEXT_PUBLIC_PRIMARY_DISABLED!,
  },
  
  // Secondary Colors - Supporting colors
  secondary: {
    main: process.env.NEXT_PUBLIC_SECONDARY_COLOR!,
    hover: process.env.NEXT_PUBLIC_SECONDARY_HOVER!,
    dark: process.env.NEXT_PUBLIC_SECONDARY_DARK!,
    disabled: process.env.NEXT_PUBLIC_SECONDARY_DISABLED!,
  },
  
  // Status Colors - Static (as requested)
  success: {
    main: '#10B981',
    dark: '#059669',
    text: '#FFFFFF',
  },
  
  error: {
    main: '#EF4444',
    dark: '#DC2626',
    text: '#FFFFFF',
  },
  
  warning: {
    main: '#F59E0B',
    dark: '#D97706',
    text: '#FFFFFF',
  },
  
  // Background Colors - Heavily used
  background: {
    primary: process.env.NEXT_PUBLIC_BACKGROUND_PRIMARY!,
    secondary: process.env.NEXT_PUBLIC_BACKGROUND_SECONDARY!,
  },
  
  // Border Colors - Centralized
  border: {
    primary: process.env.NEXT_PUBLIC_BORDER_PRIMARY!,
    secondary: process.env.NEXT_PUBLIC_BORDER_SECONDARY!,
    light: process.env.NEXT_PUBLIC_BORDER_LIGHT!,
  },
  
  // Text Colors - Heavily used
  text: {
    primary: process.env.NEXT_PUBLIC_TEXT_PRIMARY!,
    primaryHover: process.env.NEXT_PUBLIC_TEXT_PRIMARY_HOVER!,
    secondary: process.env.NEXT_PUBLIC_TEXT_SECONDARY!,
    secondaryHover: process.env.NEXT_PUBLIC_TEXT_SECONDARY_HOVER!,
  },
} as const;

// CSS Custom Properties for use in CSS
export const CSS_COLOR_VARS = {
  // Primary Colors
  '--color-primary': COLORS.primary.main,
  '--color-primary-hover': COLORS.primary.hover,
  '--color-primary-dark': COLORS.primary.dark,
  '--color-primary-disabled': COLORS.primary.disabled,
  
  // Secondary Colors
  '--color-secondary': COLORS.secondary.main,
  '--color-secondary-hover': COLORS.secondary.hover,
  '--color-secondary-dark': COLORS.secondary.dark,
  '--color-secondary-disabled': COLORS.secondary.disabled,
  
  // Accent Colors - Purple colors removed
  
  // Status Colors
  '--color-success': COLORS.success.main,
  '--color-success-dark': COLORS.success.dark,
  '--color-success-text': COLORS.success.text,
  '--color-error': COLORS.error.main,
  '--color-error-dark': COLORS.error.dark,
  '--color-error-text': COLORS.error.text,
  '--color-warning': COLORS.warning.main,
  '--color-warning-dark': COLORS.warning.dark,
  '--color-warning-text': COLORS.warning.text,
  
  // Background Colors
  '--color-background-primary': COLORS.background.primary,
  '--color-background-secondary': COLORS.background.secondary,
  
  // Border Colors
  '--color-border-primary': COLORS.border.primary,
  '--color-border-secondary': COLORS.border.secondary,
  '--color-border-light': COLORS.border.light,
  
  // Text Colors
  '--color-text-primary': COLORS.text.primary,
  '--color-text-primary-hover': COLORS.text.primaryHover,
  '--color-text-secondary': COLORS.text.secondary,
  '--color-text-secondary-hover': COLORS.text.secondaryHover,
} as const;

// Tailwind CSS color configuration
export const TAILWIND_COLORS = {
  // Primary Colors
  primary: {
    500: COLORS.primary.main,
    600: COLORS.primary.dark,
    700: COLORS.primary.dark,
  },
  
  // Secondary Colors
  secondary: {
    500: COLORS.secondary.main,
    600: COLORS.secondary.hover,
  },
  
  // Accent Colors - Purple colors removed
} as const;