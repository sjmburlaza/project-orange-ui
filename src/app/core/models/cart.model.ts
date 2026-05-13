export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  addons: Addon[];
}

export interface Addon {
  addonId: string;
  addonName: string;
  title: string;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  isAdded: boolean;
}
