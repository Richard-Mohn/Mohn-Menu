import TrackingClient from './TrackingClient';

interface DeliveryOrderData {
  orderId: string;
  restaurantId: string;
  customerId: string;
  driverId: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'delivered';
  restaurantLocation: { lat: number; lng: number };
  deliveryAddress: { lat: number; lng: number };
  estimatedDelivery: number; // timestamp
  items: Array<{ name: string; quantity: number }>;
  total: number;
}

/**
 * Generate static params for static export
 * Required for Next.js static export mode
 */
export function generateStaticParams() {
  return [
    { id: 'demo' },
    { id: 'test-order-123' },
  ];
}

/**
 * Delivery Tracking Page
 * Server component wrapper that renders the client tracking interface
 */
export default function DeliveryTrackingPage() {
  return <TrackingClient />;
}
