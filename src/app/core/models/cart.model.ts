export interface Cart {
  code: string;
  entries: CartItem[];
  appliedVouchers: Voucher[];
  cartSummary: CartSummaryAttribute[];
}

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  addons: Addon[];
}

export interface Addon {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  isAdded: boolean;
}

export interface Voucher {
  code: string;
  name: string;
  description: string;
}

export interface CartSummaryAttribute {
  name: string;
  amount: number;
}

export interface AddToCartRequest {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  addons: Addon[];
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface ApplyVoucherRequest {
  code: string;
}
