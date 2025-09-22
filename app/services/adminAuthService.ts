import { AuthService } from './authService';

import { handleAuthError } from '../utils/authUtils';

const API_BASE_URL = AuthService.getApiBaseUrl();
const BUSINESS_ID = AuthService.getBusinessId();

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  authToken: string;
}

export interface AdminProfile {
  id: number;
  created_at: number;
  name: string;
  email: string;
  square_customer_id: string;
  role: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
}

// Cookie utility functions (same as client side)
const setCookie = (name: string, value: string, days: number = 7): void => {
  if (typeof window !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }
};

const getCookie = (name: string): string | null => {
  if (typeof window !== 'undefined') {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

const removeCookie = (name: string): void => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};

export class AdminAuthService {
  static async login(data: AdminLoginData): Promise<AdminAuthResponse> {
    return this.apiRequest<AdminAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        business_id: BUSINESS_ID
      }),
    });
  }

  static setAuthToken(token: string): void {
    setCookie(process.env.NEXT_PUBLIC_COOKIE_AUTH_TOKEN!, token, 7); // Store for 7 days (same cookie as client)
    // Clear PWA install dismiss flag on successful authentication
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pwa-install-dismissed');
    }
  }

  static setRole(role: string): void {
    setCookie(process.env.NEXT_PUBLIC_COOKIE_USER_ROLE!, role, 7); // Store role for 7 days
  }

  static getRole(): string | null {
    return getCookie(process.env.NEXT_PUBLIC_COOKIE_USER_ROLE!);
  }

  static removeRole(): void {
    removeCookie(process.env.NEXT_PUBLIC_COOKIE_USER_ROLE!);
  }

  static getAuthToken(): string | null {
    return getCookie(process.env.NEXT_PUBLIC_COOKIE_AUTH_TOKEN!);
  }

  static removeAuthToken(): void {
    removeCookie(process.env.NEXT_PUBLIC_COOKIE_AUTH_TOKEN!);
    this.removeRole();
  }

  static isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Helper method to get headers with auth token for API requests
  static getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic API request method that always includes the auth token
  static async apiRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getAuthHeaders();
    
    // Merge custom headers with auth headers
    const finalHeaders = {
      ...headers,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers: finalHeaders,
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle 401 errors for admin users
      if (response.status === 401) {
        handleAuthError({ status: 401 }, true); // true = admin user
        return result; // This won't execute due to redirect, but needed for TypeScript
      }
      throw new Error(result.message || 'API request failed');
    }

    return result;
  }

  // Check if user has admin role from cookie (no API call)
  static hasAdminRole(): boolean {
    const role = this.getRole();
    return role === 'admin' || role === 'super_admin' || role === 'owner';
  }
}
