import { Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { Cart, CartItem } from 'src/app/core/models/cart.model';
import {
  OrderConfirmation,
  OrderItem,
  OrderShippingAddress,
  OrderStatus,
  PaymentStatus,
  PlaceOrderRequest,
} from 'src/app/core/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly storageKey = 'orange.mockOrders';

  placeOrder(request: PlaceOrderRequest): Observable<OrderConfirmation> {
    const order = this.buildOrder(request);

    return of(order).pipe(
      delay(700),
      tap((createdOrder) => this.saveOrder(createdOrder)),
    );
  }

  getOrder(orderId: string): Observable<OrderConfirmation> {
    const order = this.getSavedOrder(orderId) ?? this.buildFallbackOrder(orderId);

    return of(order).pipe(delay(250));
  }

  private buildOrder(request: PlaceOrderRequest): OrderConfirmation {
    const orderNumber = this.createOrderNumber();
    const payment = this.asRecord(request.checkoutData['payment']);
    const shipping = this.asRecord(request.checkoutData['shipping']);
    const paymentMethod = this.readString(payment, 'paymentMethod', 'card');
    const shippingMethod = this.readString(shipping, 'shippingMethod', 'standard');
    const paymentStatus = this.getPaymentStatus(paymentMethod);

    return {
      id: orderNumber,
      orderNumber,
      paymentStatus,
      orderStatus: this.getOrderStatus(paymentStatus),
      items: this.getOrderItems(request.cart),
      shippingAddress: this.getShippingAddress(request.checkoutData),
      deliveryEstimate: this.getDeliveryEstimate(shippingMethod),
      totalAmount: this.getTotalAmount(request.cart),
      nextSteps: this.getNextSteps(request.checkoutData, paymentStatus),
      placedAt: new Date().toISOString(),
    };
  }

  private buildFallbackOrder(orderId: string): OrderConfirmation {
    const orderNumber = orderId || this.createOrderNumber();

    return {
      id: orderNumber,
      orderNumber,
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      items: [
        {
          productId: 1,
          productName: 'iPhone 15',
          price: 59999,
          quantity: 1,
          imageUrl: '',
          categoryName: 'Phones',
          itemSpecs: ['128GB', 'Black'],
        },
      ],
      shippingAddress: {
        recipientName: 'Ada Lovelace',
        mobileNumber: '09171234567',
        addressLine1: '123 Orange Avenue',
        city: 'Manila',
        postalCode: '1000',
        country: 'Philippines',
      },
      deliveryEstimate: '3-5 business days',
      totalAmount: 59999,
      nextSteps: [
        'Your payment has been processed successfully.',
        'We sent the order details to ada@example.com.',
        'We will notify you when the order starts processing.',
      ],
      placedAt: new Date().toISOString(),
    };
  }

  private getOrderItems(cart: Cart | null): OrderItem[] {
    const entries = cart?.entries ?? [];

    if (!entries.length) {
      return this.buildFallbackOrder('').items;
    }

    return entries.map((item) => this.mapCartItem(item));
  }

  private mapCartItem(item: CartItem): OrderItem {
    return {
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      categoryName: item.categoryName,
      itemSpecs: item.itemSpecs.map((spec) => spec.value),
    };
  }

  private getShippingAddress(
    checkoutData: PlaceOrderRequest['checkoutData'],
  ): OrderShippingAddress {
    const customer = this.asRecord(checkoutData['customer']);
    const deliveryAddress = this.asRecord(customer['deliveryAddress']);
    const firstName = this.readString(customer, 'firstName');
    const lastName = this.readString(customer, 'lastName');
    const recipientName = [firstName, lastName].filter(Boolean).join(' ');

    return {
      recipientName: recipientName || 'Orange Customer',
      mobileNumber: this.readString(customer, 'mobileNumber', '09170000000'),
      addressLine1: this.readFirstString(
        deliveryAddress,
        ['addressLine1', 'street'],
        '123 Orange Avenue',
      ),
      addressLine2: this.readString(deliveryAddress, 'addressLine2') || undefined,
      barangay: this.readString(deliveryAddress, 'barangay') || undefined,
      city: this.readString(deliveryAddress, 'city', 'Manila'),
      region: this.readString(deliveryAddress, 'region') || undefined,
      postalCode: this.readString(deliveryAddress, 'postalCode', '1000'),
      country: 'Philippines',
    };
  }

  private getPaymentStatus(paymentMethod: string): PaymentStatus {
    return paymentMethod === 'cod' ? 'pending' : 'paid';
  }

  private getOrderStatus(paymentStatus: PaymentStatus): OrderStatus {
    return paymentStatus === 'paid' ? 'confirmed' : 'pending_payment';
  }

  private getDeliveryEstimate(shippingMethod: string): string {
    const estimates: Record<string, string> = {
      express: '1-2 business days',
      standard: '3-5 business days',
      free: '5-7 business days',
    };

    return estimates[shippingMethod] ?? '3-5 business days';
  }

  private getTotalAmount(cart: Cart | null): number {
    const cartTotal = cart?.cartSummary.find(
      (item) => item.name.toLowerCase() === 'total',
    )?.amount;

    if (typeof cartTotal === 'number') {
      return cartTotal;
    }

    return (cart?.entries ?? []).reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  private getNextSteps(
    checkoutData: PlaceOrderRequest['checkoutData'],
    paymentStatus: PaymentStatus,
  ): string[] {
    const customer = this.asRecord(checkoutData['customer']);
    const email = this.readString(customer, 'email');
    const paymentMessage =
      paymentStatus === 'paid'
        ? 'Your payment has been processed successfully.'
        : 'Payment will be collected when your order is delivered.';

    return [
      paymentMessage,
      email
        ? `We sent the order details to ${email}.`
        : 'We sent the order details to your email.',
      'We will notify you when the order starts processing.',
    ];
  }

  private saveOrder(order: OrderConfirmation): void {
    const orders = this.loadOrders();

    localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        ...orders,
        [order.id]: order,
      }),
    );
  }

  private getSavedOrder(orderId: string): OrderConfirmation | null {
    return this.loadOrders()[orderId] ?? null;
  }

  private loadOrders(): Record<string, OrderConfirmation> {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw) as Record<string, OrderConfirmation>;
    } catch {
      localStorage.removeItem(this.storageKey);
      return {};
    }
  }

  private createOrderNumber(): string {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);

    return `OR-${yyyy}${mm}${dd}-${random}`;
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  }

  private readString(
    record: Record<string, unknown>,
    key: string,
    fallback = '',
  ): string {
    const value = record[key];

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return String(value);
    }

    return fallback;
  }

  private readFirstString(
    record: Record<string, unknown>,
    keys: string[],
    fallback = '',
  ): string {
    for (const key of keys) {
      const value = this.readString(record, key);

      if (value) {
        return value;
      }
    }

    return fallback;
  }
}
