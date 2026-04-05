import { computed, Injectable, signal } from '@angular/core';
import { SiteCode, SiteConfig, SITES } from 'src/app/core/i18n/sites';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  private readonly currentSiteSignal = signal<SiteCode>('ph');

  readonly currentSite = this.currentSiteSignal.asReadonly();

  readonly config = computed<SiteConfig>(() => {
    return SITES[this.currentSiteSignal()];
  });

  setCurrentSite(site: SiteCode): void {
    this.currentSiteSignal.set(site);
  }

  getCurrentSite(): SiteCode {
    return this.currentSiteSignal();
  }

  getSiteConfig(): SiteConfig {
    return this.config();
  }
}
