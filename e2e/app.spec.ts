import { expect, test, type Page, type Route } from '@playwright/test';
import type {
  AddToCartRequest,
  ApplyVoucherRequest,
  Cart,
  UpdateQuantityRequest,
} from '../src/app/core/models/cart.model';
import type {
  OrderConfirmation,
  PaymentStatus,
  PlaceOrderRequest,
} from '../src/app/core/models/order.model';
import type { SiteConfig } from '../src/app/core/i18n/sites';
import type { ProductSort } from '../src/app/core/models/product.model';
import {
  categories,
  checkoutForm,
  createCart,
  createCartItem,
  products,
  save10Voucher,
  shippingOptions,
} from './fixtures/catalog';

const sitePreferenceKey = 'orange.sitePreference';
const siteConfigs: SiteConfig[] = [
  {
    code: 'ph',
    countryName: 'Philippines',
    locale: 'en-PH',
    currency: 'PHP',
    defaultLanguage: 'en',
    supportedLanguages: ['en'],
    features: {
      insurance: true,
      tradeIn: false,
      vouchers: true,
    },
  },
  {
    code: 'fr',
    countryName: 'France',
    locale: 'fr-FR',
    currency: 'EUR',
    defaultLanguage: 'fr',
    supportedLanguages: ['fr'],
    features: {
      insurance: true,
      tradeIn: true,
      vouchers: true,
    },
  },
  {
    code: 'cn',
    countryName: 'China',
    locale: 'zh-CN',
    currency: 'CNY',
    defaultLanguage: 'zh',
    supportedLanguages: ['zh'],
    features: {
      insurance: true,
      tradeIn: true,
      vouchers: true,
    },
  },
  {
    code: 'jp',
    countryName: 'Japan',
    locale: 'ja-JP',
    currency: 'JPY',
    defaultLanguage: 'ja',
    supportedLanguages: ['ja'],
    features: {
      insurance: true,
      tradeIn: true,
      vouchers: true,
    },
  },
];

