import { api } from '../utils/api';
import { API_ENDPOINTS, API_CONFIG } from '../config/api';

export interface SubscriptionPlan {
  id: number;
  created_at: number;
  object_id: string;
  name: string;
  eligible_item_ids: string[];
  version: number;
  business_id: string;
  status: string;
}

export interface PlanVariation {
  id: number;
  created_at: number;
  object_id: string;
  plan_id: string;
  name: string;
  version: number;
  status: string;
  cadence: string;
  amount: number;
  type: string;
  business_id: string;
  credit: number;
  credit_charge_amount: number;
  description: string;
  image_link?: string;
}

export interface PlansResponse {
  subscription_plans: SubscriptionPlan[];
  plan_variations: PlanVariation[];
}

export class PlansService {
  // Get all available plans
  static async getPlans(): Promise<PlansResponse> {
    return api.get<PlansResponse>(
      `${API_ENDPOINTS.CLIENT.PLANS.GET_PLANS}?business_id=${API_CONFIG.BUSINESS_ID}`
    );
  }

  // Get plan by ID
  static async getPlanById(planId: string): Promise<SubscriptionPlan> {
    const plans = await this.getPlans();
    const plan = plans.subscription_plans.find(p => p.object_id === planId);
    if (!plan) {
      throw new Error('Plan not found');
    }
    return plan;
  }

  // Get plan variations for a specific plan
  static async getPlanVariations(planId: string): Promise<PlanVariation[]> {
    const plans = await this.getPlans();
    return plans.plan_variations.filter(v => v.plan_id === planId);
  }

  // Subscribe to a plan
  static async subscribeToPlan(planVariationId: string, cardId: string): Promise<any> {
    return api.post(
      API_ENDPOINTS.CLIENT.SUBSCRIPTION.CREATE_SUBSCRIPTION,
      {
        plan_variation_id: planVariationId,
        card_id: cardId,
        business_id: API_CONFIG.BUSINESS_ID
      },
      { showSuccessToast: true, successMessage: 'Successfully subscribed to plan!' }
    );
  }

  // Get admin plans (for admin dashboard)
  static async getAdminPlans(): Promise<PlansResponse> {
    return api.get<PlansResponse>(
      `${API_ENDPOINTS.ADMIN.SUBSCRIPTION_VARIATIONS}?business_id=${API_CONFIG.BUSINESS_ID}`
    );
  }
}
