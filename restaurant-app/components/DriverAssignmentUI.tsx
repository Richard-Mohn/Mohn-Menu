'use client';

import React, { useState } from 'react';
import { useAllDrivers, useOrderAssignment } from '@/lib/trackingHooks';
import RealTimeMap from '@/components/RealTimeMap';

interface DriverAssignmentProps {
  restaurantId: string;
  orderId: string;
  deliveryAddress: { lat: number; lng: number };
  restaurantLocation: { lat: number; lng: number };
  onAssigned?: (driverId: string) => void;
}

/**
 * Driver Assignment Interface
 * Restaurant staff uses this to:
 * 1. See all available drivers on map
 * 2. Assign driver to order
 * 3. Track driver in real-time
 */
export const DriverAssignmentUI: React.FC<DriverAssignmentProps> = ({
  restaurantId,
  orderId,
  deliveryAddress,
  restaurantLocation,
  onAssigned,
}) => {
  const { drivers, loading: driversLoading } = useAllDrivers(restaurantId);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const { assignOrder, loading: assignLoading, error } = useOrderAssignment(
    restaurantId,
    selectedDriverId
  );

  // Get available drivers (idle status)
  const availableDrivers = Object.entries(drivers)
    .filter(([_, data]) => data.status === 'idle' || data.status === 'in_transit')
    .map(([id, data]) => ({ id, ...data }));

  const handleAssign = async () => {
    if (!selectedDriverId) return;
    await assignOrder(orderId);
    onAssigned?.(selectedDriverId);
  };

  return (
    <div className="w-full space-y-6">
      {/* Map View */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <RealTimeMap
          restaurantId={restaurantId}
          driverId={selectedDriverId || ''}
          deliveryAddress={deliveryAddress}
          restaurantLocation={restaurantLocation}
          className="w-full h-80"
          showRoute={!!selectedDriverId}
        />
      </div>

      {/* Driver List & Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Available Drivers</h2>

        {driversLoading ? (
          <p className="text-gray-500">Loading drivers...</p>
        ) : availableDrivers.length === 0 ? (
          <p className="text-gray-500">No drivers available right now</p>
        ) : (
          <div className="space-y-2">
            {availableDrivers.map((driver) => (
              <button
                key={driver.id}
                onClick={() => setSelectedDriverId(driver.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedDriverId === driver.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-800">Driver {driver.id}</div>
                    <div className="text-sm text-gray-500">
                      Status: {driver.status}
                    </div>
                  </div>
                  {driver.location && (
                    <div className="text-right text-xs text-gray-600">
                      <div>📍</div>
                      <div>{driver.location.lat.toFixed(3)}</div>
                      <div>{driver.location.lng.toFixed(3)}</div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Assign Button */}
        <button
          onClick={handleAssign}
          disabled={!selectedDriverId || assignLoading}
          className={`w-full mt-4 py-3 px-4 rounded-lg font-bold transition-colors ${
            selectedDriverId && !assignLoading
              ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {assignLoading ? 'Assigning...' : 'Assign Driver'}
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>💡 Tip:</strong> Select a driver to see their location and route to the customer.
        Once assigned, the driver's GPS will be shared with the customer in real-time.
      </div>
    </div>
  );
};

export default DriverAssignmentUI;
