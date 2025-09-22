import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminService, AdminUser, AdminUserSubscription } from '../../services/adminService';

// State interface
interface AdminState {
  users: AdminUser[];
  userSubscriptions: AdminUserSubscription[];
  redeemItems: any[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AdminState = {
  users: [],
  userSubscriptions: [],
  redeemItems: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await AdminService.getAllUsers();
      return users;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }
);

export const fetchAllUserSubscriptions = createAsyncThunk(
  'admin/fetchAllUserSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const subscriptions = await AdminService.getAllUserSubscriptions();
      return subscriptions;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user subscriptions');
    }
  }
);

export const updateUserSubscription = createAsyncThunk(
  'admin/updateUserSubscription',
  async ({ subscriptionId, data }: { subscriptionId: string; data: Partial<AdminUserSubscription> }, { rejectWithValue }) => {
    try {
      const updatedSubscription = await AdminService.updateUserSubscription(subscriptionId, data);
      return updatedSubscription;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update subscription');
    }
  }
);

export const createUserSubscription = createAsyncThunk(
  'admin/createUserSubscription',
  async (data: { business_id: string; user_id: string; plan_variation_id: string; card_id?: string }, { rejectWithValue }) => {
    try {
      const result = await AdminService.createUserSubscription(data);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create subscription');
    }
  }
);

export const getAllRedeemItems = createAsyncThunk(
  'admin/getAllRedeemItems',
  async (_, { rejectWithValue }) => {
    try {
      const redeemItems = await AdminService.getAllRedeemItems();
      return redeemItems;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch redeem items');
    }
  }
);

export const updateRedeemItem = createAsyncThunk(
  'admin/updateRedeemItem',
  async (data: { business_id: string; order_id: string; status?: string }, { rejectWithValue }) => {
    try {
      const result = await AdminService.updateRedeemItem(data.order_id, data);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update redeem item');
    }
  }
);

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearAdminData: (state) => {
      state.users = [];
      state.userSubscriptions = [];
      state.redeemItems = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<AdminUser[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All User Subscriptions
      .addCase(fetchAllUserSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUserSubscriptions.fulfilled, (state, action: PayloadAction<AdminUserSubscription[]>) => {
        state.loading = false;
        state.userSubscriptions = action.payload;
      })
      .addCase(fetchAllUserSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update User Subscription
      .addCase(updateUserSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserSubscription.fulfilled, (state, action: PayloadAction<AdminUserSubscription>) => {
        state.loading = false;
        // Update the subscription in the list
        const index = state.userSubscriptions.findIndex(sub => sub.id === action.payload.id);
        if (index !== -1) {
          state.userSubscriptions[index] = action.payload;
        }
      })
      .addCase(updateUserSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create User Subscription
      .addCase(createUserSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserSubscription.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUserSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get All Redeem Items
      .addCase(getAllRedeemItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRedeemItems.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.redeemItems = action.payload;
      })
      .addCase(getAllRedeemItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Redeem Item
      .addCase(updateRedeemItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRedeemItem.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Update the redeem item in the list
        const index = state.redeemItems.findIndex(item => item.order_id === action.payload.order_id);
        if (index !== -1) {
          state.redeemItems[index] = action.payload;
        }
      })
      .addCase(updateRedeemItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminError, clearAdminData } = adminSlice.actions;
export default adminSlice.reducer;
