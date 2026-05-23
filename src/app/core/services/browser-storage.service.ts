import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class BrowserStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  getItem(key: string): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(key);
  }
}
