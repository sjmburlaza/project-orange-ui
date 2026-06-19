import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import {
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from 'src/app/core/models/order.model';
import { SiteService } from 'src/app/core/services/site.services';

type DisplayStatus = OrderStatus | PaymentStatus;

@Component({
  selector: 'app-order-item',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent {
  private readonly siteService = inject(SiteService);

  readonly order = input.required<OrderItem>();
  readonly isExpanded = signal(false);
  readonly currency = computed(() => this.siteService.currency() || 'PHP');

  readonly subtotal = computed(
    () =>
      this.order().subtotalAmount ??
      this.order().items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
  );
  readonly shippingAmount = computed(() => this.order().shippingAmount ?? 0);
  readonly discountAmount = computed(() => {
    const explicitDiscount = this.order().discountAmount;

    if (explicitDiscount !== undefined) {
      return explicitDiscount;
    }

    return Math.max(
      this.subtotal() + this.shippingAmount() - this.order().totalAmount,
      0,
    );
  });

  setExpanded(isExpanded: boolean): void {
    this.isExpanded.set(isExpanded);
  }

  itemSpecs(item: OrderItem['items'][number]): string {
    return item.itemSpecs.filter(Boolean).join(' • ');
  }

  statusTone(status: DisplayStatus): string {
    switch (status) {
      case 'paid':
      case 'confirmed':
      case 'delivered':
        return 'success';
      case 'pending':
      case 'pending_payment':
        return 'warning';
      case 'packed':
      case 'processing':
      case 'shipped':
      case 'out_for_delivery':
      case 'refunded':
        return 'info';
      case 'failed':
      case 'expired':
      case 'payment_failed':
        return 'error';
      case 'cancelled':
      case 'returned':
        return 'neutral';
    }
  }

  deliveryLabel(order: OrderItem): string {
    if (order.deliveredAt) {
      return 'orders.lookup.deliveredPrefix';
    }

    return 'orders.lookup.estimatedDeliveryPrefix';
  }

  deliveryDate(order: OrderItem): string {
    return order.deliveredAt || order.deliveryEstimate;
  }

  canCancel(order: OrderItem): boolean {
    return ['pending_payment', 'confirmed', 'processing', 'packed'].includes(
      order.orderStatus,
    );
  }

  canChangePayment(order: OrderItem): boolean {
    return order.orderStatus === 'pending_payment';
  }

  canPayNow(order: OrderItem): boolean {
    return (
      order.orderStatus === 'pending_payment' ||
      order.paymentStatus === 'pending'
    );
  }

  canTrack(order: OrderItem): boolean {
    return ['shipped', 'out_for_delivery'].includes(order.orderStatus);
  }

  canBuyAgain(order: OrderItem): boolean {
    return ['delivered', 'cancelled', 'refunded', 'returned'].includes(
      order.orderStatus,
    );
  }

  canReview(order: OrderItem): boolean {
    return order.orderStatus === 'delivered';
  }

  canReturn(order: OrderItem): boolean {
    return order.orderStatus === 'delivered';
  }

  canDownloadInvoice(order: OrderItem): boolean {
    return order.orderStatus === 'delivered' && Boolean(order.invoiceUrl);
  }
}
