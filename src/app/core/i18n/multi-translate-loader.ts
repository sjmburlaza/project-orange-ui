import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { forkJoin, map, Observable } from 'rxjs';

export const I18N_RESOURCES = new InjectionToken<readonly string[]>(
  'I18N_RESOURCES',
  {
    providedIn: 'root',
    factory: () => ['common', 'home', 'products', 'cart'],
  },
);

@Injectable()
export class MultiTranslateLoader implements TranslateLoader {
  private readonly http = inject(HttpClient);
  private readonly resources = inject(I18N_RESOURCES);

  getTranslation(lang: string): Observable<TranslationObject> {
    const requests = this.resources.map((res) =>
      this.http.get<TranslationObject>(`/assets/i18n/${lang}/${res}.json`),
    );

    return forkJoin(requests).pipe(
      map((response) => Object.assign({} as TranslationObject, ...response)),
    );
  }
}
