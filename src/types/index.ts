export type MenuCategory = 'rice_combos' | 'grills' | 'fast_bites' | 'drinks';

export interface ItemModifierOption {
  id: string;
  name: string;
  priceDelta: number; // in NGN (₦)
}

export interface ItemModifierGroup {
  id: string;
  title: string;
  required: boolean;
  options: ItemModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in NGN (₦)
  category: MenuCategory;
  imageUrl: string;
  isPopular?: boolean;
  isAvailable?: boolean;
  modifierGroups?: ItemModifierGroup[];
}

export interface CartItemOption {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

export interface CartItem {
  cartItemId: string; // unique instance ID (handles same item with different options)
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: CartItemOption[];
  specialInstructions?: string;
  unitPrice: number; // base price + options priceDelta
  lineTotal: number;
}

export type OrderType = 'delivery' | 'pickup';

export interface VicinityLandmark {
  id: string;
  name: string;
  lat: number;
  lng: number;
  areaNotes?: string;
}

export interface DeliveryCalculation {
  isDeliverable: boolean;
  distanceKm: number;
  fee: number; // in NGN (₦)
  outOfRadiusMessage?: string;
}

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  email?: string;
  orderType: OrderType;
  landmark: string;
  address: string;
  distanceKm: number;
  deliveryFee: number;
  notes?: string;
}

export interface OrderRecord {
  id?: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  landmark: string;
  deliveryAddress: string;
  distanceKm: number;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    options: string[];
    specialInstructions?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paystackReference: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  status: 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed';
  createdAt?: string;
}

export interface CateringPackage {
  id: string;
  name: string;
  tagline: string;
  minGuests: number;
  pricePerGuest: number; // in NGN (₦)
  imageUrl: string;
  highlights: string[];
}

export interface CateringInquiry {
  bookingNumber: string;
  contactName: string;
  phone: string;
  eventDate: string;
  venue: string;
  guestCount: number;
  packageType: string;
  estimatedCost: number;
  notes?: string;
}
