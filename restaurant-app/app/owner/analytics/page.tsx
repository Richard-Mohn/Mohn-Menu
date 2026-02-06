'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DayStat {
  date: string;
  orders: number;
  revenue: number;
}

export default function OwnerAnalyticsPage() {
  const { currentBusiness } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [dailyStats, setDailyStats] = useState<DayStat[]>([]);
  const [topItems, setTopItems] = useState<{ name: string; count: number; revenue: number }[]>([]);
  const [ordersByType, setOrdersByType] = useState({ delivery: 0, pickup: 0 });
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!currentBusiness) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const ordersRef = collection(db, 'businesses', currentBusiness.businessId, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);

        let revenue = 0;
        const dayMap: Record<string, { orders: number; revenue: number }> = {};
        const itemMap: Record<string, { count: number; revenue: number }> = {};
        const typeCount = { delivery: 0, pickup: 0 };
        const statusCount: Record<string, number> = {};

        snap.forEach(docSnap => {
          const d = docSnap.data();
          const total = d.total || d.pricing?.total || 0;
          revenue += total;

          // Daily
          const date = d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Unknown';
          if (!dayMap[date]) dayMap[date] = { orders: 0, revenue: 0 };
          dayMap[date].orders++;
          dayMap[date].revenue += total;

          // Items
          const items = d.items || [];
          items.forEach((item: { name?: string; quantity?: number; price?: number }) => {
            const name = item.name || 'Unknown Item';
            if (!itemMap[name]) itemMap[name] = { count: 0, revenue: 0 };
            itemMap[name].count += item.quantity || 1;
            itemMap[name].revenue += (item.price || 0) * (item.quantity || 1);
          });

          // Types
          const type = d.orderType || 'delivery';
          if (type === 'pickup') typeCount.pickup++;
          else typeCount.delivery++;

          // Status
          const status = d.status || 'pending';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });

        setTotalOrders(snap.size);
        setTotalRevenue(revenue);
        setAvgOrderValue(snap.size > 0 ? revenue / snap.size : 0);
        setDailyStats(
          Object.entries(dayMap)
            .map(([date, data]) => ({ date, ...data }))
            .slice(0, 14)
        );
        setTopItems(
          Object.entries(itemMap)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
        );
        setOrdersByType(typeCount);
        setOrdersByStatus(statusCount);
      } catch {
        /* silently fail */
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentBusiness]);

  if (!currentBusiness) return null;

  const maxDayRevenue = Math.max(...dailyStats.map(d => d.revenue), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black">Analytics</h1>
        <p className="text-zinc-400 font-medium mt-1">
          Revenue, orders, and performance insights.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-zinc-100 p-16 text-center">
          <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-zinc-400 font-bold text-sm">Crunching numbers...</p>
        </div>
      ) : (
        <>
          {/* ── Stat Cards ────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Revenue',
                value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                color: 'text-emerald-600',
              },
              {
                label: 'Total Orders',
                value: totalOrders.toLocaleString(),
                color: 'text-indigo-600',
              },
              {
                label: 'Avg Order Value',
                value: `$${avgOrderValue.toFixed(2)}`,
                color: 'text-blue-600',
              },
              {
                label: 'Delivery vs Pickup',
                value: `${ordersByType.delivery} / ${ordersByType.pickup}`,
                color: 'text-purple-600',
              },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-zinc-100 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  {stat.label}
                </p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* ── Revenue Chart (simple bar) ────────────────────── */}
          {dailyStats.length > 0 && (
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">
                Daily Revenue (Last {dailyStats.length} days)
              </h2>
              <div className="flex items-end gap-1 h-48">
                {dailyStats
                  .slice()
                  .reverse()
                  .map((day, i) => {
                    const height = (day.revenue / maxDayRevenue) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center justify-end group"
                      >
                        <div className="relative w-full">
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity">
                            ${day.revenue.toFixed(0)} · {day.orders} orders
                          </div>
                          <div
                            className="w-full bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-colors min-h-1"
                            style={{ height: `${Math.max(height, 2)}%` }}
                          />
                        </div>
                        <p className="text-[8px] text-zinc-400 mt-1 truncate w-full text-center">
                          {day.date.replace(/\/\d{4}$/, '')}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ── Top Items + Status Breakdown ──────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Items */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">
                Top Menu Items
              </h2>
              {topItems.length === 0 ? (
                <p className="text-zinc-400 text-sm">No order data yet.</p>
              ) : (
                <div className="space-y-3">
                  {topItems.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center text-[10px] font-black text-zinc-500 shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-black text-sm truncate">{item.name}</p>
                        <p className="text-xs text-zinc-400">
                          {item.count} sold · ${item.revenue.toFixed(2)}
                        </p>
                      </div>
                      <div className="w-20 bg-zinc-100 rounded-full h-2 shrink-0">
                        <div
                          className="bg-indigo-500 rounded-full h-2"
                          style={{
                            width: `${(item.count / (topItems[0]?.count || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">
                Order Status Breakdown
              </h2>
              {Object.keys(ordersByStatus).length === 0 ? (
                <p className="text-zinc-400 text-sm">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(ordersByStatus)
                    .sort((a, b) => b[1] - a[1])
                    .map(([status, count]) => {
                      const colorMap: Record<string, string> = {
                        pending: 'bg-amber-500',
                        confirmed: 'bg-blue-500',
                        preparing: 'bg-orange-500',
                        ready: 'bg-indigo-500',
                        'out-for-delivery': 'bg-purple-500',
                        delivered: 'bg-emerald-500',
                        completed: 'bg-emerald-500',
                        cancelled: 'bg-red-500',
                      };
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${colorMap[status] || 'bg-zinc-400'}`} />
                            <span className="font-bold text-black text-sm capitalize">
                              {status.replace(/-/g, ' ')}
                            </span>
                          </div>
                          <span className="font-bold text-zinc-500 text-sm">{count}</span>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Order type split */}
              <div className="mt-6 pt-4 border-t border-zinc-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">
                  Order Type
                </h3>
                <div className="flex gap-4">
                  <div className="flex-1 bg-zinc-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-black text-black">{ordersByType.delivery}</p>
                    <p className="text-[10px] font-bold text-zinc-400">🚗 Delivery</p>
                  </div>
                  <div className="flex-1 bg-zinc-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-black text-black">{ordersByType.pickup}</p>
                    <p className="text-[10px] font-bold text-zinc-400">🏪 Pickup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
