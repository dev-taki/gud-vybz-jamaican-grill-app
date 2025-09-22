'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Calendar, User, Gift } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActiveTab } from '../store/slices/navigationSlice';
import { checkAuthStatus, fetchUserProfile } from '../store/slices/authSlice';
import PWAInstall from './PWAInstall';
import { PageLoader } from './common/Loader';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth);
  const { activeTab } = useAppSelector((state) => state.navigation);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only check auth status if we don't already have a user and haven't checked yet
    if (!user && !authChecked) {
      dispatch(checkAuthStatus());
      setAuthChecked(true);
    }
  }, [dispatch, user, authChecked]);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  // Set active tab based on current pathname
  useEffect(() => {
    if (pathname === '/plans') {
      dispatch(setActiveTab('plans'));
    } else if (pathname === '/redeem') {
      dispatch(setActiveTab('schedule'));
    } else if (pathname === '/profile') {
      dispatch(setActiveTab('profile'));
    }
  }, [pathname, dispatch]);

  useEffect(() => {
    // Only redirect if we've checked auth, loading is complete, user is not authenticated
    // AND we're not on public pages
    if (authChecked && !loading && !isAuthenticated && 
        pathname !== '/' && pathname !== '/signup' && pathname !== '/login') {
      router.push('/login');
    }
  }, [authChecked, isAuthenticated, loading, router, pathname]);

  if (loading) {
    return <PageLoader text="Loading..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleTabChange = (tab: 'plans' | 'schedule' | 'profile') => {
    dispatch(setActiveTab(tab));
    let path;
    if (tab === 'schedule') {
      path = '/redeem';
    } else if (tab === 'profile') {
      // Check if user is admin and route accordingly
      const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'owner';
      path = isAdmin ? '/admin/profile' : '/profile';
    } else {
      path = `/${tab}`;
    }
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="pb-20">
        {children}
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-50">
        <div className="flex justify-around items-center">
          <button
            onClick={() => handleTabChange('plans')}
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'plans' ? 'text-[#8c52ff]' : 'text-gray-400'
            }`}
          >
            <Calendar className={`h-6 w-6 ${activeTab === 'plans' ? 'text-[#8c52ff]' : 'text-gray-400'}`} />
            <span className="text-xs font-medium">Plans</span>
          </button>

          <button
            onClick={() => handleTabChange('schedule')}
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'schedule' ? 'text-[#8c52ff]' : 'text-gray-400'
            }`}
          >
            <Gift className={`h-6 w-6 ${activeTab === 'schedule' ? 'text-[#8c52ff]' : 'text-gray-400'}`} />
            <span className="text-xs font-medium">Redeem</span>
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'profile' ? 'text-[#8c52ff]' : 'text-gray-400'
            }`}
          >
            <User className={`h-6 w-6 ${activeTab === 'profile' ? 'text-[#8c52ff]' : 'text-gray-400'}`} />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
      <PWAInstall showAfterAuth={true} />
    </div>
  );
}
