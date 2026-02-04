'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DriverLocation, subscribeToDriverLocation, calculateETA } from '@/lib/realTimeTracking';

interface RealTimeMapProps {
  restaurantId: string;
  driverId: string;
  deliveryAddress: { lat: number; lng: number };
  restaurantLocation: { lat: number; lng: number };
  className?: string;
  showRoute?: boolean;
}

/**
 * Real-Time Driver Tracking Map
 * Features:
 * - Live driver location updates (sub-second latency)
 * - Smooth animation between positions
 * - ETA countdown
 * - Route visualization
 */
export const RealTimeMap: React.FC<RealTimeMapProps> = ({
  restaurantId,
  driverId,
  deliveryAddress,
  restaurantLocation,
  className = 'w-full h-96',
  showRoute = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const driverMarker = useRef<mapboxgl.Marker | null>(null);
  const customerMarker = useRef<mapboxgl.Marker | null>(null);
  const restaurantMarker = useRef<mapboxgl.Marker | null>(null);
  const routeSource = useRef<boolean>(false);

  const [eta, setEta] = useState<number | null>(null);
  const [lastLocation, setLastLocation] = useState<DriverLocation | null>(null);
  const [driverStatus, setDriverStatus] = useState<string>('waiting');

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [restaurantLocation.lng, restaurantLocation.lat],
      zoom: 13,
      pitch: 45,
      bearing: -60,
    });

    // Add customer marker
    const customerEl = document.createElement('div');
    customerEl.className = 'w-10 h-10 bg-green-500 rounded-full border-4 border-green-300 shadow-lg flex items-center justify-center';
    customerEl.innerHTML = '📍';

    customerMarker.current = new mapboxgl.Marker({ element: customerEl })
      .setLngLat([deliveryAddress.lng, deliveryAddress.lat])
      .addTo(map.current);

    // Add restaurant marker
    const restaurantEl = document.createElement('div');
    restaurantEl.className = 'w-10 h-10 bg-blue-500 rounded-full border-4 border-blue-300 shadow-lg flex items-center justify-center';
    restaurantEl.innerHTML = '🍽️';

    restaurantMarker.current = new mapboxgl.Marker({ element: restaurantEl })
      .setLngLat([restaurantLocation.lng, restaurantLocation.lat])
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [deliveryAddress, restaurantLocation]);

  // Subscribe to real-time driver location
  useEffect(() => {
    const unsubscribe = subscribeToDriverLocation(
      restaurantId,
      driverId,
      (location) => {
        if (!location || !map.current) return;

        // Create or update driver marker
        if (!driverMarker.current) {
          const driverEl = document.createElement('div');
          driverEl.className = 'w-12 h-12 bg-red-500 rounded-full border-4 border-red-300 shadow-2xl flex items-center justify-center animate-pulse';
          driverEl.innerHTML = '🚗';

          driverMarker.current = new mapboxgl.Marker({ element: driverEl })
            .setLngLat([location.lng, location.lat])
            .addTo(map.current);
        } else {
          // Smoothly animate driver to new position (Uber-like animation)
          driverMarker.current.setLngLat([location.lng, location.lat]);
        }

        // Update ETA
        const newEta = calculateETA(
          location.lat,
          location.lng,
          deliveryAddress.lat,
          deliveryAddress.lng
        );
        setEta(newEta);
        setLastLocation(location);

        // Smoothly pan/zoom to center all markers
        if (map.current) {
          map.current.easeTo({
            center: [location.lng, location.lat],
            zoom: 14,
            duration: 1000,
          });
        }

        // Draw route if enabled
        if (showRoute && lastLocation) {
          drawRoute(lastLocation, deliveryAddress, restaurantLocation);
        }
      },
      (status) => {
        setDriverStatus(status);
      }
    );

    return unsubscribe;
  }, [restaurantId, driverId, deliveryAddress, restaurantLocation, showRoute, lastLocation]);

  // Draw route on map
  const drawRoute = (
    driverLocation: DriverLocation,
    destination: { lat: number; lng: number },
    restaurant: { lat: number; lng: number }
  ) => {
    if (!map.current) return;

    // Add source if not exists
    if (!routeSource.current) {
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.current.addLayer(
        {
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#ef4444',
            'line-width': 3,
            'line-opacity': 0.7,
          },
        },
        'waterway-label'
      );

      routeSource.current = true;
    }

    // Update route: driver -> destination
    const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
    source.setData({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [driverLocation.lng, driverLocation.lat],
              [destination.lng, destination.lat],
            ],
          },
          properties: {},
        },
      ],
    } as GeoJSON.FeatureCollection);
  };

  return (
    <div className={className}>
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg overflow-hidden shadow-lg relative"
      >
        {/* ETA Overlay */}
        {eta && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10 max-w-xs">
            <div className="text-sm text-gray-600">Estimated Arrival</div>
            <div className="text-3xl font-bold text-red-500">{eta} min</div>
            <div className="text-xs text-gray-500 mt-2">
              {driverStatus === 'in_transit' && 'Driver is on the way'}
              {driverStatus === 'at_restaurant' && 'Driver picking up order'}
              {driverStatus === 'delivering' && 'Driver delivering'}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-lg">🚗</div>
            <span>Your Driver</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-lg">📍</div>
            <span>Delivery Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-lg">🍽️</div>
            <span>Restaurant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMap;
