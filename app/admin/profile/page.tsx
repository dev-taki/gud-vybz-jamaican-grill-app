'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, LogOut, Calendar, Settings, Edit, Save, X } from 'lucide-react';
import { AdminAuthService } from '../../services/adminAuthService';
import { AuthService } from '../../services/authService';
import { PageLoader, ButtonLoader } from '../../components/common/Loader';
import AdminBottomNav from '../../components/AdminBottomNav';
import PWAInstall from '../../components/PWAInstall';
import { showToast } from '../../utils/toast';
import { useAdmin, useAppDispatch } from '../../store/hooks';
import { fetchAllUsers, fetchAllUserSubscriptions, getAllRedeemItems, clearAdminError } from '../../store/slices/adminSlice';
import { logout } from '../../store/slices/authSlice';
import { COLORS } from '../../config/colors';

export default function AdminProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { users, userSubscriptions, loading: adminLoading, error: adminError } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(
        `${AuthService.getApiBaseUrl()}/auth/me?business_id=${AuthService.getBusinessId()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch admin profile');
      }

      const profileData = await response.json();
      setAdminProfile(profileData);
      
      // Pre-populate form data
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        password: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error fetching admin profile:', error);
      showToast.error(error.message || 'Failed to load profile');
    }
  };

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

    // Fetch admin profile and other data
    fetchAdminProfile();
    dispatch(fetchAllUsers());
    dispatch(fetchAllUserSubscriptions());
    setLoading(false);
  }, [router, dispatch]);

  // Clear admin error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAdminError());
    };
  }, [dispatch]);

  // Show admin error toast if there's an error
  useEffect(() => {
    if (adminError) {
      showToast.error(adminError);
    }
  }, [adminError]);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      showToast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      showToast.error('Failed to logout');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);

    // Validate passwords match if password is being changed
    if (formData.password && formData.password !== formData.confirmPassword) {
      showToast.error('Passwords do not match');
      setUpdateLoading(false);
      return;
    }

    try {
      const updateData: any = {
        business_id: AuthService.getBusinessId(),
        user_id: adminProfile?.id,
        name: formData.name,
        email: formData.email,
        role: adminProfile?.role, // Automatically pass existing role
      };

      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(
        `${AuthService.getApiBaseUrl()}/auth/user/update`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      
      // Check if the response contains valid data
      if (updatedProfile && (updatedProfile.name || updatedProfile.email)) {
        // Update the profile state
        setAdminProfile(updatedProfile);
        
        // Update form data with new values
        setFormData(prev => ({
          ...prev,
          name: updatedProfile.name || prev.name,
          email: updatedProfile.email || prev.email,
          password: '',
          confirmPassword: '',
        }));
        
        showToast.success('Profile updated successfully!');
      } else {
        // If no profile data returned, refresh from server
        await fetchAdminProfile();
        showToast.success('Profile updated successfully!');
      }
      
      setIsEditing(false);
    } catch (error: any) {
      showToast.error(error.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: adminProfile?.name || '',
      email: adminProfile?.email || '',
      password: '',
      confirmPassword: '',
    });
  };

  if (loading) {
    return <PageLoader text="Loading profile..." />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.secondary }}>
      {/* Main Content */}
      <main className="p-4 pb-24">
        {/* Profile Card */}
        <div className="rounded-xl shadow-sm p-6 border mb-6" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg transition-colors"
                style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
          </div>

          {!isEditing ? (
            <>
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: COLORS.border.light }}>
                  <User className="h-10 w-10" style={{ color: COLORS.primary.main }} />
                </div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: COLORS.text.primary }}>{adminProfile?.name || 'Admin User'}</h3>
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>{adminProfile?.role || 'Administrator'}</p>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: COLORS.background.secondary }}>
                  <Mail className="h-5 w-5 mr-3" style={{ color: COLORS.text.secondary }} />
                  <div>
                    <p className="text-sm" style={{ color: COLORS.text.secondary }}>Email</p>
                    <p className="font-medium" style={{ color: COLORS.text.primary }}>{adminProfile?.email || 'admin@example.com'}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: COLORS.background.secondary }}>
                  <Shield className="h-5 w-5 mr-3" style={{ color: COLORS.text.secondary }} />
                  <div>
                    <p className="text-sm" style={{ color: COLORS.text.secondary }}>Role</p>
                    <p className="font-medium" style={{ color: COLORS.text.primary }}>{adminProfile?.role || 'Administrator'}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: COLORS.background.secondary }}>
                  <Calendar className="h-5 w-5 mr-3" style={{ color: COLORS.text.secondary }} />
                  <div>
                    <p className="text-sm" style={{ color: COLORS.text.secondary }}>Member Since</p>
                    <p className="font-medium" style={{ color: COLORS.text.primary }}>
                      {adminProfile?.created_at ? 
                        new Date(adminProfile.created_at).toLocaleDateString() : 
                        'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ 
                    borderColor: COLORS.border.secondary,
                    backgroundColor: COLORS.background.primary,
                    color: COLORS.text.primary
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.primary.main;
                    e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.border.secondary;
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ 
                    borderColor: COLORS.border.secondary,
                    backgroundColor: COLORS.background.primary,
                    color: COLORS.text.primary
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.primary.main;
                    e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.border.secondary;
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ 
                    borderColor: COLORS.border.secondary,
                    backgroundColor: COLORS.background.primary,
                    color: COLORS.text.primary
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.primary.main;
                    e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.border.secondary;
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter new password"
                />
              </div>

              {formData.password && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: COLORS.border.secondary,
                      backgroundColor: COLORS.background.primary,
                      color: COLORS.text.primary
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Confirm new password"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  style={{ 
                    backgroundColor: COLORS.border.secondary, 
                    color: COLORS.text.primary 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.border.primary}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.border.secondary}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{ 
                    backgroundColor: COLORS.primary.main, 
                    color: COLORS.success.text 
                  }}
                  onMouseEnter={(e) => {
                    if (!updateLoading) {
                      e.currentTarget.style.backgroundColor = COLORS.primary.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!updateLoading) {
                      e.currentTarget.style.backgroundColor = COLORS.primary.main;
                    }
                  }}
                >
                  {updateLoading ? (
                    <>
                      <ButtonLoader size="sm" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>



        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
          style={{ 
            backgroundColor: COLORS.error.main, 
            color: COLORS.error.text 
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.error.dark}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.error.main}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </main>

      {/* Bottom Navigation */}
      <AdminBottomNav />
      <PWAInstall showAfterAuth={true} />
    </div>
  );
}
