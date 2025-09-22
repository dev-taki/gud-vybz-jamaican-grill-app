'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, Star, Calendar, Gift, User, Home, Clock } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { PlansService, SubscriptionPlan, PlanVariation } from '../../services/plansService';
import { showToast } from '../../utils/toast';
import { AuthService } from '../../services/authService';
import SquarePaymentForm from '../../components/SquarePaymentForm';
import { fetchUserSubscriptions } from '../../store/slices/subscriptionSlice';
import { COLORS } from '../../config/colors';

export default function PlansPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userSubscriptions } = useAppSelector((state) => state.subscription);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [planVariations, setPlanVariations] = useState<PlanVariation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<PlanVariation | null>(null);

  const BUSINESS_ID = AuthService.getBusinessId();

  useEffect(() => {
    // Check authentication first
    const token = AuthService.getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    fetchPlans();
    dispatch(fetchUserSubscriptions(BUSINESS_ID));
  }, [dispatch, router, BUSINESS_ID]);

  // Refresh data when component becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        dispatch(fetchUserSubscriptions(BUSINESS_ID));
      }
    };

    const handleFocus = () => {
      dispatch(fetchUserSubscriptions(BUSINESS_ID));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch, BUSINESS_ID]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await PlansService.getPlans();
      setPlans(response.subscription_plans);
      setPlanVariations(response.plan_variations);
    } catch (error) {
      console.error('Error fetching plans:', error);
      showToast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const getPlanVariations = (planId: string): PlanVariation[] => {
    return planVariations.filter(v => v.plan_id === planId);
  };

  const hasActiveSubscription = () => {
    return userSubscriptions.some(sub => sub.status === 'ACTIVE');
  };

  const handleSubscribe = (variation: PlanVariation) => {
    if (hasActiveSubscription()) {
      showToast.error('You already have an active subscription. Please cancel your current subscription before subscribing to a new plan.');
      return;
    }
    setSelectedVariation(variation);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (cardId: string) => {
    setShowPaymentForm(false);
    setSelectedVariation(null);
    showToast.success('Subscription created successfully!');
    
    // Refresh subscription data immediately
    try {
      await dispatch(fetchUserSubscriptions(BUSINESS_ID));
    } catch (error) {
      console.error('Error refreshing subscriptions:', error);
    }
  };

  const handlePaymentError = (error: string) => {
    showToast.error(error);
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setSelectedVariation(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primary.main }}></div>
      </div>
    );
  }

    return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.secondary }}>
      {/* Main Content */}
      <div className="pb-20">
        <div className="p-6 space-y-6">

        {/* Active Subscription Warning */}
        {hasActiveSubscription() && (
          <div className="mb-6 p-6 rounded-xl shadow-sm border" style={{ backgroundColor: '#FEF3C7', borderColor: COLORS.warning.main }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.warning.main }}>
                  <CreditCard className="h-5 w-5" style={{ color: '#FFFFFF' }} />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold" style={{ color: '#D97706' }}>
                  Active Subscription Detected
                </h3>
                <p className="mt-1" style={{ color: '#D97706' }}>
                  You already have an active subscription. Please cancel your current subscription before subscribing to a new plan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plans with Variations */}
        {plans.length > 0 && (
          <div className="space-y-8">
            {plans.map((plan, planIndex) => (
              <div key={plan.object_id} className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
                {/* Plan Header */}
                <div className="p-8 relative overflow-hidden" style={{ backgroundColor: planIndex % 2 === 0 ? COLORS.primary.main : COLORS.secondary.main }}>
                  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-3xl font-bold" style={{ color: planIndex % 2 === 0 ? COLORS.success.text : COLORS.success.text }}>{plan.name}</h2>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <Star className="h-6 w-6" style={{ color: planIndex % 2 === 0 ? COLORS.success.text : COLORS.success.text }} />
                      </div>
                    </div>
                    <p className="text-lg" style={{ color: planIndex % 2 === 0 ? COLORS.success.text : COLORS.success.text, opacity: 0.9 }}>
                      {getPlanVariations(plan.object_id).length} variation{getPlanVariations(plan.object_id).length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>

                {/* Plan Variations */}
                <div className="p-6 space-y-4">
                  {getPlanVariations(plan.object_id).map((variation, index) => (
                    <div
                      key={`${plan.object_id}-${variation.object_id}-${index}`}
                      className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 border"
                      style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}
                    >
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                            {variation.name}
                          </h3>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.secondary.main }}>
                            <Calendar className="h-4 w-4" style={{ color: COLORS.success.text }} />
                          </div>
                        </div>
                        
                        {/* Plan Variation Image - Only show if image_link exists */}
                        {variation.image_link && (
                          <div className="mb-4">
                            <Image
                              src={variation.image_link}
                              alt={`${variation.name} plan image`}
                              width={400}
                              height={192}
                              className="w-full h-48 object-cover rounded-xl border"
                              style={{ borderColor: COLORS.border.primary }}
                              onError={(e) => {
                                // Hide image if it fails to load
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Price and Billing Info */}
                        <div className="rounded-xl p-5 mb-4 border" style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.border.primary }}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Monthly Price:</span>
                            <span className="text-2xl font-bold" style={{ color: COLORS.primary.main }}>${(variation.amount / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Billing Cycle:</span>
                            <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.secondary.main, color: COLORS.success.text }}>{variation.cadence.toLowerCase()}</span>
                          </div>
                          {/* <div className="flex items-center justify-between">
                            <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Credits per Month:</span>
                            <span className="text-lg font-bold" style={{ color: COLORS.accent.green }}>{variation.credit} credits</span>
                          </div> */}
                        </div>


                      </div>

                      {variation.description && (
                        <div 
                          className="plan-description mb-4"
                          style={{ color: COLORS.text.secondary }}
                          dangerouslySetInnerHTML={{ __html: variation.description }}
                        />
                      )}

                      {/* Subscribe Button */}
                      <button
                        onClick={() => handleSubscribe(variation)}
                        disabled={hasActiveSubscription()}
                        className="w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: hasActiveSubscription() ? COLORS.primary.disabled : COLORS.primary.main,
                          color: hasActiveSubscription() ? COLORS.text.secondary : COLORS.success.text,
                          cursor: hasActiveSubscription() ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          if (!hasActiveSubscription()) {
                            e.currentTarget.style.backgroundColor = COLORS.primary.hover;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!hasActiveSubscription()) {
                            e.currentTarget.style.backgroundColor = COLORS.primary.main;
                          }
                        }}
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        {hasActiveSubscription() ? 'Already Subscribed' : 'Subscribe Now'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Plans Available */}
        {plans.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: COLORS.border.light }}>
              <CreditCard className="h-10 w-10" style={{ color: COLORS.text.secondary }} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: COLORS.text.primary }}>No Plans Available</h3>
            <p className="text-lg" style={{ color: COLORS.text.secondary }}>Check back later for subscription plans</p>
          </div>
        )}
        </div>
      </div>

      {/* Payment Form Modal - Higher Priority */}
      {showPaymentForm && selectedVariation && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.light }}>
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: COLORS.primary.main }}>
                    <CreditCard className="h-5 w-5" style={{ color: COLORS.success.text }} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                    Subscribe to {selectedVariation.name}
                  </h3>
                </div>
                <button
                  onClick={handlePaymentCancel}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: COLORS.text.secondary }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.border.light}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6 p-5 rounded-xl border" style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.border.primary }}>
                <div className="text-sm" style={{ color: COLORS.text.secondary }}>
                  <div className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>Plan Details:</div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Price:</span>
                    <span className="font-bold" style={{ color: COLORS.primary.main }}>${(selectedVariation.amount / 100).toFixed(2)}/{selectedVariation.cadence.toLowerCase()}</span>
                  </div>
                  {selectedVariation.credit > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Credits:</span>
                      <span className="font-bold" style={{ color: COLORS.secondary.main }}>{selectedVariation.credit} per {selectedVariation.cadence.toLowerCase()}</span>
                    </div>
                  )}
                </div>
              </div>

              <SquarePaymentForm
                planVariationId={selectedVariation.object_id}
                amount={selectedVariation.amount || 0}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
