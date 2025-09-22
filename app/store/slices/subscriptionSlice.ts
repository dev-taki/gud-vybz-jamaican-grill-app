import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionService } from '../../services/subscriptionService';
import { UserSubscription } from '../../types';

// State interface
interface SubscriptionState {
  userSubscriptions: UserSubscription[];
  currentSubscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SubscriptionState = {
  userSubscriptions: [],
  currentSubscription: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserSubscriptions = createAsyncThunk(
  'subscription/fetchUserSubscriptions',
  async (businessId: string | undefined, { rejectWithValue }) => {
    try {
      const subscriptions = await SubscriptionService.getUserSubscriptions(businessId);
      return subscriptions;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch subscriptions');
    }
  }
);

export const fetchSubscriptionById = createAsyncThunk(
  'subscription/fetchSubscriptionById',
  async (subscriptionId: string, { rejectWithValue }) => {
    try {
      const subscription = await SubscriptionService.getSubscriptionById(subscriptionId);
      return subscription;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch subscription');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async (subscriptionId: string, { rejectWithValue }) => {
    try {
      await SubscriptionService.cancelSubscription(subscriptionId);
      return subscriptionId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to cancel subscription');
    }
  }
);

export const updateSubscription = createAsyncThunk(
  'subscription/updateSubscription',
  async ({ subscriptionId, data }: { subscriptionId: string; data: Partial<UserSubscription> }, { rejectWithValue }) => {
    try {
      const updatedSubscription = await SubscriptionService.updateSubscription(subscriptionId, data);
      return updatedSubscription;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update subscription');
    }
  }
);

// Slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptions: (state) => {
      state.userSubscriptions = [];
      state.currentSubscription = null;
      state.error = null;
    },
    clearSubscriptionError: (state) => {
      state.error = null;
    },
    setCurrentSubscription: (state, action: PayloadAction<UserSubscription>) => {
      state.currentSubscription = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Subscriptions
      .addCase(fetchUserSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscriptions.fulfilled, (state, action: PayloadAction<UserSubscription[]>) => {
        state.loading = false;
        state.userSubscriptions = action.payload;
        // Set first subscription as current if none is set
        if (action.payload.length > 0 && !state.currentSubscription) {
          state.currentSubscription = action.payload[0];
        }
      })
      .addCase(fetchUserSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Subscription by ID
      .addCase(fetchSubscriptionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionById.fulfilled, (state, action: PayloadAction<UserSubscription>) => {
        state.loading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(fetchSubscriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel Subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // Update the subscription status in the list
        const subscriptionIndex = state.userSubscriptions.findIndex(
          sub => sub.id.toString() === action.payload
        );
        if (subscriptionIndex !== -1) {
          state.userSubscriptions[subscriptionIndex].status = 'CANCELLED';
        }
        // Update current subscription if it's the one being cancelled
        if (state.currentSubscription?.id.toString() === action.payload) {
          state.currentSubscription.status = 'CANCELLED';
        }
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Subscription
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action: PayloadAction<UserSubscription>) => {
        state.loading = false;
        // Update subscription in the list
        const subscriptionIndex = state.userSubscriptions.findIndex(
          sub => sub.id === action.payload.id
        );
        if (subscriptionIndex !== -1) {
          state.userSubscriptions[subscriptionIndex] = action.payload;
        }
        // Update current subscription if it's the one being updated
        if (state.currentSubscription?.id === action.payload.id) {
          state.currentSubscription = action.payload;
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearSubscriptions, 
  clearSubscriptionError, 
  setCurrentSubscription 
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