test.describe('routing and catalog', () => {
  test.beforeEach(async ({ page }) => {
    await mockOrangeApi(page);
  });

  test('suggests a supported detected country and enters the selected site', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Choose your country' }),
    ).toBeVisible();
    await expect(
      page.getByText('We found Philippines from your connection.'),
    ).toBeVisible();

    await page.getByRole('button', { name: /Continue to Philippines/ }).click();

    await expect(page).toHaveURL(/\/ph\/products$/);
    await expect
      .poll(() =>
        page.evaluate((key) => localStorage.getItem(key), sitePreferenceKey),
      )
      .toBe('ph');
    await expect(
      page.getByRole('heading', { name: 'ORANGE', exact: true }),
    ).toBeVisible();
    await expect(productCard(page, 'iPhone 15')).toBeVisible();
    await expect(productCard(page, 'MacBook Air M5')).toBeVisible();
    await expect(productCard(page, 'Mechanical Keyboard')).toBeVisible();
    await expect(productCard(page, 'Orange Studio Monitor')).toBeVisible();
  });

  test('uses a saved country preference when visiting the root URL', async ({
    page,
  }) => {
    await page.addInitScript(
      ({ key, site }: { key: string; site: string }) => {
        localStorage.setItem(key, site);
      },
      { key: sitePreferenceKey, site: 'jp' },
    );

    await page.goto('/');

    await expect(page).toHaveURL(/\/jp\/products$/);
    await expect(productCard(page, 'iPhone 15')).toBeVisible();
  });

  test('keeps valid country URLs authoritative over a saved preference', async ({
    page,
  }) => {
    await page.addInitScript(
      ({ key, site }: { key: string; site: string }) => {
        localStorage.setItem(key, site);
      },
      { key: sitePreferenceKey, site: 'jp' },
    );

    await page.goto('/fr/products');

    await expect(page).toHaveURL(/\/fr\/products$/);
    await expect(
      page.locator('app-header').getByRole('link', { name: 'Moniteurs' }),
    ).toBeVisible();
    await expect(productCard(page, 'iPhone 15')).toBeVisible();
  });

  test('shows the selector for an unsupported detected country', async ({
    page,
  }) => {
    await mockGeoCountry(page, 'KR');
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Choose your country' }),
    ).toBeVisible();
    await expect(
      page.getByText('Orange is not available in KR yet.'),
    ).toBeVisible();

    await page.getByRole('button', { name: /Japan/ }).click();

    await expect(page).toHaveURL(/\/jp\/products$/);
    await expect(productCard(page, 'iPhone 15')).toBeVisible();
  });

  test('shows the selector when country detection fails', async ({ page }) => {
    await mockGeoError(page);
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Choose your country' }),
    ).toBeVisible();
    await expect(page.getByText(/We found/)).toHaveCount(0);

    await page.getByRole('button', { name: /France/ }).click();

    await expect(page).toHaveURL(/\/fr\/products$/);
    await expect(productCard(page, 'iPhone 15')).toBeVisible();
  });

  test('routes unsupported site codes through the country selector', async ({
    page,
  }) => {
    await mockGeoCountry(page, 'KR');
    await page.goto('/unknown/products');

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole('heading', { name: 'Choose your country' }),
    ).toBeVisible();

    await page.getByRole('button', { name: /China/ }).click();

    await expect(page).toHaveURL(/\/cn\/products$/);
    await expect(productCard(page, 'iPhone 15')).toBeVisible();
  });

  test('omits the toolbar category filter and clears header category filters', async ({
    page,
  }) => {
    const header = page.locator('app-header');

    await page.goto('/ph/products');

    await expect(page.locator('.filter-category')).toHaveCount(0);

    await header.getByRole('link', { name: 'Accessories' }).click();

    await expect(page).toHaveURL(/\/ph\/products\?category=accessories$/);
    await expect(productNames(page)).toHaveText(['Mechanical Keyboard']);

    await page.getByRole('button', { name: 'Clear filters' }).click();

    await expect(page).toHaveURL(/\/ph\/products$/);
    await expect(productNames(page)).toHaveText([
      'iPhone 15',
      'MacBook Air M5',
      'Orange Studio Monitor',
      'Mechanical Keyboard',
    ]);
  });

  test('filters products from the header navigation', async ({ page }) => {
    const header = page.locator('app-header');

    await page.goto('/ph/products');

    await header.getByRole('link', { name: 'Phones' }).click();

    await expect(page).toHaveURL(/\/ph\/products\?category=phones$/);
    await expect(productNames(page)).toHaveText(['iPhone 15']);
    await expect(header.getByRole('link', { name: 'Phones' })).toHaveClass(
      /nav-item--active/,
    );

    await header.getByRole('link', { name: 'Accessories' }).click();

    await expect(page).toHaveURL(/\/ph\/products\?category=accessories$/);
    await expect(productNames(page)).toHaveText(['Mechanical Keyboard']);

    await header.getByRole('link', { name: 'Monitors' }).click();

    await expect(page).toHaveURL(/\/ph\/products\?category=monitors$/);
    await expect(productNames(page)).toHaveText(['Orange Studio Monitor']);

    await header.getByRole('link', { name: 'Store', exact: true }).click();

    await expect(page).toHaveURL(/\/ph\/products$/);
    await expect(productNames(page)).toHaveText([
      'iPhone 15',
      'MacBook Air M5',
      'Orange Studio Monitor',
      'Mechanical Keyboard',
    ]);
  });

  test('sorts products by price in both directions', async ({ page }) => {
    await page.goto('/ph/products');

    await page.locator('.filter-sort mat-select').click();
    await page.getByRole('option', { name: 'Price: Low to High' }).click();

    await expect(productNames(page)).toHaveText([
      'Mechanical Keyboard',
      'Orange Studio Monitor',
      'iPhone 15',
      'MacBook Air M5',
    ]);

    await page.locator('.filter-sort mat-select').click();
    await page.getByRole('option', { name: 'Price: High to Low' }).click();

    await expect(productNames(page)).toHaveText([
      'MacBook Air M5',
      'iPhone 15',
      'Orange Studio Monitor',
      'Mechanical Keyboard',
    ]);
  });

  test('adds a product to cart and shows the confirmation dialog', async ({
    page,
  }) => {
    await page.goto('/ph/products');

    await productCard(page, 'iPhone 15')
      .getByRole('button', { name: 'Buy' })
      .click();

    await expect(
      page.getByRole('heading', { name: 'Added to Cart' }),
    ).toBeVisible();
    await expect(
      page.getByText('Item has been added to your cart.'),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to Cart' })).toBeVisible();
  });
});

