// Square Payment Validation Utilities

export interface SquareValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSquareConfiguration(): SquareValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  if (!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID) {
    errors.push('NEXT_PUBLIC_SQUARE_APPLICATION_ID is not set');
  }

  if (!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
    errors.push('NEXT_PUBLIC_SQUARE_LOCATION_ID is not set');
  }

  // Check if running on HTTPS (required for Square in production)
  if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    errors.push('Square requires HTTPS in production environments');
  }

  // Check if Square SDK is loaded
  if (typeof window !== 'undefined' && !window.Square) {
    warnings.push('Square SDK not yet loaded');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function logSquareDiagnostics(): void {
  const validation = validateSquareConfiguration();
  
  console.group('🔍 Square Payment Diagnostics');
  console.log('Configuration Validation:', validation);
  
  if (typeof window !== 'undefined') {
    console.log('Environment:', {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      userAgent: window.navigator.userAgent
    });
    
    console.log('Square SDK:', {
      loaded: !!window.Square,
      version: window.Square?.version || 'N/A'
    });
  }
  
  console.groupEnd();
}

// Helper function to check if Square is properly configured
export function isSquareReady(): boolean {
  if (typeof window === 'undefined') return false;
  
  const validation = validateSquareConfiguration();
  return validation.isValid && !!window.Square;
}
