import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isSiteCode, SITES } from 'src/app/core/i18n/sites';
import { SiteService } from 'src/app/core/services/site.services';

export const siteGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const translate = inject(TranslateService);
  const siteService = inject(SiteService);

  const site = route.paramMap.get('site');

  if (!isSiteCode(site)) {
    return router.createUrlTree(['/']);
  }

  const config = SITES[site];

  translate.use(config.defaultLanguage);
  siteService.setCurrentSite(site);

  return true;
};
