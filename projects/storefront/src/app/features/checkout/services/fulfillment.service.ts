import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type FulfillmentType = 'delivery' | 'pickup';

export interface FulfillmentOption {
  code: string;
  type: FulfillmentType;

  label: string;
  price: number;
  estimatedAvailability: string;

  courierCode?: string;
  courierName?: string;

  pickupLocationId?: string;
  pickupLocationName?: string;
  pickupAddress?: string;
}

@Injectable({ providedIn: 'root' })
export class FulfillmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/fulfillment';

  getOptions(postalCode: string): Observable<FulfillmentOption[]> {
    const params = new HttpParams().set('postalCode', postalCode);

    return this.http.get<FulfillmentOption[]>(`${this.baseUrl}/options`, {
      params,
    });
  }
}
