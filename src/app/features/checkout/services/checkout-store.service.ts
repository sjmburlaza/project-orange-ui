import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CheckoutStoreService {
  private shippingData: any;
  private paymentData: any;

  setShipping(data: any) {
    this.shippingData = data;
  }

  setPayment(data: any) {
    this.paymentData = data;
  }

  getShipping() {
    return this.shippingData;
  }

  getPayment() {
    return this.paymentData;
  }

  getOrderSummary() {
    return { shipping: this.shippingData, payment: this.paymentData };
  }
}
