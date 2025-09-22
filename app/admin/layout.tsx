'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminAuthService } from '../services/adminAuthService';
import { PageLoader } from '../components/common/Loader';
import { COLORS } from '../config/colors';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const hasToken = AdminAuthService.isAuthenticated();
    const hasRole = AdminAuthService.hasAdminRole();
    
    if (hasToken && hasRole) {
      setIsAuthenticated(true);
    } else {
      // No token or not admin, redirect to login
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
    
    setIsLoading(false);
  }, [router, pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    return <PageLoader text="Checking admin access..." />;
  }

  // For login page, don't check authentication
  if (pathname === '/login') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: COLORS.background.secondary }}>
        {children}
      </div>
    );
  }

  // For authenticated admin pages
  if (isAuthenticated) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: COLORS.background.secondary }}>
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    );
  }

  // Fallback - should not reach here
  return null;
}
