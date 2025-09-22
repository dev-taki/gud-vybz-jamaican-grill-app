import { COLORS } from './colors';

// App Configuration
export const APP_CONFIG = {
  // App Information
  name: 'Topped Off Co.',
  description: 'A modern, scalable Next.js template with Redux Toolkit',
  version: '1.0.0',
  
  // Theme Configuration - Uses centralized color system
  theme: {
    primary: {
      color: COLORS.primary.main,
      hover: COLORS.primary.hover,
    },
    secondary: {
      color: COLORS.secondary.main,
      hover: COLORS.secondary.hover,
    },
    success: {
      color: COLORS.success.main,
      hover: COLORS.success.dark,
    },
    error: {
      color: COLORS.error.main,
      hover: COLORS.error.dark,
    },
    warning: {
      color: COLORS.warning.main,
      hover: COLORS.warning.dark,
    },
  },
  
  // Navigation Configuration
  navigation: {
    items: [
      { href: '/', label: 'Home', icon: 'home' },
      { href: '/redux-example', label: 'Redux Example', icon: 'code' },
      { href: '/login', label: 'Login', icon: 'log-in' },
      { href: '/signup', label: 'Sign Up', icon: 'user-plus' },
    ],
  },
  
  // Feature Flags
  features: {
    authentication: true,
    subscriptions: true,
    plans: true,
    pwa: true,
    darkMode: false,
    notifications: false,
  },
  
  // Storage Configuration
  storage: {
    authTokenKey: process.env.NEXT_PUBLIC_COOKIE_AUTH_TOKEN,
    userRoleKey: process.env.NEXT_PUBLIC_COOKIE_USER_ROLE ,
    themeKey: 'theme',
    preferencesKey: 'user-preferences',
  },
  
  // API Configuration
  api: {
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  
  // PWA Configuration
  pwa: {
    name: process.env.NEXT_PUBLIC_PWA_NAME!,
    shortName: process.env.NEXT_PUBLIC_PWA_SHORT_NAME!,
    description: process.env.NEXT_PUBLIC_PWA_DESCRIPTION!,
    themeColor: COLORS.primary.main,
    backgroundColor: COLORS.background.primary,
    display: 'standalone',
    orientation: 'portrait',
  },
} as const;

// Environment-specific configuration
export const getConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    ...APP_CONFIG,
    api: {
      ...APP_CONFIG.api,
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      businessId: process.env.NEXT_PUBLIC_BUSINESS_ID || 'default-business-id',
    },
    debug: isDevelopment,
  };
};
