'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });

interface AuthModalContextType {
  openAuthModal: (tab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; tab: 'login' | 'signup' }>({
    open: false,
    tab: 'login',
  });

  const openAuthModal = useCallback((tab: 'login' | 'signup' = 'login') => {
    setState({ open: true, tab });
  }, []);

  const closeAuthModal = useCallback(() => {
    setState({ open: false, tab: 'login' });
  }, []);

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal
        isOpen={state.open}
        onClose={closeAuthModal}
        defaultTab={state.tab}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
  return ctx;
}
