import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ShippingOption {
  code: string;
  label: string;
  price: number;
  estimatedDelivery: string;
}

export interface UpdateCartShippingRequest {
  postalCode: string;
  shippingMethodCode: string;
}

@Injectable({ providedIn: 'root' })
export class ShippingPricingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/shipping';

  getOptions(postalCode: string): Observable<ShippingOption[]> {
    const params = new HttpParams().set('postalCode', postalCode);

    return this.http.get<ShippingOption[]>(`${this.baseUrl}/options`, {
      params,
    });
  }
}
