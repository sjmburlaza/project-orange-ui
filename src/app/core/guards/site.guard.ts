import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SiteCode, SITES } from 'src/app/core/i18n/sites';
import { SiteService } from 'src/app/core/services/site.services';

export const siteGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const translate = inject(TranslateService);
  const siteService = inject(SiteService);

  const site = route.paramMap.get('site') as SiteCode;

  if (!site || !SITES[site]) {
    return router.createUrlTree(['/ph']);
  }

  const config = SITES[site];

  translate.use(config.lang);
  siteService.setCurrentSite(site);

  return true;
};
