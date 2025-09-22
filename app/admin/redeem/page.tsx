'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AdminAuthService } from '../../services/adminAuthService';
import { AdminService } from '../../services/adminService';
import AdminBottomNav from '../../components/AdminBottomNav';
import AdminHeader from '../../components/AdminHeader';
import { CardLoader, ButtonLoader } from '../../components/common/Loader';
import { showToast } from '../../utils/toast';
import { COLORS } from '../../config/colors';

interface RedemptionRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  item_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  credits_used: number;
}

export default function AdminRedeemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [redemptionRequests, setRedemptionRequests] = useState<RedemptionRequest[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  

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

    fetchRedemptionRequests();
  }, [router]);

  const fetchRedemptionRequests = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getAllRedeemItems();
      setRedemptionRequests(response);
    } catch (error: any) {
      console.error('Error fetching redemption requests:', error);
      showToast.error(error.message || 'Failed to load redemption requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await AdminService.updateRedeemItem(requestId, { status: 'approved' });
      
      // Refresh the list after approval
      await fetchRedemptionRequests();
      showToast.success('Redemption request approved');
    } catch (error: any) {
      showToast.error(error.message || 'Failed to approve request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await AdminService.updateRedeemItem(requestId, { status: 'rejected' });
      
      // Refresh the list after rejection
      await fetchRedemptionRequests();
      showToast.success('Redemption request rejected');
    } catch (error: any) {
      showToast.error(error.message || 'Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return `text-[${COLORS.warning.main}] bg-[${COLORS.warning.main}20]`;
      case 'approved': return `text-[${COLORS.success.main}] bg-[${COLORS.success.main}20]`;
      case 'rejected': return `text-[${COLORS.error.main}] bg-[${COLORS.error.main}20]`;
      default: return `text-[${COLORS.text.secondary}] bg-[${COLORS.border.light}]`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <CardLoader text="Loading redemption requests..." />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.secondary }}>
      {/* Admin Header */}
      <AdminHeader 
        title="Redemption Management" 
        subtitle="Manage user redemption requests"
      />

      {/* Main Content */}
      <main className="p-4 pb-24">

        {/* Statistics */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl p-4 shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
              <div>
                <p className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Pending</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.warning.main }}>
                  {redemptionRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>

            <div className="rounded-xl p-4 shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
              <div>
                <p className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Approved</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.success.main }}>
                  {redemptionRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>

            <div className="rounded-xl p-4 shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
              <div>
                <p className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>Total</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.primary.main }}>
                  {redemptionRequests.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Redemption Requests */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>Redemption Requests</h3>
          
          {redemptionRequests.length === 0 ? (
            <div className="rounded-xl p-8 text-center shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
              <CreditCard className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.text.secondary }} />
              <p style={{ color: COLORS.text.secondary }}>No redemption requests found</p>
            </div>
          ) : (
            redemptionRequests.map((request) => (
              <div key={request.id} className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>{request.item_name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="mb-1" style={{ color: COLORS.text.secondary }}>User</p>
                        <p className="font-medium" style={{ color: COLORS.text.primary }}>{request.user_name}</p>
                        <p style={{ color: COLORS.text.secondary }}>{request.user_email}</p>
                      </div>
                      
                      <div>
                        <p className="mb-1" style={{ color: COLORS.text.secondary }}>Details</p>
                        <p className="font-medium" style={{ color: COLORS.text.primary }}>-</p>
                      </div>
                      
                      <div>
                        <p className="mb-1" style={{ color: COLORS.text.secondary }}>Credits Used</p>
                        <p className="font-medium" style={{ color: COLORS.primary.main }}>{request.credits_used} credits</p>
                      </div>
                      
                      <div>
                        <p className="mb-1" style={{ color: COLORS.text.secondary }}>Requested</p>
                        <p className="font-medium" style={{ color: COLORS.text.primary }}>{formatDate(request.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t" style={{ borderColor: COLORS.border.primary }}>
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={processingId === request.id}
                      className="flex-1 py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: COLORS.success.main, 
                        color: COLORS.success.text 
                      }}
                      onMouseEnter={(e) => {
                        if (processingId !== request.id) {
                          e.currentTarget.style.backgroundColor = COLORS.success.dark;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (processingId !== request.id) {
                          e.currentTarget.style.backgroundColor = COLORS.success.main;
                        }
                      }}
                    >
                      {processingId === request.id ? (
                        <ButtonLoader size="sm" />
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={processingId === request.id}
                      className="flex-1 py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: COLORS.error.main, 
                        color: COLORS.error.text 
                      }}
                      onMouseEnter={(e) => {
                        if (processingId !== request.id) {
                          e.currentTarget.style.backgroundColor = COLORS.error.dark;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (processingId !== request.id) {
                          e.currentTarget.style.backgroundColor = COLORS.error.main;
                        }
                      }}
                    >
                      {processingId === request.id ? (
                        <ButtonLoader size="sm" />
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );
}