test.describe('cart journey', () => {
  test.beforeEach(async ({ page }) => {
    await mockOrangeApi(page);
  });

  test('opens the cart, updates quantity, applies a voucher, and enters checkout', async ({
    page,
  }) => {
    await addIphoneToCart(page);

    await page.getByRole('button', { name: 'Go to Cart' }).click();

    await expect(page).toHaveURL(/\/ph\/cart$/);
    await expect(page.getByRole('heading', { name: 'iPhone 15' })).toBeVisible();
    await expect(page.getByText('In Stock')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
    await expect(page.getByText('Continue to checkout')).toBeVisible();

    const cartItem = page.locator('app-cart-item').filter({ hasText: 'iPhone 15' });
    await cartItem.locator('.quantity-btn').last().click();

    await expect(cartItem.locator('.quantity-input')).toHaveValue('2');
    await expect(page.locator('app-order-summary .total__value')).toContainText(
      '119,998.00',
    );

    await page.getByPlaceholder('Enter Voucher Code').fill('SAVE10');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText('SAVE10')).toBeVisible();
    await expect(page.getByText('Voucher Discount')).toBeVisible();

    await page
      .locator('.applied-vouchers__item')
      .filter({ hasText: 'SAVE10' })
      .getByRole('button', { name: 'Remove' })
      .click();

    await expect(page.getByText('SAVE10')).toHaveCount(0);
    await expect(page.getByText('Voucher Discount')).toHaveCount(0);

    await page.getByRole('button', { name: 'Continue to checkout' }).click();

    await expect(page).toHaveURL(/\/ph\/checkout$/);
    await expect(page.getByText('Customer Details')).toBeVisible();
  });

  test('removes the only cart item and shows the empty cart state', async ({
    page,
  }) => {
    await addIphoneToCart(page);

    await page.getByRole('button', { name: 'Go to Cart' }).click();
    await page
      .locator('app-cart-item')
      .filter({ hasText: 'iPhone 15' })
      .getByRole('button', { name: 'Remove' })
      .click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Remove' })
      .click();

    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });
});

test.describe('auth journey', () => {
  test.beforeEach(async ({ page }) => {
    await mockOrangeApi(page);
  });

  test('shows required validation errors on empty login submit', async ({
    page,
  }) => {
    await page.goto('/ph/auth/login');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Email is required.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();
  });
});

