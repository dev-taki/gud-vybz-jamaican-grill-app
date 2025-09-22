'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Calendar, CreditCard, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function ClientBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getActiveColor = (path: string) => {
    return isActive(path) ? 'text-brand-primary' : 'text-gray-400';
  };

  const getIconColor = (path: string) => {
    return isActive(path) ? 'text-brand-primary' : 'text-gray-400';
  };

  const getIconSize = (path: string) => {
    return isActive(path) ? 'h-8 w-8' : 'h-5 w-5';
  };

  const getTextSize = (path: string) => {
    return isActive(path) ? 'text-base font-semibold' : 'text-xs font-normal';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-white border-t border-gray-200 px-6 py-4 z-50">
      <div className="flex justify-around items-center">
        {/* Home Tab */}
        <div
          onClick={() => router.push('/home')}
          className="relative cursor-pointer transition-all duration-300 ease-in-out w-16 h-16"
        >
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <Home className={`${getIconSize('/home')} ${getIconColor('/home')} transition-all duration-300 ease-in-out`} />
          </div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <span className={`${getTextSize('/home')} ${getActiveColor('/home')} transition-all duration-300 ease-in-out whitespace-nowrap`}>Home</span>
          </div>
        </div>

        {/* Plans Tab */}
        <div
          onClick={() => router.push('/plans')}
          className="relative cursor-pointer transition-all duration-300 ease-in-out w-16 h-16"
        >
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <Calendar className={`${getIconSize('/plans')} ${getIconColor('/plans')} transition-all duration-300 ease-in-out`} />
          </div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <span className={`${getTextSize('/plans')} ${getActiveColor('/plans')} transition-all duration-300 ease-in-out whitespace-nowrap`}>Plans</span>
          </div>
        </div>


        {/* Redeem Tab */}
        <div
          onClick={() => router.push('/redeem')}
          className="relative cursor-pointer transition-all duration-300 ease-in-out w-16 h-16"
        >
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <CreditCard className={`${getIconSize('/redeem')} ${getIconColor('/redeem')} transition-all duration-300 ease-in-out`} />
          </div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <span className={`${getTextSize('/redeem')} ${getActiveColor('/redeem')} transition-all duration-300 ease-in-out whitespace-nowrap`}>Redeem</span>
          </div>
        </div>

        {/* Profile Tab */}
        <div
          onClick={() => {
            // Check if user is admin and route accordingly
            const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'owner';
            const profilePath = isAdmin ? '/admin/profile' : '/profile';
            router.push(profilePath);
          }}
          className="relative cursor-pointer transition-all duration-300 ease-in-out w-16 h-16"
        >
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <User className={`${getIconSize('/profile')} ${getIconColor('/profile')} transition-all duration-300 ease-in-out`} />
          </div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <span className={`${getTextSize('/profile')} ${getActiveColor('/profile')} transition-all duration-300 ease-in-out whitespace-nowrap`}>Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
