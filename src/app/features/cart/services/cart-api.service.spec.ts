import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserStorageService } from 'src/app/core/services/browser-storage.service';
import { CartApiService } from './cart-api.service';
import { Cart } from 'src/app/core/models/cart.model';

describe('CartApiService', () => {
  let service: CartApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: BrowserStorageService,
          useValue: {
            getItem: () => 'cart-123',
            setItem: () => undefined,
            removeItem: () => undefined,
          },
        },
      ],
    });

    service = TestBed.inject(CartApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('updates quantity using the variant id in the backend URL', () => {
    const cart = createCart();

    service.updateQuantity(1001, { quantity: 2 }).subscribe((response) => {
      expect(response).toEqual(cart);
    });

    const request = httpMock.expectOne('/api/carts/cart-123/items/1001');

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ quantity: 2 });

    request.flush(cart);
  });

  it('removes an item using the variant id in the backend URL', () => {
    const cart = createCart();

    service.removeItem(1001).subscribe((response) => {
      expect(response).toEqual(cart);
    });

    const request = httpMock.expectOne('/api/carts/cart-123/items/1001');

    expect(request.request.method).toBe('DELETE');

    request.flush(cart);
  });

  it('upserts an item addon using the variant id in the backend URL', () => {
    const cart = createCart();

    service
      .upsertItemAddon(1001, 'insurance', { insurancePlanCode: 'protect-plus' })
      .subscribe((response) => {
        expect(response).toEqual(cart);
      });

    const request = httpMock.expectOne(
      '/api/carts/cart-123/items/1001/addons/insurance',
    );

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      insurancePlanCode: 'protect-plus',
    });

    request.flush(cart);
  });

  it('removes an item addon using the variant id in the backend URL', () => {
    const cart = createCart();

    service.removeItemAddon(1001, 'insurance').subscribe((response) => {
      expect(response).toEqual(cart);
    });

    const request = httpMock.expectOne(
      '/api/carts/cart-123/items/1001/addons/insurance',
    );

    expect(request.request.method).toBe('DELETE');

    request.flush(cart);
  });
});

function createCart(): Cart {
  return {
    code: 'cart-123',
    entries: [
      {
        productId: 1,
        variantId: 1001,
        productName: 'Orange Phone',
        price: 39999,
        quantity: 2,
        stockQuantity: 8,
        imageUrl: '/assets/phone.png',
        itemSpecs: [],
        addons: [
          {
            id: 'insurance',
            name: 'Device protection',
            title: 'Device protection',
            description: 'Coverage for accidental damage.',
            imageUrl: '',
            isAdded: true,
          },
        ],
      },
    ],
    appliedVouchers: [],
    cartSummary: [{ name: 'Total', amount: 79998 }],
  };
}
