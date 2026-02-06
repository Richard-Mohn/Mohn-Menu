/**
 * USER TYPES & ROLES for LOCL Multi-Tenant Platform
 * 
 * Every user in the system has a role that determines permissions
 */

// Business types that determine feature availability
export type BusinessType = 
  | 'restaurant'
  | 'convenience_store'
  | 'home_bakery'
  | 'meal_prep'
  | 'crafter'
  | 'farm_csa';

// Subscription tiers that determine feature access & pricing
export type SubscriptionTier = 
  | 'starter'      // $297 setup, self-service
  | 'partner'      // $699 setup + $99/mo, done-with-you
  | 'agency'       // $1,499 setup + $299/mo, full service
  | 'reseller';    // Custom, white-label partner

// User roles in the system
export type UserRole = 
  | 'customer'           // Regular customer placing orders
  | 'owner'              // Business owner (full access)
  | 'manager'            // Staff manager (manage drivers, orders, limited settings)
  | 'driver_inhouse'     // In-house driver (their own business's drivers)
  | 'driver_marketplace' // Marketplace driver (Locl's overflow driver pool)
  | 'admin'              // LOCL admin (super user)
  | 'reseller';          // Agency partner with their own clients

// Driver status in the system
export type DriverStatus = 
  | 'offline'            // Not working
  | 'online'             // Available for orders
  | 'on_delivery'        // Currently delivering
  | 'on_break';          // Taking a break

// Order status throughout fulfillment
export type OrderStatus = 
  | 'pending'            // Just placed, awaiting confirmation
  | 'confirmed'          // Owner confirmed, starting to prepare
  | 'preparing'          // Kitchen is making it
  | 'ready'              // Ready for pickup or delivery
  | 'out_for_delivery'   // Driver is en route
  | 'delivered'          // Successfully delivered
  | 'picked_up'          // Customer picked it up
  | 'cancelled';         // Order cancelled

// Delivery types
export type DeliveryType = 'delivery' | 'pickup' | 'shipping';

// Subscription status
export type SubscriptionStatus = 
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'trial';

/**
 * USER OBJECT (Firebase Auth Custom Claims)
 * Stored in Firebase Auth + Firestore
 */
export interface LOCLUser {
  uid: string;
  email: string;
  displayName: string;
  profileImage?: string;
  role: UserRole;
  
  // Which business(es) is this user associated with?
  businessIds: string[];
  
  // Current active business (for multi-business owners)
  activeBusinessId?: string;
  
  // For drivers: which businesses can they drive for?
  allowedBusinessIds?: string[];
  
  createdAt: string;
  updatedAt: string;
}

/**
 * BUSINESS OBJECT
 * The core tenant in the multi-tenant system
 */
export interface LOCLBusiness {
  businessId: string;
  
  // Basic info
  name: string;
  type: BusinessType;
  description?: string;
  logo?: string;
  
  // Subscription
  tier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStartDate: string;
  subscriptionEndDate?: string;
  
  // Custom domain
  customDomain?: string; // e.g., chinawok.com
  brandColors: {
    primary: string;    // e.g., #4F46E5
    secondary: string;  // e.g., #9333EA
    accent: string;     // e.g., #10B981
  };
  
  // Contact info
  ownerEmail: string;
  ownerPhone: string;
  businessPhone?: string;
  website?: string;
  
  // Address (primary location)
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  
  // Features (determined by tier, but can be customized)
  features: {
    liveOrderTracking: boolean;
    driverManagement: boolean;
    kitchenDisplaySystem: boolean;
    loyaltyProgram: boolean;
    liveStreaming: boolean;
    batchRouting: boolean;
    advancedAnalytics: boolean;
    apiAccess: boolean;
    customIntegrations: boolean;
  };
  
  // Operational
  isActive: boolean;
  isLocked: boolean; // Locked if payment failed
  
  // Drivers
  maxInhouseDrivers: number;
  inHouseDriverIds: string[];
  
  // Team
  staffCount: number;
  
  // Metrics
  monthlyRevenue?: number;
  totalOrders?: number;
  customerCount?: number;
  
  // Dates
  createdAt: string;
  setupCompletedAt?: string;
  updatedAt: string;
}

/**
 * LOCATION OBJECT
 * A business can have multiple locations
 */
export interface LOCLLocation {
  locationId: string;
  businessId: string;
  
