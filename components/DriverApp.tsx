'use client';

import React, { useState, useEffect, useRef } from 'react';
import { startDriverTracking, stopDriverTracking, updateDriverStatus, completeDelivery } from '@/lib/realTimeTracking';

interface DriverAppProps {
  restaurantId: string;
  driverId: string;
  driverName: string;
}

/**
 * Driver App Component
 * Drivers use this to:
 * 1. Accept delivery orders
 * 2. Start GPS tracking (sent every 1-2 seconds)
 * 3. Navigate to customer
 * 4. Mark delivery as complete
 * 
 * Real-time flow:
 * - Driver taps "Start Delivery" → GPS tracking starts
 * - Location sent to Firebase Realtime DB every 1-2 seconds
 * - Customer/Restaurant sees live map update instantly (sub-second)
 * - Driver taps "Delivered" → Tracking stops
 */
export const DriverApp: React.FC<DriverAppProps> = ({
  restaurantId,
  driverId,
  driverName,
}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryCount, setDeliveryCount] = useState(0);
  const [status, setStatus] = useState<'idle' | 'in_transit' | 'at_restaurant' | 'delivering'>('idle');
  const [error, setError] = useState<string | null>(null);
  const trackingCleanup = useRef<(() => void) | null>(null);

  // Start driver tracking (GPS every 1-2 seconds)
  const handleStartDelivery = async () => {
    try {
      setError(null);
      setStatus('in_transit');
      
      // Start tracking: sends GPS location every 1-2 seconds to Firebase
      const cleanup = await startDriverTracking(
        restaurantId,
        driverId,
        (location) => {
          // Update local state for UI
          setCurrentLocation({
            lat: location.lat,
            lng: location.lng,
          });
        }
      );
      
      trackingCleanup.current = cleanup;
      setIsTracking(true);

      // Update status in Firebase
      await updateDriverStatus(restaurantId, driverId, 'in_transit');
    } catch (err) {
      setError('Failed to start GPS tracking. Enable location services.');
      setIsTracking(false);
    }
  };

  // Complete delivery and stop tracking
  const handleCompleteDelivery = async () => {
    try {
      setError(null);
      
      // Stop tracking
      if (trackingCleanup.current) {
        trackingCleanup.current();
      }
      
      // Update Firebase
      await completeDelivery(restaurantId, driverId);
      
      setIsTracking(false);
      setStatus('idle');
      setDeliveryCount((prev) => prev + 1);
    } catch (err) {
      setError('Failed to complete delivery');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackingCleanup.current) {
        trackingCleanup.current();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Driver Info */}
      <div className="mb-6 pb-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">LOCL Driver</h1>
        <p className="text-gray-600">Welcome, {driverName}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Deliveries Today</div>
            <div className="text-2xl font-bold text-green-600">{deliveryCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Status</div>
            <div className={`text-lg font-bold capitalize ${
              status === 'idle' ? 'text-blue-600' :
              status === 'in_transit' ? 'text-yellow-600' :
              status === 'at_restaurant' ? 'text-purple-600' :
              'text-green-600'
            }`}>
              {status}
            </div>
          </div>
        </div>
      </div>

      {/* Location Display */}
      {currentLocation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">Current Location</div>
          <div className="text-sm font-mono text-gray-800">
            {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
          </div>
          <div className={`text-xs mt-2 ${isTracking ? 'text-green-600' : 'text-gray-500'}`}>
            {isTracking ? '🟢 GPS Active - Sending location every 1-2 seconds' : '⚫ GPS Inactive'}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="space-y-3">
        {!isTracking ? (
          <>
            <button
              onClick={handleStartDelivery}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              🚗 Start Delivery
            </button>
            <p className="text-xs text-gray-500 text-center">
              Tap to start GPS tracking and begin delivery
            </p>
          </>
        ) : (
          <>
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center">
              <div className="text-sm font-bold text-green-700 mb-2">🟢 TRACKING ACTIVE</div>
              <div className="text-xs text-green-600">Your location is being shared in real-time</div>
            </div>

            <button
              onClick={() => updateDriverStatus(restaurantId, driverId, 'at_restaurant')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              📍 Arrived at Restaurant
            </button>

            <button
              onClick={() => updateDriverStatus(restaurantId, driverId, 'delivering')}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              🚗 Heading to Customer
            </button>

            <button
              onClick={handleCompleteDelivery}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              ✓ Delivery Complete
            </button>
          </>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <h3 className="font-bold text-gray-800 mb-2">How it works:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Tap "Start Delivery" to enable GPS</li>
          <li>Your location updates every 1-2 seconds</li>
          <li>Customer sees you live on their map</li>
          <li>Tap "Delivery Complete" when done</li>
        </ol>
      </div>

      {/* Permissions Reminder */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
        ⚠️ This app requires GPS location permissions. Make sure location services are enabled.
      </div>
    </div>
  );
};

export default DriverApp;
