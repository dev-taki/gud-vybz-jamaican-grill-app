// Storage utility functions for cookies and localStorage

// Cookie utility functions
export const setCookie = (name: string, value: string, days: number = 7): void => {
  if (typeof window !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }
};

export const getCookie = (name: string): string | null => {
  if (typeof window !== 'undefined') {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

export const removeCookie = (name: string): void => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};

// localStorage utility functions
export const setLocalStorage = (key: string, value: any): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }
};

export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error getting localStorage:', error);
      return defaultValue || null;
    }
  }
  return defaultValue || null;
};

export const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage:', error);
    }
  }
};

// Storage keys constants
export const STORAGE_KEYS = {
  AUTH_TOKEN: process.env.NEXT_PUBLIC_COOKIE_AUTH_TOKEN!,
  USER_ROLE: process.env.NEXT_PUBLIC_COOKIE_USER_ROLE!,
  PWA_INSTALL_DISMISSED: 'pwa-install-dismissed',
  USER_PREFERENCES: 'user-preferences',
  THEME: 'theme',
} as const;