  name: string; // "Downtown", "Airport", "Main Street", etc.
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  
  phone: string;
  hours: {
    monday?: { open: string; close: string };     // "09:00" "22:00"
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
  
  isOpen: boolean;
  timezone: string;
  
  // Drivers assigned to this location
  driverIds: string[];
  
  createdAt: string;
  updatedAt: string;
}

/**
 * DRIVER OBJECT (In-House or Marketplace)
 */
export interface LOCLDriver {
  driverId: string;
  businessId: string; // Which business they drive for
  userId: string;     // Reference to Firebase Auth user
  
  // Personal info
  name: string;
  phone: string;
  email: string;
  profileImage?: string;
  
  // Driver type
  driverType: 'inhouse' | 'marketplace';
  
  // Vehicle info
  vehicle?: {
    make: string;
    model: string;
    licensePlate: string;
    color: string;
  };
  
  // Status
  status: DriverStatus;
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  
  // Performance
  rating: number; // 1-5 stars
  totalDeliveries: number;
  acceptanceRate: number; // % of offers accepted
  cancellationRate: number;
  
  // Earnings (for marketplace drivers)
  totalEarnings?: number;
  pendingPayouts?: number;
  lastPayout?: string;
  
  // Verification
  backgroundCheckStatus: 'pending' | 'approved' | 'rejected';
  backgroundCheckDate?: string;
  licenseVerified: boolean;
  insuranceVerified: boolean;
  
  // Availability
  activeLocationIds: string[]; // Which locations they can work at
  
  // Dates
  createdAt: string;
  updatedAt: string;
}

/**
 * ORDER OBJECT
 */
export interface LOCLOrder {
  orderId: string;
  businessId: string;
  locationId: string;
  customerId: string;
  
  // Items ordered
  items: Array<{
    menuItemId: string;
    quantity: number;
    price: number;
    customizations?: Record<string, string | number>;
    specialInstructions?: string;
  }>;
  
  // Pricing
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  
  // Delivery info
  deliveryType: DeliveryType;
  status: OrderStatus;
  
  // If delivery: who's delivering?
  assignedDriverId?: string;
  driverType?: 'inhouse' | 'marketplace'; // Was this in-house or overflow?
  
  // Delivery location
  deliveryAddress?: string;
  customerLocation?: {
    lat: number;
    lng: number;
  };
  
  // Timing
  estimatedReadyTime?: string;
  estimatedDeliveryTime?: string;
  actualReadyTime?: string;
  actualDeliveryTime?: string;
  
  // Live features
  liveStreamUrl?: string;
  
  // Customer notes
  customerNotes?: string;
  driverNotes?: string;
  
  // Proof of delivery
  proofOfDeliveryPhoto?: string;
  proofOfDeliverySignature?: string;
  
  // Ratings
  customerRating?: number;
  customerReview?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
}

/**
 * CUSTOMER OBJECT
 * Tracked per business (multi-tenancy: same person is different customer in different businesses)
 */
export interface LOCLCustomer {
  customerId: string;
  businessId: string;
  
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  
  // Loyalty program
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  lifetime_value: number;
  
  // Saved addresses
  savedAddresses: Array<{
    label: string;
    address: string;
    lat: number;
    lng: number;
    isDefault: boolean;
  }>;
  
  // Marketing preferences
  acceptsMarketing: boolean;
  preferredNotificationMethod: 'sms' | 'email' | 'both';
  
  // Recurring orders
  activeSubscriptions?: string[]; // subscription IDs
  
  // Last order
  lastOrderDate?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
}

/**
 * PERMISSION MODEL
 * Used to check if a user can perform an action
 */
export interface PermissionContext {
  user: LOCLUser;
  business: LOCLBusiness;
  role: UserRole;
}

// Permission helpers
export const PERMISSIONS = {
  // Business owner permissions
  owner: {
    canManageBusiness: true,
    canViewOrders: true,
    canManageDrivers: true,
    canManageStaff: true,
    canViewAnalytics: true,
    canManagePayments: true,
    canAccessAPI: true,
  },
  // Manager permissions
  manager: {
    canManageBusiness: false,
    canViewOrders: true,
    canManageDrivers: true,
    canManageStaff: false,
    canViewAnalytics: true,
    canManagePayments: false,
    canAccessAPI: false,
  },
  // Driver permissions
  driver_inhouse: {
    canManageBusiness: false,
    canViewOrders: true,  // Only their assigned orders
    canManageDrivers: false,
    canManageStaff: false,
    canViewAnalytics: false,
    canManagePayments: false,
    canAccessAPI: false,
  },
  // Customer permissions
  customer: {
    canManageBusiness: false,
    canViewOrders: false, // Only their own
    canManageDrivers: false,
    canManageStaff: false,
    canViewAnalytics: false,
    canManagePayments: false,
    canAccessAPI: false,
  },
} as const;
