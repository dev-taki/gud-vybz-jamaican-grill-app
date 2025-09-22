import { api } from '../utils/api';
import { API_ENDPOINTS, API_CONFIG } from '../config/api';
import { setCookie, removeCookie, STORAGE_KEYS } from '../utils/storage';
import { 
  SignupData, 
  LoginData, 
  AuthResponse, 
  UserProfile, 
  ErrorResponse 
} from '../types';

export class AuthService {
  // Authentication methods
  static async signup(data: SignupData): Promise<AuthResponse> {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, {
      ...data,
      business_id: API_CONFIG.BUSINESS_ID
    });
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    return api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      ...data,
      business_id: API_CONFIG.BUSINESS_ID
    });
  }

  static async logout(): Promise<void> {
    // Just clear local data since there's no logout endpoint
    this.removeAuthToken();
  }

  // Token management
  static setAuthToken(token: string): void {
    setCookie(STORAGE_KEYS.AUTH_TOKEN, token, 7);
    // Clear PWA install dismiss flag on successful authentication
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.PWA_INSTALL_DISMISSED);
    }
  }

  static setRole(role: string): void {
    setCookie(STORAGE_KEYS.USER_ROLE, role, 7);
  }

  static getRole(): string | null {
    return getCookie(STORAGE_KEYS.USER_ROLE);
  }

  static removeRole(): void {
    removeCookie(STORAGE_KEYS.USER_ROLE);
  }

  static getAuthToken(): string | null {
    return getCookie(STORAGE_KEYS.AUTH_TOKEN);
  }

  static removeAuthToken(): void {
    removeCookie(STORAGE_KEYS.AUTH_TOKEN);
    this.removeRole();
  }

  static isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }



  static async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return api.post<UserProfile>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
      ...data,
      business_id: API_CONFIG.BUSINESS_ID
    });
  }

  // Configuration methods
  static getApiBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_BASE_URL!;
  }

  static getBusinessId(): string {
    return process.env.NEXT_PUBLIC_BUSINESS_ID!;
  }
}

// Import getCookie function
import { getCookie } from '../utils/storage';
