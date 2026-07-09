import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProductApiService } from './product-api.service';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('passes search to the ranked product endpoint', () => {
    service.getProducts({ search: 'keyboard' }).subscribe();

    const request = http.expectOne(
      (candidate) =>
        candidate.url === '/api/products' &&
        candidate.params.get('search') === 'keyboard',
    );

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('loads search suggestions for the query', () => {
    const suggestions = ['wireless mouse', 'gaming mouse'];

    service.getSearchSuggestions('mouse').subscribe((response) => {
      expect(response).toEqual(suggestions);
    });

    const request = http.expectOne(
      (candidate) =>
        candidate.url === '/api/products/search/suggestions' &&
        candidate.params.get('query') === 'mouse',
    );

    expect(request.request.method).toBe('GET');
    request.flush(suggestions);
  });
});
