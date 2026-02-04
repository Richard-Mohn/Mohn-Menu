'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import RealTimeMap from '@/components/RealTimeMap';

interface DeliveryOrderData {
  orderId: string;
  restaurantId: string;
  customerId: string;
  driverId: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'delivered';
  restaurantLocation: { lat: number; lng: number };
  deliveryAddress: { lat: number; lng: number };
  estimatedDelivery: number;
  items: Array<{ name: string; quantity: number }>;
  total: number;
}

/**
 * Delivery Tracking Client Component
 * 
 * Customer sees:
 * - Live map with driver location (updates every 1-2 seconds)
 * - Real-time ETA
 * - Order status
 * - Driver info
 */
export default function TrackingClient() {
  const params = useParams();
  const orderId = typeof params.id === 'string' ? params.id : '';
  
  const [order, setOrder] = useState<DeliveryOrderData | null>(null);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [eta, setEta] = useState<number | null>(null);

  useEffect(() => {
    // Mock order data for demo
    if (orderId === 'demo') {
      setOrder({
        orderId: 'ORDER-001',
        restaurantId: 'rest-001',
        customerId: 'cust-001',
        driverId: 'driver-001',
        status: 'in_transit',
        restaurantLocation: { lat: 40.7128, lng: -74.0060 },
        deliveryAddress: { lat: 40.7580, lng: -73.9855 },
        estimatedDelivery: Date.now() + 15 * 60 * 1000,
        items: [
          { name: 'Orange Chicken', quantity: 2 },
          { name: 'Fried Rice', quantity: 1 },
        ],
        total: 28.50,
      });
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🚗 Track Your Delivery</h1>
        <p className="text-gray-600 mb-6">Order {order.orderId}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center">
              <RealTimeMap
                restaurantId={order.restaurantId}
                driverId={order.driverId}
                restaurantLocation={order.restaurantLocation}
                deliveryAddress={order.deliveryAddress}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
              <h2 className="font-semibold text-gray-900 mb-2">Status</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700 capitalize">{order.status.replace('_', ' ')}</span>
              </div>
            </div>

            {/* ETA */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h2 className="font-semibold text-gray-900 mb-2">⏱ ETA</h2>
              <p className="text-2xl font-bold text-blue-600">
                {eta ? `${Math.ceil((eta - Date.now()) / 60000)} min` : 'Computing...'}
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-3">Order Items</h2>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name} x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-green-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h2 className="font-semibold text-gray-900 mb-2">👤 Driver</h2>
              <p className="text-sm text-gray-700">ID: {order.driverId}</p>
              <p className="text-sm text-gray-600 mt-1">Status: On the way</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
