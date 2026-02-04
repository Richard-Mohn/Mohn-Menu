'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function OwnerDashboard() {
  const { user, loclUser, currentBusiness, loading, isOwner } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isOwner())) {
      router.push('/login');
    }
  }, [user, loading, isOwner, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <div className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!currentBusiness) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">
            No Business Found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            You don't have any businesses set up yet.
          </p>
          <Link
            href="/onboarding"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all"
          >
            Create Your First Business
          </Link>
        </div>
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
                {currentBusiness.name}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {currentBusiness.type.replace(/_/g, ' ').toUpperCase()}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/owner/settings"
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-bold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all"
              >
                Settings
              </Link>
              <Link
                href="/logout"
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Monthly Revenue
            </p>
            <p className="text-3xl font-black text-indigo-600">
              ${(currentBusiness.monthlyRevenue || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Total Orders
            </p>
            <p className="text-3xl font-black text-emerald-600">
              {(currentBusiness.totalOrders || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Customers
            </p>
            <p className="text-3xl font-black text-blue-600">
              {(currentBusiness.customerCount || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Active Drivers
            </p>
            <p className="text-3xl font-black text-purple-600">
              {(currentBusiness.inHouseDriverIds?.length || 0)} / {currentBusiness.maxInhouseDrivers}
            </p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/owner/orders" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Manage Orders
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                View all orders, update status, manage fulfillment
              </p>
            </div>
          </Link>

          <Link href="/owner/drivers" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Drivers
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Manage in-house drivers, real-time tracking, assignments
              </p>
            </div>
          </Link>

          <Link href="/owner/menu" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">🍕</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Menu Management
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Add items, update prices, manage availability
              </p>
            </div>
          </Link>

          <Link href="/owner/analytics" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Analytics
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Sales trends, bestsellers, customer insights
              </p>
            </div>
          </Link>

          <Link href="/owner/loyalty" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-pink-500 dark:hover:border-pink-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Loyalty Program
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Manage rewards, promotions, customer retention
              </p>
            </div>
          </Link>

          <Link href="/owner/marketing" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-orange-500 dark:hover:border-orange-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Marketing
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Email campaigns, SMS, customer communication
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-6">
            Recent Orders
          </h2>
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Orders will appear here as customers place them
            </p>
            <Link
              href="/owner/orders"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
