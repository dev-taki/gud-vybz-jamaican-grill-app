'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, User, Calendar, X, Save, Users } from 'lucide-react';
import { AdminAuthService } from '../../services/adminAuthService';
import { AuthService } from '../../services/authService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllUsers } from '../../store/slices/adminSlice';
import AdminBottomNav from '../../components/AdminBottomNav';
import AdminHeader from '../../components/AdminHeader';
import { CardLoader, ButtonLoader } from '../../components/common/Loader';
import { showToast } from '../../utils/toast';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { COLORS } from '../../config/colors';

const BUSINESS_ID = AuthService.getBusinessId();

interface UserAccount {
  id: number;
  created_at: number;
  name: string;
  email: string;
  business_id: string;
  role: string;
  square_customer_id: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  // Redux state
  const { users, loading: usersLoading, error } = useAppSelector((state) => state.admin);

  useEffect(() => {
    if (!AdminAuthService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    dispatch(fetchAllUsers());
    setLoading(false);
  }, [router, dispatch]);

  const handleSearch = async () => {
    // For now, we'll just filter the existing users
    // In a real app, you'd want to implement server-side search
    dispatch(fetchAllUsers());
  };

  const handleClearSearch = async () => {
    setSearchEmail('');
    dispatch(fetchAllUsers());
  };

  // Filter users based on search
  const filteredUsers = searchEmail 
    ? users.filter(user => user.email.toLowerCase().includes(searchEmail.toLowerCase()))
    : users;

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const userData = {
        name: createFormData.name,
        email: createFormData.email,
        password: createFormData.password,
        business_id: BUSINESS_ID
      };

      const response = await fetch(
        `${AuthService.getApiBaseUrl()}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === 'ERROR_CODE_ACCESS_DENIED') {
          throw new Error('This email is already registered. Please use a different email address.');
        }
        throw new Error(errorData.message || 'Failed to create user');
      }

      const result = await response.json();
      showToast.success('User created successfully!');
      
      // Auto-login the newly created user and redirect to plans
      try {
        const loginResponse = await fetch(
          `${AuthService.getApiBaseUrl()}/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: createFormData.email,
              password: createFormData.password,
              business_id: BUSINESS_ID
            }),
          }
        );

        if (loginResponse.ok) {
          const loginResult = await loginResponse.json();
          
          // Store auth tokens
          document.cookie = `topped-off-co=${loginResult.token}; path=/; max-age=86400; secure; samesite=strict`;
          document.cookie = `topped-off-co_role=${loginResult.role}; path=/; max-age=86400; secure; samesite=strict`;
          
          showToast.success('User created and logged in successfully! Redirecting to plans...');
          
          // Redirect to plans page after a short delay
          setTimeout(() => {
            router.push('/plans');
          }, 1500);
        }
      } catch (loginError) {
        console.error('Auto-login failed:', loginError);
        showToast.success('User created successfully! Please log in manually.');
      }
      
      // Reset form
      setCreateFormData({
        name: '',
        email: '',
        password: ''
      });
      setShowCreateForm(false);
      
      // Refresh users list
      dispatch(fetchAllUsers());
    } catch (error: any) {
      showToast.error(error.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = (user: UserAccount) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowEditForm(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setSubmitting(true);

    try {
      const userData = {
        user_id: selectedUser.id,
        name: editFormData.name,
        email: editFormData.email,
        business_id: BUSINESS_ID,
        role: editFormData.role
      };

      const response = await fetch(
        `${AuthService.getApiBaseUrl()}/admin/user/${selectedUser.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      showToast.success('User updated successfully!');
      
      // Reset form
      setEditFormData({
        name: '',
        email: '',
        role: ''
      });
      setShowEditForm(false);
      setSelectedUser(null);
      
      // Refresh users list
      dispatch(fetchAllUsers());
    } catch (error: any) {
      showToast.error(error.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
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

  if (loading || usersLoading) {
    return <CardLoader text="Loading users..." />;
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
      {/* Admin Header */}
      <AdminHeader 
        title="Users" 
        subtitle="Manage user accounts"
      />

      {/* Main Content */}
      <main className="p-4 pb-24">
        {/* Create User Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 rounded-xl transition-colors flex items-center"
            style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create User
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by email..."
                className="w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:border-transparent"
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
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5" style={{ color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-3 rounded-xl font-medium transition-colors"
              style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
            >
              Search
            </button>
            {searchEmail && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-3 rounded-xl font-medium transition-colors"
                style={{ backgroundColor: COLORS.secondary.main, color: COLORS.success.text }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.secondary.hover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.secondary.main}
              >
                Clear
              </button>
            )}
          </div>
        </div>



        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="rounded-xl p-8 text-center shadow-sm border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
              <User className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.text.secondary }} />
              <h3 className="text-xl font-medium mb-2" style={{ color: COLORS.text.primary }}>No Users Found</h3>
              <p className="mb-4" style={{ color: COLORS.text.secondary }}>Create your first user account to get started.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 rounded-xl transition-colors"
                style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
              >
                Create First User
              </button>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="rounded-xl shadow-sm p-6 border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.light }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <User className="h-5 w-5" style={{ color: COLORS.primary.main }} />
                      <h3 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>{user.name}</h3>
                      <span className="px-2 py-1 text-xs rounded-full" style={{
                        backgroundColor: user.role === 'admin' ? COLORS.border.light : COLORS.border.light,
                        color: user.role === 'admin' ? COLORS.primary.main : COLORS.text.secondary
                      }}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>{user.email}</p>
                    <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                      Created: {formatDate(user.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: COLORS.text.secondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = COLORS.primary.main;
                      e.currentTarget.style.backgroundColor = COLORS.border.light;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = COLORS.text.secondary;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}


        </div>
      </main>

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.background.primary }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>Create New User</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 transition-colors"
                  style={{ color: COLORS.text.secondary }}
                  onMouseEnter={(e) => e.currentTarget.style.color = COLORS.text.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = COLORS.text.secondary}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData({...createFormData, password: e.target.value})}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter password (min 8 characters)"
                  />
                  <p className="text-xs mt-1" style={{ color: COLORS.text.secondary }}>Password must be at least 8 characters long</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 border py-3 px-4 rounded-xl font-medium transition-colors"
                    style={{ borderColor: COLORS.border.secondary, color: COLORS.text.primary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.background.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
                  >
                    {submitting ? (
                      <>
                        <ButtonLoader size="sm" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Create User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditForm && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.background.primary }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>Edit User</h2>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedUser(null);
                  }}
                  className="p-2 transition-colors"
                  style={{ color: COLORS.text.secondary }}
                  onMouseEnter={(e) => e.currentTarget.style.color = COLORS.text.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = COLORS.text.secondary}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Role *
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select role</option>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setSelectedUser(null);
                    }}
                    className="flex-1 border py-3 px-4 rounded-xl font-medium transition-colors"
                    style={{ borderColor: COLORS.border.secondary, color: COLORS.text.primary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.background.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
                  >
                    {submitting ? (
                      <>
                        <ButtonLoader size="sm" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Update User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );
}
