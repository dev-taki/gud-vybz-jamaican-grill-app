import { API_CONFIG } from '../config/api';

/**
 * Get the business ID from environment variables or fallback to default
 */
export const getBusinessId = (): string => {
  return API_CONFIG.BUSINESS_ID!;
};

/**
 * Get the API base URL from environment variables or fallback to default
 */
export const getApiBaseUrl = (): string => {
  return API_CONFIG.BASE_URL;
};

/**
 * Get API timeout from environment variables or fallback to default
 */
export const getApiTimeout = (): number => {
  return API_CONFIG.TIMEOUT;
};

/**
 * Get API retry attempts from environment variables or fallback to default
 */
export const getApiRetryAttempts = (): number => {
  return API_CONFIG.RETRY_ATTEMPTS;
};

/**
 * Check if running in development mode
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Check if running in production mode
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Get app name from environment variables
 */
export const getAppName = (): string => {
  return process.env.NEXT_PUBLIC_APP_NAME!;
};

/**
 * Get app description from environment variables
 */
export const getAppDescription = (): string => {
  return process.env.NEXT_PUBLIC_APP_DESCRIPTION!;
};
