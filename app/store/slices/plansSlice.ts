import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PlansService, SubscriptionPlan, PlanVariation, PlansResponse } from '../../services/plansService';

// State interface
interface PlansState {
  plans: SubscriptionPlan[];
  currentPlan: SubscriptionPlan | null;
  planVariations: PlanVariation[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PlansState = {
  plans: [],
  currentPlan: null,
  planVariations: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const plans = await PlansService.getPlans();
      return plans;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch plans');
    }
  }
);

export const fetchPlanById = createAsyncThunk(
  'plans/fetchPlanById',
  async (planId: string, { rejectWithValue }) => {
    try {
      const plan = await PlansService.getPlanById(planId);
      return plan;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch plan');
    }
  }
);

export const fetchPlanVariations = createAsyncThunk(
  'plans/fetchPlanVariations',
  async (planId: string, { rejectWithValue }) => {
    try {
      const variations = await PlansService.getPlanVariations(planId);
      return variations;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch plan variations');
    }
  }
);

export const subscribeToPlan = createAsyncThunk(
  'plans/subscribeToPlan',
  async ({ planVariationId, paymentData }: { planVariationId: string; paymentData: any }, { rejectWithValue }) => {
    try {
      const result = await PlansService.subscribeToPlan(planVariationId, paymentData);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to subscribe to plan');
    }
  }
);

// Slice
const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearPlans: (state) => {
      state.plans = [];
      state.currentPlan = null;
      state.planVariations = [];
      state.error = null;
    },
    clearPlansError: (state) => {
      state.error = null;
    },
    setCurrentPlan: (state, action: PayloadAction<SubscriptionPlan>) => {
      state.currentPlan = action.payload;
    },
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action: PayloadAction<PlansResponse>) => {
        state.loading = false;
        state.plans = action.payload.subscription_plans;
        state.planVariations = action.payload.plan_variations;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Plan by ID
      .addCase(fetchPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action: PayloadAction<SubscriptionPlan>) => {
        state.loading = false;
        state.currentPlan = action.payload;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Plan Variations
      .addCase(fetchPlanVariations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanVariations.fulfilled, (state, action: PayloadAction<PlanVariation[]>) => {
        state.loading = false;
        state.planVariations = action.payload;
      })
      .addCase(fetchPlanVariations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Subscribe to Plan
      .addCase(subscribeToPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToPlan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(subscribeToPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearPlans, 
  clearPlansError, 
  setCurrentPlan, 
  clearCurrentPlan 
} = plansSlice.actions;

export default plansSlice.reducer;
