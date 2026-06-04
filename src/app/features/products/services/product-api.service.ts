import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InsurancePlan,
  MobilePlan,
  Product,
  ProductDetail,
  ProductFilters,
} from 'src/app/core/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/products';

  getProducts(filters?: Partial<ProductFilters>): Observable<Product[]> {
    let params = new HttpParams();

    if (filters?.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }

    if (filters?.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }

    if (filters?.minPrice != null) {
      params = params.set('minPrice', filters.minPrice);
    }

    if (filters?.maxPrice != null) {
      params = params.set('maxPrice', filters.maxPrice);
    }

    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  getProductById(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.baseUrl}/${id}`);
  }

  getProductInsurancePlans(id: number): Observable<InsurancePlan[]> {
    return this.http.get<InsurancePlan[]>(
      `${this.baseUrl}/${id}/insurance-plans`,
    );
  }

  getProductMobilePlans(id: number): Observable<MobilePlan[]> {
    return this.http.get<MobilePlan[]>(`${this.baseUrl}/${id}/mobile-plans`);
  }
}
