import { API_CONFIG, HTTP_METHODS, HTTP_STATUS } from '../config/api';
import { getCookie, STORAGE_KEYS } from './storage';
import { showToast } from './toast';

// Global fetch interceptor to handle 401 errors
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    try {
      const response = await originalFetch.apply(this, args);
      
      // Check for 401 errors
      if (response.status === 401) {
        // Clear auth tokens
        document.cookie = 'topped-off-co=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'topped-off-co_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('topped-off-co');
        localStorage.removeItem('topped-off-co_role');
        
        // Redirect to login
        window.location.href = '/login';
        return response;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API request configuration interface
interface ApiRequestConfig extends RequestInit {
  retryAttempts?: number;
  timeout?: number;
}

// Default API request configuration
const defaultConfig: ApiRequestConfig = {
  retryAttempts: API_CONFIG.RETRY_ATTEMPTS,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Get authentication headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};


// Retry logic
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  retryAttempts: number,
  delay: number = 1000
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error) {
    if (retryAttempts > 0 && error instanceof ApiError && error.status >= 500) {
      // Show retry notification
      showToast.error(`Request failed. Retrying... (${retryAttempts} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(requestFn, retryAttempts - 1, delay * 2);
    }
    throw error;
  }
};

// Generic API request method
export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestConfig & { showSuccessToast?: boolean; successMessage?: string } = {}
): Promise<T> => {
  const config = { ...defaultConfig, ...options };
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();
  
  // Merge custom headers with auth headers
  const finalHeaders = {
    ...headers,
    ...config.headers,
  };

  const requestFn = async (): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        headers: finalHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) {
        // Handle authentication errors globally
        if (response.status === HTTP_STATUS.UNAUTHORIZED) {
          // Clear auth tokens
          if (typeof window !== 'undefined') {
            // Clear cookies
            document.cookie = 'topped-off-co=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'topped-off-co_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            
            // Clear localStorage if any
            localStorage.removeItem('topped-off-co');
            localStorage.removeItem('topped-off-co_role');
            
            // Redirect to login
            window.location.href = '/login';
          }
          
          // Throw authentication error
          throw new ApiError('Authentication failed', HTTP_STATUS.UNAUTHORIZED);
        }
        
        const errorMessage = result.message || 'API request failed';
        
        // Show toast notification for all API errors
        showToast.error(errorMessage);
        
        throw new ApiError(
          errorMessage,
          response.status,
          result.code
        );
      }

      // Show success toast if requested
      if (options.showSuccessToast) {
        showToast.success(options.successMessage || 'Operation completed successfully!');
      }
      
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError = new ApiError('Request timeout', 408);
        showToast.error('Request timeout. Please try again.');
        throw timeoutError;
      }
      
      const networkError = new ApiError('Network error', 0);
      showToast.error('Network error. Please check your connection.');
      throw networkError;
    }
  };

  return retryRequest(requestFn, config.retryAttempts || 0);
};

// Specific API methods
export const api = {
  // GET request
  get: <T>(endpoint: string, config?: ApiRequestConfig & { showSuccessToast?: boolean; successMessage?: string }): Promise<T> => {
    return apiRequest<T>(endpoint, { ...config, method: HTTP_METHODS.GET });
  },

  // POST request
  post: <T>(endpoint: string, data?: any, config?: ApiRequestConfig & { showSuccessToast?: boolean; successMessage?: string }): Promise<T> => {
    return apiRequest<T>(endpoint, {
      ...config,
      method: HTTP_METHODS.POST,
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // PUT request
  put: <T>(endpoint: string, data?: any, config?: ApiRequestConfig & { showSuccessToast?: boolean; successMessage?: string }): Promise<T> => {
    return apiRequest<T>(endpoint, {
      ...config,
      method: HTTP_METHODS.PUT,
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // DELETE request
  delete: <T>(endpoint: string, config?: ApiRequestConfig & { showSuccessToast?: boolean; successMessage?: string }): Promise<T> => {
    return apiRequest<T>(endpoint, { ...config, method: HTTP_METHODS.DELETE });
  },

  // PATCH request
  patch: <T>(endpoint: string, data?: any, config?: ApiRequestConfig & { showSuccessToast?: boolean; successMessage?: string }): Promise<T> => {
    return apiRequest<T>(endpoint, {
      ...config,
      method: HTTP_METHODS.PATCH,
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};
