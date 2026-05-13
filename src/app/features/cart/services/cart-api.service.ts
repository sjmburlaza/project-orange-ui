import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/core/models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/cart';

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.baseUrl);
  }

  addToCart(productId: number): Observable<CartItem[]> {
    return this.http.post<CartItem[]>(`${this.baseUrl}`, {
      productId,
      quantity: 1,
    });
  }

  removeFromCart(productId: number): Observable<CartItem[]> {
    return this.http.delete<CartItem[]>(`${this.baseUrl}/${productId}`);
  }

  clearCart(): Observable<CartItem[]> {
    return this.http.delete<CartItem[]>(this.baseUrl);
  }
}
