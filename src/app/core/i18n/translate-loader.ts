import { HttpClient } from '@angular/common/http';
import { MultiTranslateLoader } from 'src/app/core/i18n/multi-translate-loader';

export function translateLoaderFactory(http: HttpClient) {
  return new MultiTranslateLoader(http, ['common', 'home', 'products', 'cart']);
}
