'use client';

import { useEffect } from 'react';
import { Plus, Calendar, CreditCard, Users, Home, Gift, User, Clock } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { useRouter } from 'next/navigation';
import { fetchUserSubscriptions } from '../../store/slices/subscriptionSlice';
import { AuthService } from '../../services/authService';
import { Logo } from '../../components/Logo';
import PWAInstall from '../../components/PWAInstall';
import { COLORS } from '../../config/colors';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userSubscriptions, loading: subscriptionsLoading } = useAppSelector((state) => state.subscription);

  const BUSINESS_ID = 'a6739f04-8b60-4f6d-bae8-a705f8e79dbe';

  useEffect(() => {
    // Check authentication first
    const token = AuthService.getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    dispatch(fetchUserSubscriptions(BUSINESS_ID));
  }, [dispatch, router]);



  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.secondary }}>
      {/* Full Width Welcome Banner */}
      <div className="w-full p-6 relative overflow-hidden animate-gradient-flow rounded-b-3xl border-b-4" style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text, borderColor: COLORS.success.text }}>
        {/* Animated Floral Watermark Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-16 h-16 animate-float-slow">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full animate-spin-slow">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="absolute top-8 right-8 w-12 h-12 animate-float-medium">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full animate-pulse">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="absolute bottom-6 left-12 w-10 h-10 animate-float-fast">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full animate-bounce-slow">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="absolute bottom-8 right-6 w-14 h-14 animate-float-slow">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full animate-spin-reverse">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 animate-float-medium">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full animate-spin-slow">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="absolute top-1/3 right-1/3 w-6 h-6 animate-float-fast">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full animate-pulse">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div className="max-w-md mx-auto text-center relative z-10">
          <div className="mb-4">
            <Logo variant="default" color="white" size="lg" className="mb-4" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.success.text }}>Welcome Back, {user?.name || 'Adventurer'}!</h1>
          <p style={{ color: COLORS.success.text, opacity: 0.8 }}>Ready to continue your adventure?</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6 pb-24">

        {/* Active Subscriptions */}
        {userSubscriptions && userSubscriptions.length > 0 && (
          <div className="rounded-xl p-6 shadow-sm border mb-6" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text.primary }}>Your Active Subscriptions</h2>
            <div className="space-y-4">
              {userSubscriptions
                .filter(sub => sub.status === 'ACTIVE')
                .map((subscription) => (
                  <div key={subscription.id} className="rounded-xl p-4 border" style={{ backgroundColor: '#DCFCE7', borderColor: COLORS.success.main }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
                          <CreditCard className="h-5 w-5" style={{ color: COLORS.success.main }} />
                        </div>
                        <div>
                          <h3 className="font-semibold" style={{ color: COLORS.text.primary }}>Active Subscription</h3>
                          <p className="text-sm" style={{ color: COLORS.text.secondary }}>Started {new Date(subscription.start_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: COLORS.success.main, color: COLORS.success.text }}>
                        ACTIVE
                      </span>
                    </div>
                    
                    {/* Credits Display */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="rounded-lg p-3 border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.success.main }}>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" style={{ color: COLORS.success.main }} />
                          <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Subscriber Credits</span>
                        </div>
                        <div className="text-xl font-bold mt-1" style={{ color: COLORS.text.primary }}>{subscription.available_credit}</div>
                      </div>
                      <div className="rounded-lg p-3 border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.success.main }}>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" style={{ color: COLORS.success.main }} />
                          <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Guest Credits</span>
                        </div>
                        <div className="text-xl font-bold mt-1" style={{ color: COLORS.text.primary }}>{subscription.gift_credit}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => router.push('/redeem')}
            className="rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow w-full text-left"
            style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.primary.main}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border.primary}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: COLORS.primary.main }}>
              <Plus className="h-6 w-6" style={{ color: COLORS.success.text }} />
            </div>
            <h3 className="font-semibold mb-1" style={{ color: COLORS.text.primary }}>Redeem</h3>
            <p className="text-sm" style={{ color: COLORS.text.secondary }}>Start a new adventure</p>
          </button>
          
          <button 
            onClick={() => router.push('/plans')}
            className="rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow w-full text-left"
            style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.secondary.main}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border.primary}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: COLORS.secondary.main }}>
              <Calendar className="h-6 w-6" style={{ color: COLORS.success.text }} />
            </div>
            <h3 className="font-semibold mb-1" style={{ color: COLORS.text.primary }}>Available Plans</h3>
            <p className="text-sm" style={{ color: COLORS.text.secondary }}>View subscription plans</p>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl p-4 text-center shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
            <div className="text-2xl font-bold mb-1" style={{ color: COLORS.text.primary }}>
              {userSubscriptions ? userSubscriptions.reduce((total, sub) => total + sub.available_credit + sub.gift_credit, 0) : 0}
            </div>
            <div className="text-xs" style={{ color: COLORS.text.secondary }}>Total Credits</div>
          </div>
          <div className="rounded-xl p-4 text-center shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
            <div className="text-2xl font-bold mb-1" style={{ color: COLORS.text.primary }}>
              {userSubscriptions ? userSubscriptions.reduce((total, sub) => total + sub.available_credit, 0) : 0}
            </div>
            <div className="text-xs" style={{ color: COLORS.text.secondary }}>Subscriber Credits</div>
          </div>
          <div className="rounded-xl p-4 text-center shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
            <div className="text-2xl font-bold mb-1" style={{ color: COLORS.text.primary }}>
              {userSubscriptions ? userSubscriptions.reduce((total, sub) => total + sub.gift_credit, 0) : 0}
            </div>
            <div className="text-xs" style={{ color: COLORS.text.secondary }}>Guest Credits</div>
          </div>
        </div>
      </div>

      {/* PWA Install Prompt - Only show after login */}
      <PWAInstall showAfterAuth={true} />
    </div>
  );
}
