'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRouter() {
  const { user, loclUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Route based on user role
    if (loclUser?.role === 'owner' || loclUser?.role === 'manager') {
      router.push('/owner');
    } else if (loclUser?.role === 'driver_inhouse' || loclUser?.role === 'driver_marketplace') {
      router.push('/driver');
    } else if (loclUser?.role === 'customer') {
      router.push('/customer');
    } else if (loclUser?.role === 'admin') {
      router.push('/admin');
    } else {
      // Default to customer if role is not set
      router.push('/customer');
    }
  }, [user, loclUser, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center">
        <div className="animate-spin inline-flex items-center justify-center w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"></div>
        <p className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
          Redirecting you to your dashboard...
        </p>
      </div>
    </div>
  );
}