test.describe('checkout journey', () => {
  test.beforeEach(async ({ page }) => {
    await mockOrangeApi(page);
  });

  test('blocks progress until required customer details are valid', async ({
    page,
  }) => {
    await startCheckout(page);

    await page.getByRole('button', { name: 'Next' }).click();

    await expect(page.getByText('Invalid Email')).toBeVisible();
    await expect(page.getByText('Invalid First Name')).toBeVisible();
    await expect(page.getByText('Invalid Last Name')).toBeVisible();
    await expect(page.getByText('Invalid Postal Code')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Choose your shipping method' }),
    ).toHaveCount(0);
  });

  test('completes customer, shipping, payment, and place-order steps', async ({
    page,
  }) => {
    await startCheckout(page);
    await fillCustomerDetails(page);
    await page.getByRole('button', { name: 'Next' }).click();

    await expect(
      page.getByRole('heading', { name: 'Choose your shipping method' }),
    ).toBeVisible();
    await page.getByRole('button', { name: /Standard Delivery/ }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    await expect(
      page.getByRole('heading', { name: 'Choose payment method' }),
    ).toBeVisible();
    await page.getByRole('button', { name: /Credit Card/ }).click();
    await page.getByRole('button', { name: 'Place Order' }).click();

    await expect(page).toHaveURL(/\/ph\/orders\/confirmation\/OR-\d{8}-\d{4}$/);
    await expect(
      page.getByRole('heading', { name: 'Order confirmed' }),
    ).toBeVisible();
    await expect(page.getByText(/Order number OR-\d{8}-\d{4}/)).toBeVisible();
    await expect(page.getByText('Paid', { exact: true })).toBeVisible();
    await expect(page.getByText('Confirmed', { exact: true })).toBeVisible();
    await expect(page.getByText('iPhone 15')).toBeVisible();
    await expect(page.getByText('Ada Lovelace')).toBeVisible();
    await expect(page.getByText('123 Orange Avenue')).toBeVisible();
    await expect(page.getByText('3-5 business days')).toBeVisible();
    await expect(page.getByText('Total amount')).toBeVisible();
    await expect(
      page.getByText('Your payment has been processed successfully.'),
    ).toBeVisible();
  });
});

function productCard(page: Page, name: string) {
  return page.locator('app-product-card').filter({ hasText: name });
}

function productNames(page: Page) {
  return page.locator('app-product-card .product__name');
}

async function addIphoneToCart(page: Page): Promise<void> {
  await page.goto('/ph/products');

  await productCard(page, 'iPhone 15')
    .getByRole('button', { name: 'Buy' })
    .click();

  await expect(
    page.getByRole('heading', { name: 'Added to Cart' }),
  ).toBeVisible();
}

async function startCheckout(page: Page): Promise<void> {
  await addIphoneToCart(page);
  await page.getByRole('button', { name: 'Go to Cart' }).click();
  await page.getByRole('button', { name: 'Continue to checkout' }).click();

  await expect(page).toHaveURL(/\/ph\/checkout$/);
  await expect(page.getByText('Customer Details')).toBeVisible();
}

async function fillCustomerDetails(page: Page): Promise<void> {
  await page.getByLabel('Email').fill('ada@example.com');
  await page.getByLabel('First Name').fill('Ada');
  await page.getByLabel('Last Name').fill('Lovelace');
  await page.getByLabel('Mobile Number').fill('09171234567');
  await page.getByLabel('Street').fill('123 Orange Avenue');
  await page.getByLabel('City').fill('Manila');
  await page.getByLabel('Postal Code').fill('1000');
}

async function mockOrangeApi(page: Page): Promise<void> {
  const state = {
    cart: createCart(),
    orderSequence: 1,
    orders: new Map<string, OrderConfirmation>(),
  };

  await mockGeoCountry(page, 'PH');
  await mockSites(page);

  await page.route(/\/api\/(?:[a-z]{2}\/)?categories$/, async (route) => {
    await route.fulfill({ json: categories });
  });

  await page.route(
    /\/api\/(?:[a-z]{2}\/)?products(?:\?.*)?$/,
    async (route) => {
      const url = new URL(route.request().url());
      const categoryId = url.searchParams.get('categoryId');
      const sortBy = url.searchParams.get('sortBy') as ProductSort | null;
      const minPrice = Number(url.searchParams.get('minPrice') ?? 0);
      const maxPrice = Number(url.searchParams.get('maxPrice') ?? 100000);
      const filteredProducts = categoryId
        ? products.filter((product) => product.categoryId === Number(categoryId))
        : [...products];
      const visibleProducts = sortProducts(
        filteredProducts.filter(
          (product) => product.price >= minPrice && product.price <= maxPrice,
        ),
        sortBy,
      );

      await route.fulfill({ json: visibleProducts });
    },
  );

  await page.route(/\/api\/(?:[a-z]{2}\/)?carts(?:\/.*)?$/, async (route) => {
    await handleCartRoute(route, state);
  });

  await page.route(/\/api\/(?:[a-z]{2}\/)?orders(?:\/.*)?$/, async (route) => {
    await handleOrderRoute(route, state);
  });

  await page.route(/\/api\/(?:[a-z]{2}\/)?checkout\/form$/, async (route) => {
    await route.fulfill({ json: checkoutForm });
  });

  await page.route(
    /\/api\/(?:[a-z]{2}\/)?shipping\/options(?:\?.*)?$/,
    async (route) => {
      await route.fulfill({ json: shippingOptions });
    },
  );
}

async function mockSites(page: Page): Promise<void> {
  await page.route(/\/api\/sites$/, async (route) => {
    await route.fulfill({ json: { sites: siteConfigs } });
  });

  await page.route(/\/api\/sites\/[^/]+$/, async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    const siteCode = pathname.split('/').at(-1);
    const site = siteConfigs.find((config) => config.code === siteCode);

    if (!site) {
      await route.fulfill({
        status: 404,
        json: { message: 'Site not found' },
      });
      return;
    }

    await route.fulfill({ json: site });
  });
}

