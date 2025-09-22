import { useRouter } from 'next/navigation';

export const handleAuthError = (error: any, isAdmin: boolean = false) => {
  // Check if it's a 401 error
  if (error?.status === 401 || error?.message?.includes('401') || 
      error?.response?.status === 401 || error?.statusCode === 401) {
    
    // Clear auth token
    if (typeof window !== 'undefined') {
      // Clear the cookie
      document.cookie = 'topped-off-co=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      
      // Clear any stored auth data
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
    
    // Redirect to appropriate login page
    if (isAdmin) {
      window.location.href = '/login';
    } else {
      window.location.href = '/signup';
    }
    
    return true; // Indicates that auth error was handled
  }
  
  return false; // Indicates that auth error was not handled
};

// Hook for handling auth errors in components
export const useAuthErrorHandler = (isAdmin: boolean = false) => {
  const router = useRouter();
  
  const handleError = (error: any) => {
    if (handleAuthError(error, isAdmin)) {
      return true; // Error was handled (redirected)
    }
    return false; // Error was not handled
  };
  
  return { handleError };
};
