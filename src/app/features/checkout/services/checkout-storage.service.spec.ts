import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CheckoutStorageService } from './checkout-storage.service';

describe('CheckoutStorageService', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('starts with an empty checkout draft when storage is empty', () => {
    const service = createService();

    expect(service.getAll()).toEqual({});
  });

  it('loads an existing checkout draft from local storage', () => {
    localStorage.setItem(
      'checkoutData',
      JSON.stringify({
        customer: {
          email: 'sam@example.com',
        },
      }),
    );

    const service = createService();

    expect(service.getAll()).toEqual({
      customer: {
        email: 'sam@example.com',
      },
    });
  });

  it('saves one checkout step without discarding existing steps', () => {
    const service = createService();

    service.saveStep('customer', {
      email: 'sam@example.com',
    });
    service.saveStep('shipping', {
      shippingMethod: 'standard',
    });

    expect(service.getAll()).toEqual({
      customer: {
        email: 'sam@example.com',
      },
      shipping: {
        shippingMethod: 'standard',
      },
    });
    expect(JSON.parse(localStorage.getItem('checkoutData') ?? '{}')).toEqual(
      service.getAll(),
    );
  });

  it('clears the in-memory and persisted checkout draft', () => {
    const service = createService();

    service.saveStep('payment', {
      method: 'card',
    });
    service.clear();

    expect(service.getAll()).toEqual({});
    expect(localStorage.getItem('checkoutData')).toBeNull();
  });

  it('drops invalid persisted checkout data', () => {
    localStorage.setItem('checkoutData', '{bad-json');

    const service = createService();

    expect(service.getAll()).toEqual({});
    expect(localStorage.getItem('checkoutData')).toBeNull();
  });

  it('does not touch local storage on the server platform', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    const service = createService('server');

    service.saveStep('customer', {
      email: 'sam@example.com',
    });
    service.clear();

    expect(getItemSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
  });
});

function createService(platformId = 'browser'): CheckoutStorageService {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: PLATFORM_ID,
        useValue: platformId,
      },
    ],
  });

  return TestBed.inject(CheckoutStorageService);
}
