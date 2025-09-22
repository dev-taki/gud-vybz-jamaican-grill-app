import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '../../services/authService';
import { LoginData, SignupData, UserProfile } from '../../types';

// State interface
interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  token: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { dispatch, rejectWithValue }) => {
    try {
      const response = await AuthService.login(data);
      AuthService.setAuthToken(response.authToken);
      
      // Set role from response if available
      if (response.role) {
        AuthService.setRole(response.role);
      } else {
        // If role not in response, fetch user profile to get role
        try {
          const profileResponse = await fetch(
            `${AuthService.getApiBaseUrl()}/auth/me?business_id=${AuthService.getBusinessId()}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${response.authToken}`,
              },
            }
          );
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.role) {
              AuthService.setRole(profileData.role);
            }
          }
        } catch (profileError) {
          console.error('Failed to fetch profile for role:', profileError);
        }
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (data: SignupData, { dispatch, rejectWithValue }) => {
    try {
      const response = await AuthService.signup(data);
      AuthService.setAuthToken(response.authToken);
      
      // Set role from response if available
      if (response.role) {
        AuthService.setRole(response.role);
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Signup failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = AuthService.getAuthToken();
      
      if (!token) {
        throw new Error('No token found');
      }
      
      console.log('Fetching user profile with token:', token ? `${token.substring(0, 10)}...` : 'null');
      console.log('API URL:', `${AuthService.getApiBaseUrl()}/auth/me?business_id=${AuthService.getBusinessId()}`);
      console.log('Business ID:', AuthService.getBusinessId());
      
      // Make actual API call to auth/me
      const response = await fetch(
        `${AuthService.getApiBaseUrl()}/auth/me?business_id=${AuthService.getBusinessId()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Profile API response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profileData = await response.json();
      console.log('Profile data received:', profileData);
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch profile');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
    } catch (error) {
      // Even if logout API fails, we should still clear local data
      AuthService.removeAuthToken();
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { dispatch, rejectWithValue }) => {
    const token = AuthService.getAuthToken();
    const role = AuthService.getRole();
    
    if (token) {
      try {
        // Return basic user info from cookies instead of API call
        const profile = {
          id: 0,
          name: '',
          email: '',
          role: role || 'customer',
          created_at: Date.now(),
          square_customer_id: ''
        };
        dispatch(updateUser(profile));
        return profile;
      } catch (error) {
        // Token is invalid, remove it
        AuthService.removeAuthToken();
        return rejectWithValue('Invalid token');
      }
    }
    return rejectWithValue('No token found');
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.authToken;
        // Set user data from login response
        state.user = {
          id: action.payload.user?.id || 0,
          name: action.payload.user?.name || action.payload.name || '',
          email: action.payload.user?.email || action.payload.email || '',
          role: AuthService.getRole() || 'customer',
          created_at: Date.now(),
          square_customer_id: ''
        };
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.authToken;
        // Set user data from signup response
        state.user = {
          id: action.payload.user?.id || 0,
          name: action.payload.user?.name || action.payload.name || '',
          email: action.payload.user?.email || action.payload.email || '',
          role: AuthService.getRole() || 'customer',
          created_at: Date.now(),
          square_customer_id: ''
        };
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, updateUser, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
