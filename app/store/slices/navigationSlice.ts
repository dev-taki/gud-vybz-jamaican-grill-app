import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NavigationState } from '../../types';

// Initial state
const initialState: NavigationState = {
  currentPage: '/',
  sidebarOpen: false,
  activeTab: 'plans',
};

// Slice
const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'plans' | 'schedule' | 'profile'>) => {
      state.activeTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    resetNavigation: (state) => {
      state.currentPage = '/';
      state.sidebarOpen = false;
      state.activeTab = 'plans';
    },
  },
});

export const { 
  setCurrentPage, 
  setActiveTab,
  toggleSidebar, 
  openSidebar, 
  closeSidebar, 
  resetNavigation 
} = navigationSlice.actions;

export default navigationSlice.reducer;
