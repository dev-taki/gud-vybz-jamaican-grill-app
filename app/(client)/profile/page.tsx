'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, CreditCard, Calendar, Gift, Home, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserProfile, logout } from '../../store/slices/authSlice';
import { CardLoader } from '../../components/common/Loader';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { showToast } from '../../utils/toast';
import { AuthService } from '../../services/authService';
import { COLORS } from '../../config/colors';

export default function ClientProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check authentication first
    const token = AuthService.getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    // Always fetch fresh profile data
    console.log('Fetching user profile...');
    dispatch(fetchUserProfile());
  }, [dispatch, router]);

  // Debug logging
  useEffect(() => {
    console.log('Profile page - user state:', user);
    console.log('Profile page - loading state:', loading);
    console.log('Profile page - error state:', error);
  }, [user, loading, error]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await dispatch(logout());
      showToast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      showToast.error('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <CardLoader text="Loading profile..." />;
  }

  if (!user) {
    return <CardLoader text="Loading profile..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background.secondary }}>
        <ErrorDisplay error={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.secondary }}>
      {/* Main Content */}
      <div className="p-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.primary.main }}>
              <User className="h-10 w-10" style={{ color: COLORS.success.text }} />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.text.primary }}>Profile</h1>
          <p className="text-sm" style={{ color: COLORS.text.secondary }}>Manage your account</p>
        </div>

        {/* User Info Card */}
        <div className="rounded-xl p-6 shadow-sm border mb-6" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.text.primary }}>Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Name</label>
              <p className="mt-1" style={{ color: COLORS.text.primary }}>{user.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Email</label>
              <p className="mt-1" style={{ color: COLORS.text.primary }}>{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Role</label>
              <p className="mt-1 capitalize" style={{ color: COLORS.text.primary }}>{user.role || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>Quick Actions</h3>
          
          <button
            onClick={() => router.push('/plans')}
            className="w-full rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow flex items-center justify-between"
            style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-4" style={{ backgroundColor: COLORS.border.light }}>
                <CreditCard className="h-6 w-6" style={{ color: COLORS.primary.main }} />
              </div>
              <div className="text-left">
                <p className="font-medium" style={{ color: COLORS.text.primary }}>Subscription Plans</p>
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>View and manage your subscriptions</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/redeem')}
            className="w-full rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow flex items-center justify-between"
            style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-4" style={{ backgroundColor: COLORS.border.light }}>
                <Calendar className="h-6 w-6" style={{ color: COLORS.success.main }} />
              </div>
              <div className="text-left">
                <p className="font-medium" style={{ color: COLORS.text.primary }}>Redeem Items</p>
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>Use your credits to redeem rewards</p>
              </div>
            </div>
          </button>
        </div>

        {/* Account Actions */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>Account</h3>
          
          <button
            onClick={() => router.push('/settings')}
            className="w-full rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow flex items-center justify-between"
            style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-4" style={{ backgroundColor: COLORS.border.light }}>
                <Settings className="h-6 w-6" style={{ color: COLORS.text.secondary }} />
              </div>
              <div className="text-left">
                <p className="font-medium" style={{ color: COLORS.text.primary }}>Settings</p>
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>Manage your preferences</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow flex items-center justify-between"
            style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.error.main }}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-4" style={{ backgroundColor: COLORS.border.light }}>
                <LogOut className="h-6 w-6" style={{ color: COLORS.error.main }} />
              </div>
              <div className="text-left">
                <p className="font-medium" style={{ color: COLORS.error.main }}>Logout</p>
                <p className="text-sm" style={{ color: COLORS.error.main }}>Sign out of your account</p>
              </div>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}
