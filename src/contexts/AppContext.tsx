import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'hi' | 'es' | 'fr';
  batterySaver: boolean;
}

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  userRole: string | null;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('app-settings');
    return saved ? JSON.parse(saved) : {
      theme: 'system',
      language: 'en',
      batterySaver: false
    };
  });

  // Fetch user role when user is available
  useEffect(() => {
    if (user) {
      // In a real app, you'd fetch this from your profiles table
      // For now, defaulting to student - teachers need to be assigned manually
      setUserRole('student');
    } else {
      setUserRole(null);
    }
  }, [user]);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Apply battery saver optimizations
    if (settings.batterySaver) {
      root.style.setProperty('--animation-duration', '0ms');
      root.classList.add('battery-saver');
    } else {
      root.style.removeProperty('--animation-duration');
      root.classList.remove('battery-saver');
    }
  }, [settings.theme, settings.batterySaver]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('app-settings', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{
      settings,
      updateSettings,
      userRole,
      isLoading: loading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};