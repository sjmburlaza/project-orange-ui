import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OptionsService {
  private http = inject(HttpClient);

  getOptions(endpoint: string, params?: any) {
    return this.http.get<any[]>('/api' + endpoint, { params });
  }
}
