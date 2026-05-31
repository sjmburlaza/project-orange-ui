import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AddToCartRequest,
  ApplyVoucherRequest,
  Cart,
  UpdateQuantityRequest,
} from 'src/app/core/models/cart.model';
import { BrowserStorageService } from 'src/app/core/services/browser-storage.service';
import { UpdateCartShippingRequest } from '../../checkout/services/shipping-pricing.service';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly http = inject(HttpClient);
  private readonly browserStorage = inject(BrowserStorageService);
  private readonly baseUrl = '/api/carts';
  private readonly cartCodeKey = 'cartCode';

  getCart(): Observable<Cart | null> {
    const cartCode = this.getCartCode();

    if (!cartCode) {
      return of(null);
    }

    return this.http.get<Cart>(`${this.baseUrl}/${cartCode}`);
  }

  addToCart(request: AddToCartRequest): Observable<Cart> {
    const cartCode = this.getCartCode();

    const url = cartCode
      ? `${this.baseUrl}/${cartCode}/items`
      : `${this.baseUrl}/items`;

    return this.http.post<Cart>(url, request);
  }

  updateQuantity(
    productId: number,
    request: UpdateQuantityRequest,
  ): Observable<Cart> {
    const cartCode = this.requireCartCode();

    return this.http.put<Cart>(
      `${this.baseUrl}/${cartCode}/items/${productId}`,
      request,
    );
  }

  removeItem(productId: number): Observable<Cart> {
    const cartCode = this.requireCartCode();

    return this.http.delete<Cart>(
      `${this.baseUrl}/${cartCode}/items/${productId}`,
    );
  }

  applyVoucher(request: ApplyVoucherRequest): Observable<Cart> {
    const cartCode = this.requireCartCode();

    return this.http.post<Cart>(
      `${this.baseUrl}/${cartCode}/vouchers`,
      request,
    );
  }

  updateShipping(request: UpdateCartShippingRequest): Observable<Cart> {
    const cartCode = this.requireCartCode();

    return this.http.put<Cart>(`${this.baseUrl}/${cartCode}/shipping`, request);
  }

  saveCartCode(cartCode: string): void {
    this.browserStorage.setItem(this.cartCodeKey, cartCode);
  }

  clearCartCode(): void {
    this.browserStorage.removeItem(this.cartCodeKey);
  }

  private getCartCode(): string | null {
    return this.browserStorage.getItem(this.cartCodeKey);
  }

  private requireCartCode(): string {
    const cartCode = this.getCartCode();

    if (!cartCode) {
      throw new Error('Cart has not been created yet.');
    }

    return cartCode;
  }
}
