import { api } from '../utils/api';
import { API_ENDPOINTS, API_CONFIG } from '../config/api';
import { UserProfile } from '../types';

export interface ClientDashboardData {
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRedeems: number;
  availableCredit: number;
  recentActivity: any[];
}

export interface ClientStats {
  subscriptions: number;
  redeems: number;
  credit: number;
  lastLogin: string;
}

export class ClientService {
  // Get client dashboard data
  static async getDashboardData(): Promise<ClientDashboardData> {
    // This would typically call a dashboard endpoint
    // For now, we'll return mock data structure
    return {
      totalSubscriptions: 0,
      activeSubscriptions: 0,
      totalRedeems: 0,
      availableCredit: 0,
      recentActivity: []
    };
  }

  // Get client statistics
  static async getClientStats(): Promise<ClientStats> {
    // This would typically call a stats endpoint
    // For now, we'll return mock data structure
    return {
      subscriptions: 0,
      redeems: 0,
      credit: 0,
      lastLogin: new Date().toISOString()
    };
  }

  // Get client profile (extends authService functionality)
  static async getClientProfile(): Promise<UserProfile> {
    return api.get<UserProfile>(
      `${API_ENDPOINTS.AUTH.ME}?business_id=${API_CONFIG.BUSINESS_ID}`
    );
  }

  // Update client profile
  static async updateClientProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return api.post<UserProfile>(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      { ...data, business_id: API_CONFIG.BUSINESS_ID },
      { showSuccessToast: true, successMessage: 'Profile updated successfully!' }
    );
  }

  // Get client settings
  static async getClientSettings(): Promise<any> {
    // This would typically call a settings endpoint
    return {
      notifications: true,
      emailUpdates: true,
      theme: 'light'
    };
  }

  // Update client settings
  static async updateClientSettings(settings: any): Promise<any> {
    // This would typically call a settings update endpoint
    return api.post('/client/settings', {
      ...settings,
      business_id: API_CONFIG.BUSINESS_ID
    }, { showSuccessToast: true, successMessage: 'Settings updated successfully!' });
  }
}
