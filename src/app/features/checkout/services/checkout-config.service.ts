import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DynamicField } from 'src/app/shared/form/dynamic-field.model';

export interface CheckoutStepConfig {
  id: string;
  label: string;
  fields: DynamicField[];
}

export interface CheckoutForm {
  version: string;
  steps: CheckoutStepConfig[];
}

@Injectable({ providedIn: 'root' })
export class CheckoutConfigService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = '/api';

  steps: CheckoutStepConfig[] = [];

  loadCheckoutConfig() {
    this.http.get<CheckoutForm>(`${this.apiUrl}/checkoutForm`).subscribe({
      next: (response) => {
        console.log('response', response);
        this.steps = response.steps;
      },
      error: (err) => {
        console.error(err);
        this.steps = [];
      },
    });
  }

  getStep(id: string) {
    return this.steps.find((s) => s.id === id);
  }
}
