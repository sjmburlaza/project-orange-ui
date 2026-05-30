import { Injectable, signal } from '@angular/core';

type CheckoutData = Record<string, Record<string, any>>;

@Injectable({ providedIn: 'root' })
export class CheckoutStorageService {
  private readonly key = 'checkoutData';

  readonly checkoutData = signal<CheckoutData>(this.load());

  getAll(): CheckoutData {
    return this.checkoutData();
  }

  saveStep(stepId: string, value: Record<string, any>): void {
    this.checkoutData.update((data) => {
      const updatedData = {
        ...data,
        [stepId]: value,
      };

      localStorage.setItem(this.key, JSON.stringify(updatedData));

      return updatedData;
    });
  }

  clear(): void {
    this.checkoutData.set({});
    localStorage.removeItem(this.key);
  }

  private load(): CheckoutData {
    const raw = localStorage.getItem(this.key);

    if (!raw) return {};

    try {
      return JSON.parse(raw) as CheckoutData;
    } catch {
      localStorage.removeItem(this.key);
      return {};
    }
  }
}
