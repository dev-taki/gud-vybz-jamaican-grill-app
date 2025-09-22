// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://xwqm-zvzg-uzfr.n7e.xano.io/api:fjTsAN4K',
  BUSINESS_ID: process.env.NEXT_PUBLIC_BUSINESS_ID,
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'), // 10 seconds
  RETRY_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),
} as const;

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_BUSINESS_ID) {
  console.warn('⚠️ NEXT_PUBLIC_BUSINESS_ID not set, using default value');
}

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.warn('⚠️ NEXT_PUBLIC_API_BASE_URL not set, using default value');
}

// API Endpoints
export const API_ENDPOINTS = {
  // Common endpoints (used by both client and admin)
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/user/update',
  },
  // Client endpoints
  CLIENT: {
    SUBSCRIPTION: {
      USER_SUBSCRIPTIONS: '/client/subscription',
      CREATE_SUBSCRIPTION: '/subscription/user/create-a-subscription',
    },
    PLANS: {
      GET_PLANS: '/client/subscription/subscription-variation',
    },
    PAYMENT: {
      ADD_CARD: '/card/add',
    },
    REDEEM: {
      GET_REDEEM_ITEMS: '/client/redeem',
      CREATE_REDEEM: '/redeem/create',
    },
  },
  // Admin endpoints
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: '/admin/user',
    ALL_USER_SUBSCRIPTIONS: '/admin/all_user_subscription',
    ADD_CARD: '/admin/card/add',
    REDEEM: '/admin/redeem',
    UPDATE_REDEEM: '/admin/redeem/update',
    SUBSCRIPTION_VARIATIONS: '/admin/subscription/subscription-variation',
    UPDATE_USER_SUBSCRIPTION: '/admin/subscription/update-user-subscription',
    CREATE_USER_SUBSCRIPTION: '/admin/subscription/user/create-a-subscription',
    CREATE_USER_SUBSCRIPTION_WITHOUT_CARD: '/admin/subscription/user/create-a-subscription/without-card',
  },
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
