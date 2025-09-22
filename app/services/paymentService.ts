import { api } from '../utils/api';
import { API_ENDPOINTS, API_CONFIG } from '../config/api';

export interface CardData {
  sourceId: string;
  cardToken: string;
  postalCode: string;
  countryCode: string;
  cardHolderName: string;
  business_id: string;
}

export interface SubscriptionData {
  business_id: string;
  plan_variation_id: string;
  card_id: string;
}

export interface AddCardResponse {
  id: number;
  token: string;
  last_4: string;
  card_id: string;
  user_id: string;
  exp_year: number;
  exp_month: number;
  card_brand: string;
  created_at: number;
  business_id: string;
  customer_id: string;
  merchant_id: string;
  cardholder_name: string;
}

export interface CreateSubscriptionResponse {
  id: string;
  status: string;
  plan_id: string;
  card_id: string;
  created_at: string;
}

export class PaymentService {
  static async addCard(cardData: CardData): Promise<AddCardResponse> {
    return api.post<AddCardResponse>(
      API_ENDPOINTS.CLIENT.PAYMENT.ADD_CARD,
      { ...cardData, business_id: API_CONFIG.BUSINESS_ID },
      { showSuccessToast: true, successMessage: 'Card added successfully!' }
    );
  }

  static async createSubscription(subscriptionData: SubscriptionData): Promise<CreateSubscriptionResponse> {
    return api.post<CreateSubscriptionResponse>(
      API_ENDPOINTS.CLIENT.SUBSCRIPTION.CREATE_SUBSCRIPTION,
      { ...subscriptionData, business_id: API_CONFIG.BUSINESS_ID },
      { showSuccessToast: true, successMessage: 'Subscription created successfully!' }
    );
  }

  // Get user's cards
  static async getCards(): Promise<AddCardResponse[]> {
    return api.get<AddCardResponse[]>(
      `${API_ENDPOINTS.CLIENT.PAYMENT.ADD_CARD}?business_id=${API_CONFIG.BUSINESS_ID}`
    );
  }

  // Remove a card
  static async removeCard(cardId: string): Promise<void> {
    return api.delete(
      `${API_ENDPOINTS.CLIENT.PAYMENT.ADD_CARD}/${cardId}`,
      { showSuccessToast: true, successMessage: 'Card removed successfully!' }
    );
  }
}
