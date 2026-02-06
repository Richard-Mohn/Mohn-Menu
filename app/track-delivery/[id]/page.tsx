import TrackingClient from './TrackingClient';

/**
 * Delivery Tracking Page — public, no auth required.
 * Customer receives a link like /track-delivery/ORDER_ID
 */
export default function DeliveryTrackingPage() {
  return <TrackingClient />;
}