async function mockGeoCountry(
  page: Page,
  countryCode: string | null,
): Promise<void> {
  await page.route(/\/api\/geo\/country$/, async (route) => {
    await route.fulfill({ json: { countryCode } });
  });
}

async function mockGeoError(page: Page): Promise<void> {
  await page.route(/\/api\/geo\/country$/, async (route) => {
    await route.fulfill({ status: 500, json: { message: 'Not available' } });
  });
}

function sortProducts(productsToSort: typeof products, sortBy: ProductSort | null) {
  const sortedProducts = [...productsToSort];

  switch (sortBy) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sortedProducts;
  }
}

async function handleCartRoute(
  route: Route,
  state: { cart: Cart },
): Promise<void> {
  const request = route.request();
  const url = new URL(request.url());
  const pathname = apiPathname(url);
  const segments = pathname.split('/').filter(Boolean);
  const method = request.method();

  if (method === 'GET' && segments.at(-1) === 'e2e-cart') {
    await route.fulfill({ json: state.cart });
    return;
  }

  if (method === 'POST' && pathname === '/api/carts/items') {
    const body = request.postDataJSON() as AddToCartRequest;
    const product = products.find((item) => item.id === body.productId);

    if (!product) {
      await route.fulfill({ status: 404, json: { message: 'Product not found' } });
      return;
    }

    state.cart = createCart([createCartItem(product, body.quantity)]);
    await route.fulfill({ json: state.cart });
    return;
  }

  if (method === 'PUT' && segments.at(-2) === 'items') {
    const productId = Number(segments.at(-1));
    const body = request.postDataJSON() as UpdateQuantityRequest;

    state.cart = updateCartItemQuantity(state.cart, productId, body.quantity);
    await route.fulfill({ json: state.cart });
    return;
  }

  if (method === 'DELETE' && segments.at(-2) === 'items') {
    const productId = Number(segments.at(-1));

    state.cart = createCart(
      state.cart.entries.filter((entry) => entry.productId !== productId),
      state.cart.appliedVouchers,
    );
    await route.fulfill({ json: state.cart });
    return;
  }

  if (method === 'POST' && segments.at(-1) === 'vouchers') {
    const body = request.postDataJSON() as ApplyVoucherRequest;
    const vouchers = body.code === save10Voucher.code ? [save10Voucher] : [];

    state.cart = createCart(state.cart.entries, vouchers);
    await route.fulfill({ json: state.cart });
    return;
  }

  if (method === 'DELETE' && segments.at(-2) === 'vouchers') {
    state.cart = createCart(state.cart.entries);
    await route.fulfill({ json: state.cart });
    return;
  }

  if (method === 'PUT' && segments.at(-1) === 'shipping') {
    await route.fulfill({ json: state.cart });
    return;
  }

  await route.fulfill({ status: 404, json: { message: 'Not mocked' } });
}

async function handleOrderRoute(
  route: Route,
  state: {
    cart: Cart;
    orderSequence: number;
    orders: Map<string, OrderConfirmation>;
  },
): Promise<void> {
  const request = route.request();
  const url = new URL(request.url());
  const pathname = apiPathname(url);
  const segments = pathname.split('/').filter(Boolean);
  const method = request.method();

  if (method === 'GET' && pathname === '/api/orders') {
    await route.fulfill({ json: [...state.orders.values()] });
    return;
  }

  if (method === 'GET' && segments.at(-2) === 'orders') {
    const orderNumber = decodeURIComponent(segments.at(-1) ?? '');
    const order = state.orders.get(orderNumber);

    if (!order) {
      await route.fulfill({ status: 404, json: { message: 'Order not found' } });
      return;
    }

    await route.fulfill({ json: order });
    return;
  }

  if (method === 'POST' && pathname === '/api/orders') {
    const body = request.postDataJSON() as PlaceOrderRequest;
    const order = createOrderConfirmation(body, state.cart, state.orderSequence);

    state.orderSequence += 1;
    state.orders.set(order.orderNumber, order);
    await route.fulfill({ json: order });
    return;
  }

  await route.fulfill({ status: 404, json: { message: 'Not mocked' } });
}

