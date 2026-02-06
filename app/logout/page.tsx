'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        router.push('/');
      } catch (error) {
        console.error('Logout failed:', error);
        router.push('/');
      }
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center">
        <div className="animate-spin inline-flex items-center justify-center w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full mb-4"></div>
        <p className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
          Logging you out...
        </p>
      </div>
    </div>
  );
}
