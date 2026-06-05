import type { Category } from '../../src/app/core/models/category.model';
import type {
  Cart,
  CartItem,
  Voucher,
} from '../../src/app/core/models/cart.model';
import type { CheckoutFormConfig } from '../../src/app/core/models/checkout.model';
import type { Product } from '../../src/app/core/models/product.model';
import type { ShippingOption } from '../../src/app/features/checkout/services/shipping-pricing.service';

export const categories: Category[] = [
  { id: 1, name: 'Phones' },
  { id: 2, name: 'Laptops' },
  { id: 3, name: 'Accessories' },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 15',
    description: 'Apple smartphone',
    price: 59999,
    stockQuantity: 10,
    imageUrl: '',
    categoryId: 1,
    categoryName: 'Phones',
  },
  {
    id: 2,
    name: 'MacBook Air M5',
    description: 'Lightweight laptop with M5 chip',
    price: 72990,
    stockQuantity: 5,
    imageUrl: '',
    categoryId: 2,
    categoryName: 'Laptops',
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard',
    price: 3500,
    stockQuantity: 25,
    imageUrl: '',
    categoryId: 3,
    categoryName: 'Accessories',
  },
];

export const checkoutForm: CheckoutFormConfig = {
  version: 'e2e',
  steps: [
    {
      id: 'customer',
      label: 'Customer Details',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          validators: ['required', 'email'].map((name) => ({ name })),
        },
        {
          name: 'firstName',
          type: 'text',
          label: 'First Name',
          validators: [{ name: 'required' }],
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Last Name',
          validators: [{ name: 'required' }],
        },
        {
          name: 'mobileNumber',
          type: 'text',
          label: 'Mobile Number',
          validators: [{ name: 'required' }],
        },
        {
          name: 'deliveryAddress',
          type: 'group',
          label: 'Delivery Address',
          fields: [
            {
              name: 'street',
              type: 'text',
              label: 'Street',
              validators: [{ name: 'required' }],
            },
            {
              name: 'city',
              type: 'text',
              label: 'City',
              validators: [{ name: 'required' }],
            },
            {
              name: 'postalCode',
              type: 'text',
              label: 'Postal Code',
              validators: [{ name: 'required' }],
            },
          ],
        },
      ],
    },
    {
      id: 'shipping',
      label: 'Shipping',
      fields: [
        {
          name: 'shippingMethod',
          type: 'select',
          label: 'Shipping Method',
        },
      ],
    },
    {
      id: 'payment',
      label: 'Payment',
      fields: [
        {
          name: 'paymentMethod',
          type: 'select',
          label: 'Payment Method',
          options: [
            { label: 'Credit Card', value: 'credit-card', icon: 'credit_card' },
            { label: 'Cash on Delivery', value: 'cod', icon: 'payments' },
          ],
        },
      ],
    },
  ],
};

export const shippingOptions: ShippingOption[] = [
  {
    code: 'standard',
    label: 'Standard Delivery',
    price: 0,
    estimatedDelivery: '3-5 business days',
  },
  {
    code: 'express',
    label: 'Express Delivery',
    price: 250,
    estimatedDelivery: '1-2 business days',
  },
];

export const save10Voucher: Voucher = {
  code: 'SAVE10',
  name: 'Save 10',
  description: 'E2E discount',
};

export function createCart(
  entries: CartItem[] = [createCartItem(products[0], 1)],
  appliedVouchers: Voucher[] = [],
): Cart {
  const subtotal = entries.reduce(
    (total, entry) => total + entry.price * entry.quantity,
    0,
  );
  const discount = appliedVouchers.length ? 5000 : 0;
  const total = Math.max(subtotal - discount, 0);

  return {
    code: 'e2e-cart',
    entries,
    appliedVouchers,
    cartSummary: [
      { name: 'Subtotal', amount: subtotal },
      ...(discount
        ? [{ name: 'Voucher Discount', amount: -discount }]
        : []),
      { name: 'Total', amount: total },
    ],
  };
}

export function createCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    productName: product.name,
    price: product.price,
    quantity,
    stockQuantity: product.stockQuantity,
    imageUrl: product.imageUrl,
    categoryName: product.categoryName,
    itemSpecs: [],
    addons: [],
  };
}
