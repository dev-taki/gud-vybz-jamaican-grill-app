import { api } from '../utils/api';
import { API_ENDPOINTS, API_CONFIG } from '../config/api';

export interface RedeemItem {
  id: number;
  created_at: number;
  business_id: string;
  charged_credit: number;
  gift_charge_credit: number; // Keep for backward compatibility with API
  order_id: string;
  user_id: string;
  plan_variation_name: string;
}

export interface AddRedeemData {
  business_id: string;
  button_number: number; // Always 1 for normal redemption
}

export interface RedeemResponse {
  id: number;
  created_at: number;
  business_id: string;
  charged_credit: number;
  gift_charge_credit: number; // Keep for backward compatibility with API
  order_id: string;
  user_id: string;
  plan_variation_name: string;
}

export class RedeemService {
  // Get redeem items with pagination
  static async getRedeemItems(page: number = 0, perPage: number = 5): Promise<RedeemItem[]> {
    return api.get<RedeemItem[]>(
      `${API_ENDPOINTS.CLIENT.REDEEM.GET_REDEEM_ITEMS}?business_id=${API_CONFIG.BUSINESS_ID}&page=${page}&per_page=${perPage}`
    );
  }

  // Add new redeem item
  static async addRedeem(data: AddRedeemData): Promise<RedeemResponse> {
    return api.post<RedeemResponse>(
      API_ENDPOINTS.CLIENT.REDEEM.CREATE_REDEEM,
      { ...data, business_id: API_CONFIG.BUSINESS_ID },
      { showSuccessToast: true, successMessage: 'Redeem request created successfully!' }
    );
  }

  // Get redeem history
  static async getRedeemHistory(): Promise<RedeemItem[]> {
    return api.get<RedeemItem[]>(
      `${API_ENDPOINTS.CLIENT.REDEEM.GET_REDEEM_ITEMS}/history?business_id=${API_CONFIG.BUSINESS_ID}`
    );
  }
}
