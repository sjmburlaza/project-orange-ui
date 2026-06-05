import { CheckoutStorageService } from './checkout-storage.service';

describe('CheckoutStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty checkout draft when storage is empty', () => {
    const service = new CheckoutStorageService();

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

    const service = new CheckoutStorageService();

    expect(service.getAll()).toEqual({
      customer: {
        email: 'sam@example.com',
      },
    });
  });

  it('saves one checkout step without discarding existing steps', () => {
    const service = new CheckoutStorageService();

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
    const service = new CheckoutStorageService();

    service.saveStep('payment', {
      method: 'card',
    });
    service.clear();

    expect(service.getAll()).toEqual({});
    expect(localStorage.getItem('checkoutData')).toBeNull();
  });

  it('drops invalid persisted checkout data', () => {
    localStorage.setItem('checkoutData', '{bad-json');

    const service = new CheckoutStorageService();

    expect(service.getAll()).toEqual({});
    expect(localStorage.getItem('checkoutData')).toBeNull();
  });
});