function apiPathname(url: URL): string {
  const segments = url.pathname.split('/').filter(Boolean);

  if (segments[0] === 'api' && segments[1]?.length === 2) {
    return `/api/${segments.slice(2).join('/')}`;
  }

  return url.pathname;
}

function updateCartItemQuantity(
  cart: Cart,
  productId: number,
  quantity: number,
): Cart {
  return createCart(
    cart.entries.map((entry) =>
      entry.productId === productId ? { ...entry, quantity } : entry,
    ),
    cart.appliedVouchers,
  );
}

function createOrderConfirmation(
  request: PlaceOrderRequest,
  fallbackCart: Cart,
  sequence: number,
): OrderConfirmation {
  const cart = request.cart ?? fallbackCart;
  const orderNumber = `OR-20260618-${String(sequence).padStart(4, '0')}`;
  const payment = asRecord(request.checkoutData['payment']);
  const shipping = asRecord(request.checkoutData['shipping']);
  const paymentMethod = readString(payment, 'paymentMethod', 'credit-card');
  const shippingMethod = readString(shipping, 'shippingMethod', 'standard');
  const paymentStatus: PaymentStatus =
    paymentMethod === 'cod' ? 'pending' : 'paid';

  return {
    id: orderNumber,
    orderNumber,
    paymentStatus,
    orderStatus: paymentStatus === 'paid' ? 'confirmed' : 'pending_payment',
    items: cart.entries.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      categoryName: item.categoryName,
      itemSpecs: item.itemSpecs.map((spec) => spec.value),
    })),
    shippingAddress: getShippingAddress(request.checkoutData),
    deliveryEstimate:
      shippingMethod === 'express' ? '1-2 business days' : '3-5 business days',
    totalAmount: getCartTotal(cart),
    nextSteps: getNextSteps(request.checkoutData, paymentStatus),
    placedAt: '2026-06-18T00:00:00.000Z',
  };
}

function getShippingAddress(
  checkoutData: PlaceOrderRequest['checkoutData'],
): OrderConfirmation['shippingAddress'] {
  const customer = asRecord(checkoutData['customer']);
  const deliveryAddress = asRecord(customer['deliveryAddress']);
  const firstName = readString(customer, 'firstName');
  const lastName = readString(customer, 'lastName');
  const recipientName = [firstName, lastName].filter(Boolean).join(' ');

  return {
    recipientName,
    mobileNumber: readString(customer, 'mobileNumber'),
    addressLine1:
      readString(deliveryAddress, 'addressLine1') ||
      readString(deliveryAddress, 'street'),
    addressLine2: readString(deliveryAddress, 'addressLine2') || undefined,
    barangay: readString(deliveryAddress, 'barangay') || undefined,
    city: readString(deliveryAddress, 'city'),
    region: readString(deliveryAddress, 'region') || undefined,
    postalCode: readString(deliveryAddress, 'postalCode'),
    country: 'Philippines',
  };
}

function getCartTotal(cart: Cart): number {
  return (
    cart.cartSummary.find((item) => item.name.toLowerCase() === 'total')
      ?.amount ??
    cart.entries.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    )
  );
}

function getNextSteps(
  checkoutData: PlaceOrderRequest['checkoutData'],
  paymentStatus: PaymentStatus,
): string[] {
  const customer = asRecord(checkoutData['customer']);
  const email = readString(customer, 'email');

  return [
    paymentStatus === 'paid'
      ? 'Your payment has been processed successfully.'
      : 'Payment will be collected when your order is delivered.',
    email
      ? `We sent the order details to ${email}.`
      : 'We sent the order details to your email.',
    'We will notify you when the order starts processing.',
  ];
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readString(
  record: Record<string, unknown>,
  key: string,
  fallback = '',
): string {
  const value = record[key];

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return fallback;
}
