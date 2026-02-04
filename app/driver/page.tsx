'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DriverDashboard() {
  const { user, loclUser, loading, isDriver } = useAuth();
  const router = useRouter();
  const [driverStatus, setDriverStatus] = useState<'offline' | 'online' | 'on_delivery' | 'on_break'>('offline');

  useEffect(() => {
    if (!loading && (!user || !isDriver())) {
      router.push('/login');
    }
  }, [user, loading, isDriver, router]);

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
                Driver Dashboard
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
        {/* Status Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-8 mb-12 shadow-lg">
          <h2 className="text-2xl font-black mb-4">Your Status</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-4 h-4 rounded-full ${
              driverStatus === 'online' ? 'bg-emerald-400' :
              driverStatus === 'on_delivery' ? 'bg-blue-400' :
              driverStatus === 'on_break' ? 'bg-yellow-400' :
              'bg-red-400'
            }`}></div>
            <p className="text-lg font-bold capitalize">{driverStatus.replace('_', ' ')}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDriverStatus('online')}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-bold hover:bg-zinc-100 transition-all"
            >
              Go Online
            </button>
            <button
              onClick={() => setDriverStatus('offline')}
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg font-bold hover:bg-zinc-800 transition-all"
            >
              Go Offline
            </button>
            <button
              onClick={() => setDriverStatus('on_break')}
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg font-bold hover:bg-zinc-800 transition-all"
            >
              Break
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Today's Deliveries
            </p>
            <p className="text-3xl font-black text-indigo-600">12</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Today's Earnings
            </p>
            <p className="text-3xl font-black text-emerald-600">$47.50</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Rating
            </p>
            <p className="text-3xl font-black text-yellow-600">4.9 ⭐</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold mb-2">
              Total Completed
            </p>
            <p className="text-3xl font-black text-blue-600">127</p>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 mb-12">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-6">
            Active Deliveries
          </h2>
          <div className="space-y-4">
            {driverStatus === 'online' ? (
              <>
                <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">Order #1234</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">China Wok Restaurant</p>
                    </div>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-bold">
                      En Route
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    📍 123 Main St → 456 Oak Ave (2.3 km away)
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">
                      Navigate
                    </button>
                    <button className="flex-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white px-4 py-2 rounded-lg font-bold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all">
                      Contact
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Go online to receive delivery requests
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/driver/history" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">📜</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Delivery History
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                View past deliveries and earnings
              </p>
            </div>
          </Link>

          <Link href="/driver/earnings" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Earnings
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Weekly payout summary and breakdown
              </p>
            </div>
          </Link>

          <Link href="/driver/profile" className="group">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-600 transition-all hover:shadow-lg">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
                Profile
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Update info, vehicle, documents
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
