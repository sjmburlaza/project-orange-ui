import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

interface GeoCountryResponse {
  code?: string | null;
  country?: string | null;
  countryCode?: string | null;
  country_code?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CountryDetectionService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/geo/country';

  detectCountryCode(): Observable<string | null> {
    return this.http.get<GeoCountryResponse>(this.endpoint).pipe(
      map((response) => {
        const countryCode =
          response.code ??
          response.countryCode ??
          response.country ??
          response.country_code;

        return countryCode?.trim().toUpperCase() || null;
      }),
      catchError(() => of(null)),
    );
  }
}
