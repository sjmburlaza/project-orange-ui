import { Cart } from './cart.model';

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'payment_failed';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'expired'
  | 'refunded';

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryName?: string;
  itemSpecs: string[];
}

export interface OrderShippingAddress {
  recipientName: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2?: string;
  barangay?: string;
  city?: string;
  region?: string;
  postalCode: string;
  country: string;
}

export interface OrderConfirmation {
  id?: string;
  orderNumber: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  shippingAddress: OrderShippingAddress;
  deliveryEstimate: string;
  totalAmount: number;
  nextSteps: string[];
  placedAt: string;
}

export interface PlaceOrderRequest {
  checkoutData: Record<string, Record<string, unknown>>;
  cart: Cart | null;
}
