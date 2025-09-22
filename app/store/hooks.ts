import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import type { NavigationState } from '../types';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for specific slices
export const useAuth = () => useAppSelector((state) => state.auth);
export const useUser = () => useAppSelector((state) => state.user);
export const useNavigation = () => useAppSelector((state) => state.navigation) as NavigationState;
export const useSubscription = () => useAppSelector((state) => state.subscription);
export const usePlans = () => useAppSelector((state) => state.plans);
export const useAdmin = () => useAppSelector((state) => state.admin);
