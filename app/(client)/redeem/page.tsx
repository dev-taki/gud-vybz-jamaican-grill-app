'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Plus, Calendar, Clock, AlertCircle, User, Home } from 'lucide-react';

import { RedeemService, RedeemItem, AddRedeemData } from '../../services/redeemService';
import { AuthService } from '../../services/authService';
import { CardLoader, InlineLoader, ButtonLoader } from '../../components/common/Loader';
import { showToast } from '../../utils/toast';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchUserSubscriptions } from '../../store/slices/subscriptionSlice';
import { COLORS } from '../../config/colors';

export default function RedeemPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userSubscriptions } = useAppSelector((state) => state.subscription);
  const { user } = useAppSelector((state) => state.auth);
  const BUSINESS_ID = AuthService.getBusinessId();
  
  const [loading, setLoading] = useState(true);
  const [redeemItems, setRedeemItems] = useState<RedeemItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [redeemType, setRedeemType] = useState<'normal' | null>(null);
  const [updatingCredits, setUpdatingCredits] = useState(false);

  const observer = useRef<IntersectionObserver | undefined>(undefined);
  
  const loadMoreRedeemItems = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await RedeemService.getRedeemItems(nextPage, 5);
      
      if (data.length > 0) {
        setRedeemItems(prev => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(data.length === 5);
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      console.error('Error loading more redeem items:', error);
      showToast.error(error.message || 'Failed to load more redeem items');
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);
  
  const lastRedeemElementRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreRedeemItems();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore, loadMoreRedeemItems]);

  useEffect(() => {
    // Check authentication first
    const token = AuthService.getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    fetchRedeemItems();
    dispatch(fetchUserSubscriptions(BUSINESS_ID));
  }, [dispatch, router, BUSINESS_ID]);

  const fetchRedeemItems = async () => {
    try {
      setLoading(true);
      const data = await RedeemService.getRedeemItems(0, 5);
      setRedeemItems(data);
      setPage(0);
      setHasMore(data.length === 5);
    } catch (error: any) {
      console.error('Error fetching redeem items:', error);
      showToast.error(error.message || 'Failed to load redeem items');
    } finally {
      setLoading(false);
    }
  };


  const getTotalCredits = useCallback(() => {
    return userSubscriptions.reduce((total, sub) => total + sub.available_credit, 0);
  }, [userSubscriptions]);

  const canRedeem = () => {
    return getTotalCredits() > 0;
  };

  const canRedeemNormal = useCallback(() => {
    return getTotalCredits() > 0;
  }, [getTotalCredits]);

  // Clear redeem type selection when credits become 0
  useEffect(() => {
    if (redeemType === 'normal' && !canRedeemNormal()) {
      setRedeemType(null);
    }
  }, [redeemType, canRedeemNormal]);

  const handleAddRedeem = async () => {
    if (!canRedeem()) {
      showToast.error('You need credits to create a redeem request');
      return;
    }
    
    setSubmitting(true);

    try {
      const redeemData: AddRedeemData = {
        business_id: BUSINESS_ID,
        button_number: 1 // Always use button 1 for normal redemption
      };

      await RedeemService.addRedeem(redeemData);
      
      showToast.success('Redeem request created successfully!');
      
      // Reset form and refresh data
      setRedeemType(null);
      setShowAddForm(false);
      
      // Refresh both redeem items and subscription data to update credit balances
      setUpdatingCredits(true);
      await Promise.all([
        fetchRedeemItems(),
        dispatch(fetchUserSubscriptions(BUSINESS_ID))
      ]);
    } catch (error: any) {
      showToast.error(error.message || 'Failed to add redeem item');
    } finally {
      setSubmitting(false);
      setUpdatingCredits(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background.secondary }}>
        <CardLoader text="Loading redeem items..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.secondary }}>
      {/* Main Content */}
      <div className="pb-20">
        <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.text.primary }}>Redeem</h1>
          <p style={{ color: COLORS.text.secondary }}>Redeem your credits for rewards and services</p>
        </div>

        {/* Credit Balance Display */}
        <div className="flex justify-center mb-6">
          <div className="rounded-xl p-6 shadow-sm border max-w-sm w-full" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.primary.main }}>
                <CreditCard className="h-6 w-6" style={{ color: COLORS.success.text }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>Available Credits</h3>
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>Your subscription credits</p>
              </div>
            </div>
            <div className="text-center">
              {updatingCredits ? (
                <div className="text-3xl font-bold animate-pulse" style={{ color: COLORS.primary.main }}>...</div>
              ) : (
                <div className={`text-3xl font-bold ${getTotalCredits() === 0 ? 'text-red-500' : ''}`} style={{ color: getTotalCredits() === 0 ? COLORS.error.main : COLORS.primary.main }}>
                  {getTotalCredits()}
                </div>
              )}
              <div className="text-sm mt-1" style={{ color: COLORS.text.secondary }}>credits available</div>
              {getTotalCredits() === 0 && (
                <div className="text-sm mt-2" style={{ color: COLORS.error.main }}>No credits available for redemption</div>
              )}
            </div>
          </div>
        </div>

        {/* Add Redeem Button */}
        <div className="flex justify-center">
          {canRedeem() ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 rounded-xl font-medium transition-colors flex items-center"
              style={{ 
                backgroundColor: COLORS.primary.main, 
                color: COLORS.success.text 
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
            >
              <Plus className="h-5 w-5 mr-2" />
              New Redeem Request
            </button>
          ) : (
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.warning.main, border: '1px solid' }}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5" style={{ color: COLORS.warning.main }} />
                <span className="font-medium" style={{ color: COLORS.warning.main }}>No Credits Available</span>
              </div>
              <p className="text-sm" style={{ color: COLORS.warning.main }}>You need subscription credits to create redeem requests. Please check your subscription plans.</p>
            </div>
          )}
        </div>



        {/* Redeem Items List */}
        <div className="space-y-4">
          {redeemItems.length === 0 ? (
            <div className="rounded-xl p-8 text-center shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
              <CreditCard className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.text.secondary }} />
              <h3 className="text-xl font-medium mb-2" style={{ color: COLORS.text.primary }}>No Redeem Requests</h3>
              <p style={{ color: COLORS.text.secondary }}>Start by creating your first redeem request.</p>
            </div>
          ) : (
            redeemItems.map((item, index) => (
              <div
                key={item.id}
                ref={index === redeemItems.length - 1 ? lastRedeemElementRef : null}
                className="rounded-xl p-6 shadow-sm border"
                style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5" style={{ color: COLORS.primary.main }} />
                    <h3 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
                      Redeem Request #{item.id}
                    </h3>
                  </div>

                  {/* Order ID */}
                  <div className="text-sm">
                    <span style={{ color: COLORS.text.secondary }}>Order ID:</span>
                    <span className="ml-2 font-mono" style={{ color: COLORS.text.primary }}>{item.order_id}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-sm" style={{ color: COLORS.text.secondary }}>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>

                  {/* Credits Used */}
                  {item.charged_credit > 0 && (
                    <div className="flex items-center text-sm" style={{ color: COLORS.text.secondary }}>
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Credits Used: {item.charged_credit}</span>
                    </div>
                  )}

                  {/* Plan Variation */}
                  <div className="flex items-center text-sm" style={{ color: COLORS.text.secondary }}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>{item.plan_variation_name}</span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="flex justify-center py-4">
              <InlineLoader size="md" />
            </div>
          )}
        </div>

        {/* Add Redeem Modal */}
        {showAddForm && (
          <div className="fixed inset-0 flex items-center justify-center p-4 pb-12 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.background.primary }}>
              <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: COLORS.border.primary }}>
                <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>New Redeem Request</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 transition-colors"
                  style={{ color: COLORS.text.secondary }}
                  onMouseEnter={(e) => e.currentTarget.style.color = COLORS.text.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = COLORS.text.secondary}
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.primary.main}1A` }}>
                    <CreditCard className="h-8 w-8" style={{ color: COLORS.primary.main }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text.primary }}>Create Redeem Request</h3>
                  <p style={{ color: COLORS.text.secondary }}>Use your available credits to create a redeem request.</p>
                </div>

                {/* Credit Information */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: COLORS.background.secondary }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: COLORS.text.secondary }}>Available Credits:</span>
                    <span className="text-lg font-semibold" style={{ color: COLORS.primary.main }}>{getTotalCredits()}</span>
                  </div>
                </div>

                {/* Warning message when no credits are available */}
                {!canRedeem() && (
                  <div className="border rounded-lg p-3 mb-4" style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.warning.main }}>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" style={{ color: COLORS.warning.main }} />
                      <span className="text-sm font-medium" style={{ color: COLORS.warning.main }}>No credits available</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: COLORS.warning.main }}>You need subscription credits to create redeem requests. Please check your subscription plans.</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 border py-3 px-4 rounded-xl font-medium transition-colors"
                    style={{ 
                      borderColor: COLORS.border.secondary, 
                      color: COLORS.text.secondary,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.background.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddRedeem}
                    disabled={submitting || !canRedeem()}
                    className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ 
                      backgroundColor: canRedeem() ? COLORS.primary.main : COLORS.primary.disabled, 
                      color: canRedeem() ? COLORS.success.text : COLORS.text.secondary
                    }}
                    onMouseEnter={(e) => {
                      if (canRedeem() && !submitting) {
                        e.currentTarget.style.backgroundColor = COLORS.primary.hover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (canRedeem() && !submitting) {
                        e.currentTarget.style.backgroundColor = COLORS.primary.main;
                      }
                    }}
                  >
                    {submitting ? (
                      <>
                        <ButtonLoader size="sm" />
                        Creating...
                      </>
                    ) : !canRedeem() ? (
                      <>
                        <AlertCircle className="h-5 w-5 mr-2" />
                        No Credits Available
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Create Redeem
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

    </div>
  );
}
