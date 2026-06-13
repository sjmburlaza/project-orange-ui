import { computed, inject, Injectable, signal } from '@angular/core';
import {
  isSiteCode,
  SiteCode,
  SITES,
  SUPPORTED_SITE_CODES,
} from 'src/app/core/i18n/sites';
import { BrowserStorageService } from 'src/app/core/services/browser-storage.service';

export interface SiteOption {
  code: SiteCode;
  countryName: string;
  flag: string;
}

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  private readonly storageKey = 'orange.sitePreference';
  private readonly browserStorage = inject(BrowserStorageService);
  private readonly currentSiteSignal = signal<SiteCode>('ph');

  readonly currentSite = this.currentSiteSignal.asReadonly();

  readonly config = computed(() => SITES[this.currentSiteSignal()]);

  setCurrentSite(site: SiteCode): void {
    this.currentSiteSignal.set(site);
  }

  getCurrentSite(): SiteCode {
    return this.currentSiteSignal();
  }

  getPreferredSite(): SiteCode | null {
    const savedSite = this.browserStorage.getItem(this.storageKey);
    return isSiteCode(savedSite) ? savedSite : null;
  }

  saveSitePreference(site: SiteCode): void {
    this.browserStorage.setItem(this.storageKey, site);
  }

  getSiteOptions(): SiteOption[] {
    return SUPPORTED_SITE_CODES.map((site) => ({
      code: site,
      countryName: SITES[site].countryName,
      flag: SITES[site].flag,
    }));
  }
}
