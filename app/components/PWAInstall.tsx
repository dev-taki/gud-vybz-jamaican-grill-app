'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { COLORS } from '../config/colors';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallProps {
  showAfterAuth?: boolean; // Show after successful authentication
}

// Utility function to clear PWA dismiss flag (can be called externally)
export const clearPWADismissFlag = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pwa-install-dismissed');
  }
};

export default function PWAInstall({ showAfterAuth = false }: PWAInstallProps) {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  // Get authentication state from Redux
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Only show if user is authenticated and showAfterAuth is true
    if (!isAuthenticated || !showAfterAuth || !user) {
      return;
    }

    // Check if user has dismissed the prompt before
    const hasDismissed = localStorage.getItem('pwa-install-dismissed');
    if (hasDismissed === 'true') {
      return;
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, [isAuthenticated, showAfterAuth, user]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    // Store the dismiss flag in localStorage
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="rounded-xl shadow-lg border p-4" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: COLORS.border.light }}>
              <Download className="h-5 w-5" style={{ color: COLORS.primary.main }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>Install {process.env.NEXT_PUBLIC_PWA_NAME!}</h3>
              <p className="text-xs" style={{ color: COLORS.text.secondary }}>Add to home screen for quick access</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 transition-colors"
            style={{ color: '#9ca3af' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#525252'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            style={{ 
              backgroundColor: COLORS.primary.main, 
              color: COLORS.success.text 
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            style={{ 
              backgroundColor: 'transparent',
              color: COLORS.text.secondary,
              borderColor: COLORS.border.secondary,
              border: '1px solid'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
