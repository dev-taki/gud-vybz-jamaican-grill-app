import { api } from '../utils/api';
import { API_ENDPOINTS, API_CONFIG } from '../config/api';

// Admin Types
export interface AdminUser {
  id: number;
  created_at: number;
  name: string;
  email: string;
  square_customer_id: string;
  role: string;
  business_id: string;
}

export interface AdminUserSubscription {
  id: number;
  created_at: number;
  status: string;
  object_id: string;
  card_id: string;
  location_id: string;
  plan_variation_id: string;
  start_date: number;
  end_date: number;
  cancellation_data: any;
  version: number;
  email: string;
  business_id: string;
  user_id: string;
  customer_id: string;
  cadence: string;
  available_credit: number;
  subscription_amount: number;
}

export interface AdminCardData {
  sourceId: string;
  cardToken: string;
  postalCode: string;
  countryCode: string;
  cardHolderName: string;
  business_id: string;
  user_id: string;
}

export interface AdminRedeemData {
  business_id: string;
  user_id: string;
  status?: string;
}

export interface AdminSubscriptionData {
  business_id: string;
  user_id: string;
  plan_variation_id: string;
  card_id?: string;
}

export class AdminService {
  // User Management
  static async getAllUsers(): Promise<AdminUser[]> {
    return api.get<AdminUser[]>(
      `${API_ENDPOINTS.ADMIN.USERS}?business_id=${API_CONFIG.BUSINESS_ID}`
    );
  }

  static async getUserById(userId: string): Promise<AdminUser> {
    return api.get<AdminUser>(
      `${API_ENDPOINTS.ADMIN.USER_BY_ID}/${userId}?business_id=${API_CONFIG.BUSINESS_ID}`
    );
  }

  // Subscription Management
  static async getAllUserSubscriptions(): Promise<AdminUserSubscription[]> {
    return api.get<AdminUserSubscription[]>(
      `${API_ENDPOINTS.ADMIN.ALL_USER_SUBSCRIPTIONS}?business_id=${API_CONFIG.BUSINESS_ID}`
    );
  }

  static async updateUserSubscription(subscriptionId: string, data: Partial<AdminUserSubscription>): Promise<AdminUserSubscription> {
    return api.put<AdminUserSubscription>(
      `${API_ENDPOINTS.ADMIN.UPDATE_USER_SUBSCRIPTION}/${subscriptionId}`,
      { ...data, business_id: API_CONFIG.BUSINESS_ID }
    );
  }

  static async createUserSubscription(data: AdminSubscriptionData): Promise<any> {
    return api.post(
      API_ENDPOINTS.ADMIN.CREATE_USER_SUBSCRIPTION,
      { ...data, business_id: API_CONFIG.BUSINESS_ID }
    );
  }

  static async createUserSubscriptionWithoutCard(data: Omit<AdminSubscriptionData, 'card_id'>): Promise<any> {
    return api.post(
      API_ENDPOINTS.ADMIN.CREATE_USER_SUBSCRIPTION_WITHOUT_CARD,
      { ...data, business_id: API_CONFIG.BUSINESS_ID }
    );
  }

  // Card Management
  static async addCardForUser(cardData: AdminCardData): Promise<any> {
    return api.post(
      API_ENDPOINTS.ADMIN.ADD_CARD,
      { ...cardData, business_id: API_CONFIG.BUSINESS_ID }
    );
  }

  // Redeem Management
  static async getAllRedeemItems(): Promise<any[]> {
    return api.get<any[]>(
      `${API_ENDPOINTS.ADMIN.REDEEM}?business_id=${API_CONFIG.BUSINESS_ID}`
    );
  }

  static async updateRedeemItem(redeemId: string, data: Partial<AdminRedeemData>): Promise<any> {
    return api.put(
      `${API_ENDPOINTS.ADMIN.UPDATE_REDEEM}/${redeemId}`,
      { ...data, business_id: API_CONFIG.BUSINESS_ID }
    );
  }

  // Plan Management
  static async getSubscriptionVariations(): Promise<any> {
    return api.get(
      `${API_ENDPOINTS.ADMIN.SUBSCRIPTION_VARIATIONS}?business_id=${API_CONFIG.BUSINESS_ID}`
    );
  }
}
