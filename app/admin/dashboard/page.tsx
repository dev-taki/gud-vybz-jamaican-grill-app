'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, Settings, BarChart3, Gift, DollarSign, User } from 'lucide-react';
import { AdminAuthService } from '../../services/adminAuthService';
import { AuthService } from '../../services/authService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllUserSubscriptions } from '../../store/slices/adminSlice';
import { fetchUserProfile } from '../../store/slices/authSlice';
import AdminBottomNav from '../../components/AdminBottomNav';
import PWAInstall from '../../components/PWAInstall';
import { CardLoader } from '../../components/common/Loader';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { COLORS } from '../../config/colors';

export default function AdminDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  
  // Redux state
  const { userSubscriptions, loading: subscriptionsLoading, error } = useAppSelector((state) => state.admin);
  const { user } = useAppSelector((state) => state.auth);

  const BUSINESS_ID = AuthService.getBusinessId();

  useEffect(() => {
    if (!AdminAuthService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!AdminAuthService.hasAdminRole()) {
      AdminAuthService.removeAuthToken();
      router.push('/login');
      return;
    }

    // Load subscription data via Redux
    dispatch(fetchAllUserSubscriptions());
    dispatch(fetchUserProfile());
    setLoading(false);
  }, [router, dispatch]);

  // Calculate subscription statistics from Redux state
  const subscriptionStats = {
    totalUsers: userSubscriptions.length,
    totalAmount: userSubscriptions.reduce((sum, subscription) => {
      return sum + (subscription.subscription_amount || 0);
    }, 0)
  };



  if (loading || subscriptionsLoading) {
    return <CardLoader text="Loading dashboard..." />;
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
      <main className="p-4 pb-24">
        {/* Centered Title */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-center mb-4">
            <h1 className="text-3xl font-bold" style={{ color: COLORS.text.primary }}>Admin Dashboard</h1>
          </div>
          <p className="text-sm" style={{ color: COLORS.text.secondary }}>Vendor Management</p>
        </div>

        {/* Statistics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.text.primary }}>Subscription Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
              <div>
                <p className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Subscribers</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.primary.main }}>{subscriptionStats.totalUsers}</p>
              </div>
            </div>

            <div className="rounded-xl p-4 shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
              <div>
                <p className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Revenue</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.success.main }}>
                  ${(subscriptionStats.totalAmount / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.text.primary }}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => router.push('/admin/users')}
              className="rounded-xl shadow-sm p-4 border hover:shadow-md transition-shadow"
              style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: COLORS.border.light }}>
                  <User className="h-6 w-6" style={{ color: COLORS.primary.main }} />
                </div>
                <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Users</span>
              </div>
            </button>

            <button 
              onClick={() => router.push('/admin/members')}
              className="rounded-xl shadow-sm p-4 border hover:shadow-md transition-shadow"
              style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: COLORS.border.light }}>
                  <Users className="h-6 w-6" style={{ color: COLORS.primary.main }} />
                </div>
                <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Manage Members</span>
              </div>
            </button>

            <button 
              onClick={() => router.push('/admin/redeem')}
              className="rounded-xl shadow-sm p-4 border hover:shadow-md transition-shadow"
              style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: COLORS.border.light }}>
                  <Gift className="h-6 w-6" style={{ color: COLORS.primary.main }} />
                </div>
                <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Redemption</span>
              </div>
            </button>

            <button 
              onClick={() => router.push('/plans')}
              className="rounded-xl shadow-sm p-4 border hover:shadow-md transition-shadow"
              style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: COLORS.border.light }}>
                  <BarChart3 className="h-6 w-6" style={{ color: COLORS.primary.main }} />
                </div>
                <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Client View</span>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <AdminBottomNav />
      <PWAInstall showAfterAuth={true} />
    </div>
  );
}
