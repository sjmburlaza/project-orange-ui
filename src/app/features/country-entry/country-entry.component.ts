import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  PLATFORM_ID,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { SiteCode, siteFromCountryCode } from 'src/app/core/i18n/sites';
import { CountryDetectionService } from 'src/app/core/services/country-detection.service';
import { SiteService } from 'src/app/core/services/site.services';

@Component({
  selector: 'app-country-entry',
  imports: [],
  templateUrl: './country-entry.component.html',
  styleUrl: './country-entry.component.scss',
})
export class CountryEntryComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly countryDetectionService = inject(CountryDetectionService);
  private readonly siteService = inject(SiteService);

  readonly isResolving = signal(true);
  readonly detectedCountryCode = signal<string | null>(null);
  readonly suggestedSite = signal<SiteCode | null>(null);
  readonly siteOptions = this.siteService.getSiteOptions();
  readonly suggestedOption = computed(
    () =>
      this.siteOptions.find((option) => option.code === this.suggestedSite()) ??
      null,
  );

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const preferredSite = this.siteService.getPreferredSite();

    if (preferredSite) {
      this.redirectToSite(preferredSite);
      return;
    }

    this.countryDetectionService
      .detectCountryCode()
      .pipe(take(1))
      .subscribe((countryCode) => {
        this.detectedCountryCode.set(countryCode);
        this.suggestedSite.set(siteFromCountryCode(countryCode));
        this.isResolving.set(false);
      });
  }

  chooseSite(site: SiteCode): void {
    this.siteService.saveSitePreference(site);
    this.redirectToSite(site);
  }

  private redirectToSite(site: SiteCode): void {
    this.siteService.setCurrentSite(site);
    void this.router.navigate(['/', site, 'products'], { replaceUrl: true });
  }
}
