import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

export interface PostalCodeValidationResponse {
  isValid: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class PostalCodeService {
  private readonly http = inject(HttpClient);

  private readonly cache = new Map<
    string,
    Observable<PostalCodeValidationResponse>
  >();

  validate(postalCode: string | number) {
    const normalizedPostalCode = String(postalCode).trim();

    if (!this.cache.has(normalizedPostalCode)) {
      const request$ = this.http
        .get<PostalCodeValidationResponse>('/api/postal-codes/validate', {
          params: {
            postalCode: normalizedPostalCode,
          },
        })
        .pipe(shareReplay(1));

      this.cache.set(normalizedPostalCode, request$);
    }

    return this.cache.get(normalizedPostalCode)!;
  }
}
