import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '../../services/authService';
import { UserProfile, UserPreferences, UserStats } from '../../types';
import { COLORS } from '../../config/colors';

// State interface
interface UserState {
  preferences: UserPreferences;
  stats: UserStats;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  preferences: {
    theme: 'light', // Default theme - no localStorage dependency
    notifications: true,
  },
  stats: {
    totalQuests: 0,
    completedQuests: 0,
    successRate: 0,
  },
  loading: false,
  error: null,
};

// Async thunks
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const updatedProfile = await AuthService.updateUserProfile(data);
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'user/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      // This would be replaced with actual API call to fetch user stats
      const stats: UserStats = {
        totalQuests: 12,
        completedQuests: 10,
        successRate: 85,
      };
      return stats;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch stats');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.preferences.theme = action.payload;
      // No localStorage - theme is managed through centralized color system
    },
    toggleNotifications: (state) => {
      state.preferences.notifications = !state.preferences.notifications;
      // No localStorage dependency
    },
    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
      // No localStorage dependency
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setTheme, 
  toggleNotifications, 
  updateStats, 
  setPreferences, 
  clearUserError 
} = userSlice.actions;

export default userSlice.reducer;
