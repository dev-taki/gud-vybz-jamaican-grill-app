'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, User, Gift } from 'lucide-react';
import { COLORS } from '../config/colors';

export default function AdminBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {/* Home Tab */}
        <button
          onClick={() => router.push('/admin/dashboard')}
          className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
            isActive('/admin/dashboard') 
              ? 'text-gray-700 bg-gray-100' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Home className={`h-6 w-6 mb-1 ${isActive('/admin/dashboard') ? 'text-gray-700' : 'text-gray-600'}`} />
          <span className="text-xs font-medium">Home</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => router.push('/admin/profile')}
          className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
            isActive('/admin/profile') 
              ? 'text-gray-700 bg-gray-100' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User className={`h-6 w-6 mb-1 ${isActive('/admin/profile') ? 'text-gray-700' : 'text-gray-600'}`} />
          <span className="text-xs font-medium">Profile</span>
        </button>

        {/* Redeem Tab */}
        <button
          onClick={() => router.push('/admin/redeem')}
          className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
            isActive('/admin/redeem') 
              ? 'text-gray-700 bg-gray-100' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Gift className={`h-6 w-6 mb-1 ${isActive('/admin/redeem') ? 'text-gray-700' : 'text-gray-600'}`} />
          <span className="text-xs font-medium">Redeem</span>
        </button>
      </div>
    </div>
  );
}
