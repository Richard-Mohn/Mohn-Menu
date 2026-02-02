'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import DeliveryMap from '@/components/DeliveryMap';

interface Order {
  id: string;
  items: any[];
  totalAmount: number;
  currentStatus: string;
  orderType: string;
  driverId?: string;
  customerInfo: {
    address?: string;
  };
  is_express?: boolean;
  has_live_cam?: boolean;
}

interface DriverLocation {
  latitude: number;
  longitude: number;
}

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [driverLoc, setDriverLoc] = useState<DriverLocation | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = onSnapshot(doc(db, 'orders', orderId as string), (snapshot) => {
      if (snapshot.exists()) {
        const orderData = { id: snapshot.id, ...snapshot.data() } as Order;
        setOrder(orderData);
        
        // If order is out for delivery and has a driver, track the driver
        if (orderData.currentStatus === 'Out for Delivery' && orderData.driverId) {
          const unsubDriver = onSnapshot(doc(db, 'drivers', orderData.driverId), (driverDoc) => {
            if (driverDoc.exists()) {
              const driverData = driverDoc.data();
              if (driverData.currentLocation) {
                setDriverLoc({
                  latitude: driverData.currentLocation.latitude,
                  longitude: driverData.currentLocation.longitude
                });
              }
            }
          });
          return () => unsubDriver();
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  const handleUpgradeCam = async () => {
    if (!orderId) return;
    setIsUpgrading(true);
    try {
      // Simulate payment for upgrade
      await updateDoc(doc(db, 'orders', orderId as string), {
        has_live_cam: true,
        totalAmount: (order?.totalAmount || 0) + 2.99,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const statuses = ['Received', 'Preparing', 'Cooking', 'Ready', 'Out for Delivery', 'Delivered', 'Completed'];
  const currentStatusIndex = statuses.indexOf(order?.currentStatus || 'Received');

  if (loading) {
    return <div className="text-center p-12 text-indigo-600 font-semibold animate-pulse uppercase tracking-widest">🐉 Locating your feast...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-4 uppercase">Order Not Found</h1>
        <Link href="/menu" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest active:scale-95 shadow-xl shadow-indigo-500/20">Return to Menu</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          {/* Header */}
          <div className="p-8 sm:p-12 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Real-time tracking</span>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter leading-none">Order #{order.id.slice(-4)}</h1>
              </div>
              {order.is_express && (
                <div className="bg-amber-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-amber-500/20">
                  Priority ⚡
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative pt-8 pb-4 overflow-x-auto no-scrollbar">
              <div className="min-w-[600px]">
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                    style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-6 px-2">
                  {statuses.map((status, index) => (
                    <div key={status} className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mb-3 transition-colors duration-500 ${
                        index <= currentStatusIndex ? 'bg-indigo-600 scale-125' : 'bg-zinc-300 dark:bg-zinc-600'
                      }`} />
                      <span className={`text-[8px] font-black uppercase tracking-widest text-center whitespace-nowrap ${
                        index === currentStatusIndex ? 'text-indigo-600' : 'text-zinc-400'
                      }`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Col: Status Info & Live Cam */}
            <div className="space-y-12">
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight mb-4">Current Status</h2>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl p-6 border-2 border-indigo-100 dark:border-indigo-800/50">
                  <div className="text-3xl mb-3">
                    {order.currentStatus === 'Received' && '🥡'}
                    {order.currentStatus === 'Preparing' && '🔪'}
                    {order.currentStatus === 'Cooking' && '🔥'}
                    {order.currentStatus === 'Ready' && '✅'}
                    {order.currentStatus === 'Out for Delivery' && '🛵'}
                    {order.currentStatus === 'Delivered' && '📍'}
                    {order.currentStatus === 'Completed' && '🐉'}
                  </div>
                  <div className="text-xl font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-tighter">
                    {order.currentStatus === 'Received' && 'Order Confirmed'}
                    {order.currentStatus === 'Preparing' && 'Prepping Ingredients'}
                    {order.currentStatus === 'Cooking' && 'In the Wok'}
                    {order.currentStatus === 'Ready' && 'Ready for ' + (order.orderType === 'pickup' ? 'Pickup' : 'Delivery')}
                    {order.currentStatus === 'Out for Delivery' && 'Driver En Route'}
                    {order.currentStatus === 'Delivered' && 'Order Delivered'}
                    {order.currentStatus === 'Completed' && 'Enjoy your meal!'}
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium mt-2 leading-relaxed">
                    {order.currentStatus === 'Received' && 'Your order has been sent to our kitchen and we will begin preparation shortly.'}
                    {order.currentStatus === 'Preparing' && 'Our chefs are hand-preparing the freshest ingredients for your meal.'}
                    {order.currentStatus === 'Cooking' && 'Your meal is being wok-fired right now at high intensity.'}
                    {order.currentStatus === 'Ready' && 'Success! Your food is packaged and waiting for you.'}
                    {order.currentStatus === 'Out for Delivery' && 'Your Golden Dragon feast is on its way to you!'}
                    {order.currentStatus === 'Delivered' && 'Your driver has arrived! Open your door to fresh food.'}
                  </p>
                </div>
              </div>

              {/* Delivery Tracking Map */}
              {order.currentStatus === 'Out for Delivery' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight mb-4">On the Road</h2>
                  <DeliveryMap driverLocation={driverLoc} />
                </div>
              )}

              {/* Live Kitchen Feed */}
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight mb-4">Kitchen View</h2>
                {order.has_live_cam ? (
                  <div className="bg-black rounded-[2.5rem] overflow-hidden relative shadow-2xl group border-4 border-indigo-600/30">
                    <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white shadow-sm">Chef's Eye Live HD</span>
                    </div>
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      className="w-full h-full object-cover aspect-video opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                      <source src="https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-meal-in-a-professional-kitchen-863-large.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 pointer-events-none border-[20px] border-white/5" />
                  </div>
                ) : (
                  <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-indigo-500/30 shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform text-2xl">🎥</div>
                    <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-indigo-400">Chef's Eye Live</h3>
                    <p className="text-zinc-400 text-xs font-medium mb-6 leading-relaxed">
                      Watch our master chefs fire up the wok and prepare your specific order in real-time. Upgrade to 4K live feed.
                    </p>
                    <button 
                      onClick={handleUpgradeCam}
                      disabled={isUpgrading}
                      className="bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isUpgrading ? 'Unlocking...' : 'Unlock HD Feed (+$2.99)'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Order Summary */}
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight mb-6 underline decoration-indigo-500 decoration-4 underline-offset-8">Your Feast</h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className="text-indigo-600 dark:text-indigo-400 font-black">
                        {item.quantity}x
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight leading-tight">{item.name}</div>
                        {item.options && item.options.length > 0 && (
                          <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 leading-none">{item.options.join(' • ')}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                
                <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Order Subtotal</span>
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">${(order.totalAmount - (order.has_live_cam ? 2.99 : 0)).toFixed(2)}</span>
                  </div>
                  {order.has_live_cam && (
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Chef's Eye Upgrade</span>
                      <span className="text-sm font-black text-indigo-500">$2.99</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-4 px-2 border-t border-zinc-50 dark:border-zinc-800 mt-4">
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Total Paid</span>
                    <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/menu" className="text-zinc-500 dark:text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] hover:text-indigo-600 transition-colors">
            ← Need more food? View Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;