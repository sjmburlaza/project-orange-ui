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
  stockQuantity: number;
  imageUrl: string;
  categoryName?: string;
  itemSpecs: ItemSpec[];
  addons: Addon[];
}

export interface ItemSpec {
  name: string;
  value: string;
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
  displayValue?: number | string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
  addons: Addon[];
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface ApplyVoucherRequest {
  code: string;
}
