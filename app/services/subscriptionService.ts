import { api } from '../utils/api';
import { API_ENDPOINTS, API_CONFIG } from '../config/api';
import { UserSubscription } from '../types';

export class SubscriptionService {
  // Get user subscriptions
  static async getUserSubscriptions(businessId?: string): Promise<UserSubscription[]> {
    const businessIdParam = businessId || API_CONFIG.BUSINESS_ID;
    return api.get<UserSubscription[]>(
      `${API_ENDPOINTS.CLIENT.SUBSCRIPTION.USER_SUBSCRIPTIONS}?business_id=${businessIdParam}`
    );
  }

  // Get subscription by ID
  static async getSubscriptionById(subscriptionId: string): Promise<UserSubscription> {
    return api.get<UserSubscription>(
      `${API_ENDPOINTS.CLIENT.SUBSCRIPTION.USER_SUBSCRIPTIONS}/${subscriptionId}?business_id=${API_CONFIG.BUSINESS_ID}`
    );
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string): Promise<void> {
    return api.post(
      `${API_ENDPOINTS.CLIENT.SUBSCRIPTION.USER_SUBSCRIPTIONS}/${subscriptionId}/cancel`,
      { business_id: API_CONFIG.BUSINESS_ID },
      { showSuccessToast: true, successMessage: 'Subscription cancelled successfully!' }
    );
  }

  // Update subscription
  static async updateSubscription(
    subscriptionId: string, 
    data: Partial<UserSubscription>
  ): Promise<UserSubscription> {
    return api.put<UserSubscription>(
      `${API_ENDPOINTS.CLIENT.SUBSCRIPTION.USER_SUBSCRIPTIONS}/${subscriptionId}`,
      { ...data, business_id: API_CONFIG.BUSINESS_ID },
      { showSuccessToast: true, successMessage: 'Subscription updated successfully!' }
    );
  }

  // Get subscription status
  static async getSubscriptionStatus(subscriptionId: string): Promise<string> {
    const subscription = await this.getSubscriptionById(subscriptionId);
    return subscription.status;
  }
}
