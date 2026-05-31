import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface PostalCodeValidationResponse {
  isValid: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class PostalCodeService {
  private readonly http = inject(HttpClient);

  validate(postalCode: string | number) {
    return this.http.get<PostalCodeValidationResponse>(
      '/api/postal-codes/validate',
      {
        params: {
          postalCode,
        },
      },
    );
  }
}
