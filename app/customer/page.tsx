'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { user, loclUser, loading, isCustomer } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isCustomer())) {
      router.push('/login');
    }
  }, [user, loading, isCustomer, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <div className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
                My Orders
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {user?.email}
              </p>
            </div>
            <Link
              href="/logout"
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Loyalty Points
            </p>
            <p className="text-3xl font-black text-indigo-600">450</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Total Orders
            </p>
            <p className="text-3xl font-black text-emerald-600">18</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Total Spent
            </p>
            <p className="text-3xl font-black text-blue-600">$342.50</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Member Since
            </p>
            <p className="text-3xl font-black text-purple-600">6mo</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/menu" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">🍕</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Browse Menu
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Order from your favorite restaurant
              </p>
            </div>
          </Link>

          <Link href="/customer/orders" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Order History
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Track your past orders
              </p>
            </div>
          </Link>

          <Link href="/customer/loyalty" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Loyalty Rewards
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                View rewards and redeem points
              </p>
            </div>
          </Link>

          <Link href="/customer/profile" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Profile
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Update addresses and preferences
              </p>
            </div>
          </Link>
        </div>

        {/* Active Orders */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-6">
            Recent Orders
          </h2>
          <div className="space-y-4">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-white">Order #1234</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">China Wok Restaurant</p>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm font-bold">
                  Delivered
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                2x Kung Pao Chicken + 1x Fried Rice - $18.50
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Delivered on Nov 15, 2024
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-white">Order #1233</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">China Wok Restaurant</p>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm font-bold">
                  Delivered
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                1x Pad Thai + 1x Spring Rolls - $16.25
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Delivered on Nov 12, 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
