const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');

const PORT = Number(process.env.PORT ?? 5176);
const DEFAULT_SITE = 'ph';
const DEFAULT_ANALYTICS_PERIOD = 'last-7-days';
const CHECKOUT_FORMS_DIR = path.join(__dirname, 'checkout-forms');
const ANALYTICS_TYPES = new Set([
  'visitor',
  'product_view',
  'add_to_cart',
  'checkout_start',
  'purchase',
  'payment_failure',
]);
const ANALYTICS_PERIODS = new Set([
  DEFAULT_ANALYTICS_PERIOD,
  'past-month',
  'past-year',
  'from-start',
]);
const UNSCOPED_API_PREFIXES = new Set(['geo', 'sites']);
const DEFAULT_SITES = [
  {
    code: 'ph',
    countryName: 'Philippines',
    locale: 'en-PH',
    currency: 'PHP',
    defaultLanguage: 'en',
    supportedLanguages: ['en'],
    features: { insurance: true, tradeIn: true, vouchers: true },
  },
  {
    code: 'fr',
    countryName: 'France',
    locale: 'fr-FR',
    currency: 'EUR',
    defaultLanguage: 'fr',
    supportedLanguages: ['fr', 'en'],
    features: { insurance: true, tradeIn: false, vouchers: true },
  },
  {
    code: 'cn',
    countryName: 'China',
    locale: 'zh-CN',
    currency: 'CNY',
    defaultLanguage: 'zh',
    supportedLanguages: ['zh', 'en'],
    features: { insurance: false, tradeIn: false, vouchers: true },
  },
  {
    code: 'jp',
    countryName: 'Japan',
    locale: 'ja-JP',
    currency: 'JPY',
    defaultLanguage: 'ja',
    supportedLanguages: ['ja', 'en'],
    features: { insurance: true, tradeIn: true, vouchers: false },
  },
];
const DEFAULT_FULFILLMENT_OPTIONS = [
  {
    code: 'jnt-standard',
    type: 'delivery',
    courierCode: 'jnt',
    courierName: 'J&T Express',
    label: 'Standard Delivery',
    price: 120,
    estimatedAvailability: '2–4 business days',
  },
  {
    code: 'lbc-express',
    type: 'delivery',
    courierCode: 'lbc',
    courierName: 'LBC Express',
    label: 'Express Delivery',
    price: 180,
    estimatedAvailability: '1–2 business days',
  },
  {
    code: 'pickup-sm-megamall',
    type: 'pickup',
    pickupLocationId: 'sm-megamall',
    pickupLocationName: 'SM Megamall Pickup Point',
    pickupAddress: 'Mandaluyong City',
    label: 'Pick up in store',
    price: 0,
    estimatedAvailability: 'Ready in 1–2 days',
  },
];
const CHECKOUT_PAYMENT_OPTIONS_BY_SITE = {
  ph: [
    {
      label: 'Credit / Debit Card',
      value: 'card',
      icon: 'credit_card',
    },
    {
      label: 'GCash',
      value: 'gcash',
      icon: 'account_balance_wallet',
    },
    {
      label: 'Cash on Delivery',
      value: 'cod',
      icon: 'payments',
    },
  ],
  fr: [
    {
      label: 'Carte bancaire',
      value: 'card',
      icon: 'credit_card',
    },
    {
      label: 'PayPal',
      value: 'paypal',
      icon: 'account_balance_wallet',
    },
    {
      label: 'Virement bancaire',
      value: 'bank-transfer',
      icon: 'account_balance',
    },
  ],
  cn: [
    {
      label: '银行卡 / 银联',
      value: 'unionpay',
      icon: 'credit_card',
    },
    {
      label: '支付宝',
      value: 'alipay',
      icon: 'account_balance_wallet',
    },
    { label: '微信支付', value: 'wechat-pay', icon: 'qr_code' },
  ],
  jp: [
    {
      label: 'クレジット / デビットカード',
      value: 'card',
      icon: 'credit_card',
    },
    { label: 'コンビニ払い', value: 'konbini', icon: 'store' },
    { label: '代金引換', value: 'cod', icon: 'payments' },
  ],
};

const server = jsonServer.create();
const baseDb = readBaseDb();
const router = jsonServer.router({
  ...baseDb,
  categories: baseDb.categories ?? deriveCategories(baseDb.products ?? []),
  sites: baseDb.sites ?? DEFAULT_SITES,
  fulfillmentOptions:
    baseDb.fulfillmentOptions ?? DEFAULT_FULFILLMENT_OPTIONS,
  analyticsEvents: baseDb.analyticsEvents ?? createSeedEvents(),
  wishlistItems: baseDb.wishlistItems ?? [],
});

server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

server.get('/api/geo/country', (_req, res) => {
  // Return a deterministic country lookup for local storefront tests.
  res.jsonp({ countryCode: 'PH' });
});

server.get('/api/sites', (_req, res) => {
  // Expose the configured site list from the mock database.
  res.jsonp({ sites: router.db.get('sites').value() });
});

server.get('/api/sites/:site', (req, res) => {
  // Find a single site by code and report a 404 for unknown locales.
  const site = router.db
    .get('sites')
    .find({ code: req.params.site.toLowerCase() })
    .value();

  if (!site) {
    res.status(404).jsonp({ message: 'Site not found' });
    return;
  }

  res.jsonp(site);
});

server.get('/api/checkout/form', sendCheckoutForm);
server.get('/api/:site/checkout/form', sendCheckoutForm);
server.get('/api/fulfillment/options', sendFulfillmentOptions);
server.get('/api/:site/fulfillment/options', sendFulfillmentOptions);
server.get('/api/options/:kind', sendOptions);
server.get('/api/:site/options/:kind', sendOptions);
server.get('/api/wishlist', sendWishlist);
server.get('/api/:site/wishlist', sendWishlist);
server.post('/api/wishlist/items', addWishlistItem);
server.post('/api/:site/wishlist/items', addWishlistItem);
server.get('/api/wishlist/items/:productId', sendWishlistStatus);
server.get('/api/:site/wishlist/items/:productId', sendWishlistStatus);
server.delete('/api/wishlist/items/:productId', removeWishlistItem);
server.delete('/api/:site/wishlist/items/:productId', removeWishlistItem);
server.get('/api/carts/:cartCode/recommended-products', sendRecommendedProducts);
server.get(
  '/api/:site/carts/:cartCode/recommended-products',
  sendRecommendedProducts,
);

server.get('/api/admin/analytics/dashboard', (req, res) => {
  // Build an analytics dashboard from all events or a query-scoped site.
  res.jsonp(buildDashboard(getAnalyticsEvents(req), getAnalyticsPeriod(req)));
});

server.get('/api/:site/admin/analytics/dashboard', (req, res) => {
  // Build an analytics dashboard for the site captured in the route.
  res.jsonp(
    buildDashboard(
      getAnalyticsEvents(req, req.params.site),
      getAnalyticsPeriod(req),
    ),
  );
});

server.post('/api/analytics/events', (req, res) => {
  // Persist unscoped analytics events and return the refreshed dashboard.
  saveAnalyticsEvents(req, res);
});

server.post('/api/:site/analytics/events', (req, res) => {
  // Persist site-scoped analytics events and return the refreshed dashboard.
  saveAnalyticsEvents(req, res, req.params.site);
});

server.use(rewriteSiteScopedApi);
server.use('/api', router);

server.listen(PORT, () => {
  // Print the mock server URL and important analytics routes at startup.
  console.log(`Mock API listening on http://localhost:${PORT}`);
  console.log('Analytics endpoints:');
  console.log('  GET  /api/admin/analytics/dashboard');
  console.log('  POST /api/analytics/events');
});

// Load the base fixture database and omit schema metadata before routing.
function readBaseDb() {
  const dbPath = path.join(__dirname, '..', 'db.json');
  const source = fs.readFileSync(dbPath, 'utf8');
  const { $schema: _schema, ...db } = JSON.parse(source);

  return db;
}

// Send the checkout form for a site, falling back to the default fixture.
function sendCheckoutForm(req, res) {
  const site = normalizeSite(req.params.site) ?? DEFAULT_SITE;
  const checkoutForm =
    readCheckoutFormFixture(site) ??
    readCheckoutFormFixture(DEFAULT_SITE);

  if (!checkoutForm) {
    res.status(404).jsonp({ message: 'Checkout form not found' });
    return;
  }

  res.jsonp(applyCheckoutPaymentOptions(checkoutForm, site));
}

// Read a checkout form JSON fixture when the requested site name is safe.
function readCheckoutFormFixture(site) {
  const normalizedSite = normalizeSite(site);

  if (!normalizedSite || !/^[a-z0-9-]+$/.test(normalizedSite)) {
    return null;
  }

  const checkoutFormPath = path.join(
    CHECKOUT_FORMS_DIR,
    `${normalizedSite}.json`,
  );

  if (!fs.existsSync(checkoutFormPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(checkoutFormPath, 'utf8'));
}

// Clone the checkout form and replace payment options with site-local values.
function applyCheckoutPaymentOptions(checkoutForm, site) {
  const paymentOptions =
    CHECKOUT_PAYMENT_OPTIONS_BY_SITE[site] ??
    CHECKOUT_PAYMENT_OPTIONS_BY_SITE[DEFAULT_SITE];
  const localizedForm = JSON.parse(JSON.stringify(checkoutForm));
  const paymentStep = localizedForm.steps?.find((step) => step.id === 'payment');
  const paymentField = paymentStep?.fields?.find(
    (field) => field.name === 'paymentMethod',
  );

  if (!paymentField) {
    return localizedForm;
  }

  localizedForm.version = resolveCheckoutFormVersion(
    localizedForm.version,
    site,
  );
  paymentField.options = paymentOptions;

  return localizedForm;
}

// Ensure checkout form versions are namespaced by the active site code.
function resolveCheckoutFormVersion(version, site) {
  return typeof version === 'string' && version.startsWith(`${site}-`)
    ? version
    : `${site}-1.0`;
}

// Return the fulfillment methods available to the mock checkout flow.
function sendFulfillmentOptions(_req, res) {
  res.jsonp(router.db.get('fulfillmentOptions').value());
}

// Return an arbitrary option collection by route parameter, or an empty list.
function sendOptions(req, res) {
  const collection = router.db.get(req.params.kind).value();

  res.jsonp(Array.isArray(collection) ? collection : []);
}

// Return the wishlist summary for the current or default site.
function sendWishlist(req, res) {
  res.jsonp(buildWishlistResponse(req.params.site));
}

// Add a product to the site wishlist when it exists and is not already saved.
function addWishlistItem(req, res) {
  const productId = Number(req.body?.productId);
  const product = findProductById(productId);

  if (!product) {
    res.status(404).jsonp({ message: 'Product not found' });
    return;
  }

  const site = normalizeSite(req.params.site) ?? DEFAULT_SITE;
  const wishlistItems = getWishlistItemsCollection();
  const existing = wishlistItems.find(
    (item) =>
      Number(item.productId) === productId &&
      normalizeSite(item.site ?? DEFAULT_SITE) === site,
  );

  if (!existing) {
    router.db
      .get('wishlistItems')
      .push({
        id: getNextWishlistItemId(),
        productId,
        site,
        addedAtUtc: new Date().toISOString(),
      })
      .write();
  }

  res.status(201).jsonp(buildWishlistResponse(site));
}

// Report whether a product is currently saved in the site wishlist.
function sendWishlistStatus(req, res) {
  const productId = Number(req.params.productId);
  const site = normalizeSite(req.params.site) ?? DEFAULT_SITE;
  const isWishlisted = getWishlistItemsCollection().some(
    (item) =>
      Number(item.productId) === productId &&
      normalizeSite(item.site ?? DEFAULT_SITE) === site,
  );

  res.jsonp({ productId, isWishlisted });
}

// Remove a product from the site wishlist and return the updated summary.
function removeWishlistItem(req, res) {
  const productId = Number(req.params.productId);
  const site = normalizeSite(req.params.site) ?? DEFAULT_SITE;
  const wishlistItems = getWishlistItemsCollection();
  const nextItems = wishlistItems.filter(
    (item) =>
      !(
        Number(item.productId) === productId &&
        normalizeSite(item.site ?? DEFAULT_SITE) === site
      ),
  );

  router.db.set('wishlistItems', nextItems).write();

  res.jsonp(buildWishlistResponse(site));
}

// Build a wishlist response with product summaries attached to each item.
function buildWishlistResponse(site) {
  const normalizedSite = normalizeSite(site) ?? DEFAULT_SITE;
  const items = getWishlistItemsCollection()
    .filter(
      (item) => normalizeSite(item.site ?? DEFAULT_SITE) === normalizedSite,
    )
    .map((item) => {
      const product = findProductById(item.productId);

      return product
        ? {
            id: Number(item.id),
            productId: Number(item.productId),
            addedAtUtc: item.addedAtUtc,
            product: toWishlistProductSummary(product),
          }
        : null;
    })
    .filter(Boolean);

  return {
    count: items.length,
    items,
  };
}

// Safely read wishlist items from the json-server database.
function getWishlistItemsCollection() {
  const wishlistItems = router.db.get('wishlistItems').value();

  return Array.isArray(wishlistItems) ? wishlistItems : [];
}

// Pick the next wishlist item id by incrementing the current maximum id.
function getNextWishlistItemId() {
  return (
    getWishlistItemsCollection().reduce(
      (max, item) => Math.max(max, Number(item.id) || 0),
      0,
    ) + 1
  );
}

// Find a product by numeric id in the mock product collection.
function findProductById(productId) {
  const products = router.db.get('products').value();

  return Array.isArray(products)
    ? products.find((product) => Number(product.id) === Number(productId))
    : null;
}

// Convert a product record into the smaller shape returned by wishlist APIs.
function toWishlistProductSummary(product) {
  const stockQuantity = Number(product.stockQuantity ?? 0);

  return {
    id: Number(product.id),
    name: product.name,
    description: product.description,
    price: Number(product.price ?? 0),
    stockStatus: product.stockStatus ?? getStockStatus(stockQuantity),
    stockQuantity,
    imageUrl: product.imageUrl,
    categoryId: Number(product.categoryId),
    categoryName: product.categoryName,
    subcategoryName: product.subcategoryName,
    itemSpecs: product.itemSpecs ?? [],
    availableColors: product.availableColors ?? [],
  };
}

// Return up to four products that are not already present in the cart.
function sendRecommendedProducts(req, res) {
  const products = router.db.get('products').value();
  const cartProductIds = getCartProductIds(req.params.cartCode);
  const recommendedProducts = (Array.isArray(products) ? products : [])
    .filter((product) => !cartProductIds.has(String(product.id)))
    .map(toRecommendedProduct)
    .slice(0, 4);

  res.jsonp(recommendedProducts);
}

// Add default variant-related fields to legacy products when needed.
function toRecommendedProduct(product) {
  if (Array.isArray(product?.variants)) {
    return product;
  }

  const stockQuantity = Number(product.stockQuantity ?? 0);

  return {
    ...product,
    features: product.features ?? [],
    whatsInTheBox: product.whatsInTheBox ?? [],
    optionGroups: product.optionGroups ?? [],
    variants: [
      {
        id: Number(product.id) * 1000 + 1,
        sku: `${product.id}-${Number(product.id) * 1000 + 1}`,
        price: Number(product.price ?? 0),
        stockQuantity,
        stockStatus: getStockStatus(stockQuantity),
        imageUrl: product.imageUrl,
        options: {},
      },
    ],
  };
}

// Translate stock quantity into the storefront stock status vocabulary.
function getStockStatus(stockQuantity) {
  if (stockQuantity <= 0) {
    return 'outOfStock';
  }

  return stockQuantity <= 5 ? 'lowStock' : 'inStock';
}

// Read product ids from either the modern carts collection or legacy cart data.
function getCartProductIds(cartCode) {
  const carts = router.db.get('carts').value();

  if (Array.isArray(carts)) {
    const cart = carts.find(
      (item) => String(item.code ?? item.id) === String(cartCode),
    );

    return new Set(getCartLineItems(cart).map((item) => String(item.productId)));
  }

  const legacyCart = router.db.get('cart').value();

  if (Array.isArray(legacyCart)) {
    return new Set(legacyCart.map((item) => String(item.productId)));
  }

  return new Set();
}

// Normalize cart line item arrays across modern entries and legacy items fields.
function getCartLineItems(cart) {
  if (!cart || typeof cart !== 'object') {
    return [];
  }

  if (Array.isArray(cart.entries)) {
    return cart.entries;
  }

  return Array.isArray(cart.items) ? cart.items : [];
}

// Rewrite site-scoped collection URLs so json-server can serve shared data.
function rewriteSiteScopedApi(req, _res, next) {
  const match = req.url.match(/^\/api\/([^/?]+)\/(.+)$/);

  if (!match) {
    next();
    return;
  }

  const [, prefix, rest] = match;

  if (UNSCOPED_API_PREFIXES.has(prefix)) {
    next();
    return;
  }

  const collection = rest.split(/[/?]/)[0];

  if (router.db.get(collection).value() !== undefined) {
    req.url = `/api/${rest}`;
  }

  next();
}

// Persist accepted analytics events and return the updated dashboard payload.
function saveAnalyticsEvents(req, res, site) {
  const incomingEvents = normalizeAnalyticsPayload(req.body, site);
  const events = router.db.get('analyticsEvents');
  const currentEvents = events.value();
  const acceptedEvents = incomingEvents.filter(
    (event) => !isDuplicatePurchase(currentEvents, event),
  );

  if (acceptedEvents.length) {
    events.push(...acceptedEvents).write();
  }

  res
    .status(201)
    .jsonp(
      buildDashboard(getAnalyticsEvents(req, site), getAnalyticsPeriod(req)),
    );
}

// Convert single-event, array, or batched payloads into normalized events.
function normalizeAnalyticsPayload(body, site) {
  const values = Array.isArray(body?.events)
    ? body.events
    : Array.isArray(body)
      ? body
      : body
        ? [body]
        : [];

  return values
    .map((event) => normalizeAnalyticsEvent(event, site))
    .filter(Boolean);
}

// Validate event type and fill in missing analytics fields with defaults.
function normalizeAnalyticsEvent(event, site) {
  if (!event || !ANALYTICS_TYPES.has(event.type)) {
    return null;
  }

  const value = readEventValue(event);

  return {
    ...event,
    id: typeof event.id === 'string' ? event.id : createId(event.type),
    occurredAt:
      typeof event.occurredAt === 'string'
        ? event.occurredAt
        : new Date().toISOString(),
    visitorId:
      typeof event.visitorId === 'string' ? event.visitorId : createId('visitor'),
    sessionId:
      typeof event.sessionId === 'string' ? event.sessionId : createId('session'),
    value,
    site: normalizeSite(site ?? event.site ?? DEFAULT_SITE),
  };
}

// Detect duplicate purchases so retries do not inflate revenue and orders.
function isDuplicatePurchase(events, event) {
  if (event.type !== 'purchase' || !event.orderNumber) {
    return false;
  }

  return events.some(
    (existing) =>
      existing.type === 'purchase' &&
      existing.orderNumber === event.orderNumber &&
      normalizeSite(existing.site ?? DEFAULT_SITE) === event.site,
  );
}

// Read analytics events, optionally filtering by route or query site code.
function getAnalyticsEvents(req, site) {
  const querySite = typeof req.query.site === 'string' ? req.query.site : null;
  const normalizedSite = normalizeSite(site ?? querySite);
  const events = router.db.get('analyticsEvents').value();

  if (!normalizedSite) {
    return events;
  }

  return events.filter((event) => {
    const eventSite = event.site ? normalizeSite(event.site) : null;

    return !eventSite || eventSite === normalizedSite;
  });
}

// Resolve a supported dashboard period from the query string.
function getAnalyticsPeriod(req) {
  const period =
    typeof req.query.period === 'string'
      ? req.query.period
      : DEFAULT_ANALYTICS_PERIOD;

  return ANALYTICS_PERIODS.has(period) ? period : DEFAULT_ANALYTICS_PERIOD;
}

// Aggregate analytics events into the dashboard metrics used by the admin UI.
function buildDashboard(events, period = DEFAULT_ANALYTICS_PERIOD) {
  const scopedEvents = filterEventsByPeriod(events, period);
  const visitors = uniqueCount(
    scopedEvents.filter((event) => event.type === 'visitor'),
    (event) => event.visitorId,
  );
  const productViews = countEvents(scopedEvents, 'product_view');
  const addToCarts = countEvents(scopedEvents, 'add_to_cart');
  const checkoutStarts = countEvents(scopedEvents, 'checkout_start');
  const purchases = countEvents(scopedEvents, 'purchase');
  const paymentFailures = countEvents(scopedEvents, 'payment_failure');
  const purchaseEvents = scopedEvents.filter((event) => event.type === 'purchase');
  const revenue = purchaseEvents.reduce(
    (total, event) => total + readEventValue(event),
    0,
  );
  const unitsSold = purchaseEvents.reduce(
    (total, event) => total + sumItems(event.items),
    0,
  );
  const topProducts = buildTopProducts(scopedEvents);
  const topCategories = buildTopCategories(topProducts);

  return {
    visitors,
    productViews,
    addToCarts,
    checkoutStarts,
    purchases,
    revenue,
    averageOrderValue: safeDivide(revenue, purchases),
    addToCartRate: safeDivide(addToCarts, productViews),
    checkoutStartRate: safeDivide(checkoutStarts, addToCarts),
    purchaseConversionRate: safeDivide(purchases, visitors),
    cartAbandonmentRate: safeDivide(
      Math.max(addToCarts - purchases, 0),
      addToCarts,
    ),
    paymentFailures,
    paymentFailureRate: safeDivide(paymentFailures, purchases + paymentFailures),
    unitsSold,
    daily: buildDailyPoints(scopedEvents, period),
    funnel: buildFunnel({
      visitors,
      productViews,
      addToCarts,
      checkoutStarts,
      purchases,
    }),
    topProducts,
    topCategories,
    orders: buildOrders(purchaseEvents),
    paymentFailureEvents: buildPaymentFailures(
      scopedEvents.filter((event) => event.type === 'payment_failure'),
    ),
  };
}

// Keep only events that fall within the selected analytics period.
function filterEventsByPeriod(events, period) {
  const cutoff = getAnalyticsPeriodStart(period);

  if (!cutoff) return events;

  return events.filter((event) => {
    const occurredAt = new Date(event.occurredAt);

    return !Number.isNaN(occurredAt.getTime()) && occurredAt >= cutoff;
  });
}

// Calculate the start date for each supported analytics dashboard period.
function getAnalyticsPeriodStart(period) {
  const today = startOfDay(new Date());

  switch (period) {
    case 'past-month':
      return addDays(today, -29);
    case 'past-year':
      return addDays(today, -364);
    case 'from-start':
      return null;
    case 'last-7-days':
    default:
      return addDays(today, -6);
  }
}

// Choose daily or monthly chart buckets based on the selected period length.
function buildDailyPoints(events, period) {
  if (period === 'past-year') {
    return buildMonthlyPoints(events, addMonths(startOfMonth(new Date()), -11));
  }

  if (period === 'from-start') {
    const earliest = findEarliestEventDate(events);

    if (!earliest) return [];

    const today = startOfDay(new Date());
    const start = startOfDay(earliest);
    const days = daysBetween(start, today) + 1;

    if (days > 45) {
      return buildMonthlyPoints(events, startOfMonth(start));
    }

    return buildDayPoints(events, start, today);
  }

  const today = startOfDay(new Date());
  const dayCount = period === 'past-month' ? 30 : 7;

  return buildDayPoints(events, addDays(today, -(dayCount - 1)), today);
}

// Build one analytics point per day and add each event to its matching point.
function buildDayPoints(events, startDate, endDate) {
  const points = new Map();

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const key = dateKey(date);

    points.set(key, createAnalyticsPoint(key, formatDayLabel(date)));
  }

  for (const event of events) {
    const key = dateKey(new Date(event.occurredAt));
    const point = points.get(key);

    if (!point) continue;

    addEventToPoint(point, event);
  }

  return [...points.values()];
}

// Build one analytics point per month and add each event to its matching point.
function buildMonthlyPoints(events, startDate) {
  const points = new Map();
  const endDate = startOfMonth(new Date());

  for (let date = startDate; date <= endDate; date = addMonths(date, 1)) {
    const key = monthKey(date);

    points.set(key, createAnalyticsPoint(key, formatMonthLabel(date)));
  }

  for (const event of events) {
    const occurredAt = new Date(event.occurredAt);

    if (Number.isNaN(occurredAt.getTime())) continue;

    const point = points.get(monthKey(occurredAt));

    if (!point) continue;

    addEventToPoint(point, event);
  }

  return [...points.values()];
}

// Create a zero-filled chart point for one day or month bucket.
function createAnalyticsPoint(dateKey, label) {
  return {
    dateKey,
    label,
    visitors: 0,
    productViews: 0,
    addToCarts: 0,
    checkoutStarts: 0,
    purchases: 0,
    revenue: 0,
    paymentFailures: 0,
  };
}

// Mutate a chart point by incrementing the metric represented by an event.
function addEventToPoint(point, event) {
  switch (event.type) {
    case 'visitor':
      point.visitors += 1;
      break;
    case 'product_view':
      point.productViews += 1;
      break;
    case 'add_to_cart':
      point.addToCarts += 1;
      break;
    case 'checkout_start':
      point.checkoutStarts += 1;
      break;
    case 'purchase':
      point.purchases += 1;
      point.revenue += readEventValue(event);
      break;
    case 'payment_failure':
      point.paymentFailures += 1;
      break;
  }
}

// Convert aggregate counts into funnel steps with conversion rates.
function buildFunnel(values) {
  const steps = [
    { label: 'Visitors', value: values.visitors },
    { label: 'Product views', value: values.productViews },
    { label: 'Add to cart', value: values.addToCarts },
    { label: 'Checkout started', value: values.checkoutStarts },
    { label: 'Purchases', value: values.purchases },
  ];

  return steps.map((step, index) => ({
    ...step,
    rateFromPrevious: index === 0 ? 1 : safeDivide(step.value, steps[index - 1].value),
    rateFromVisitors: safeDivide(step.value, values.visitors),
  }));
}

// Summarize views, carts, units, and revenue for the highest-impact products.
function buildTopProducts(events) {
  const products = new Map();

  for (const event of events) {
    if (event.type === 'product_view' || event.type === 'add_to_cart') {
      const product = productSummaryFromEvent(event);

      if (!product) continue;

      const summary = getProductSummary(products, product);

      if (event.type === 'product_view') {
        summary.views += 1;
      } else {
        summary.addToCarts += Number(event.quantity) || 1;
      }
    }

    if (event.type === 'purchase') {
      for (const item of event.items ?? []) {
        const summary = getProductSummary(products, item);

        summary.unitsSold += Number(item.quantity) || 0;
        summary.revenue += (Number(item.price) || 0) * (Number(item.quantity) || 0);
      }
    }
  }

  return [...products.values()]
    .map((product) => ({
      ...product,
      conversionRate: safeDivide(product.unitsSold, product.views),
    }))
    .sort((a, b) => b.revenue - a.revenue || b.views - a.views)
    .slice(0, 8);
}

// Roll top product metrics up into category-level analytics rows.
function buildTopCategories(products) {
  const categories = new Map();

  for (const product of products) {
    const category = categories.get(product.categoryName) ?? {
      categoryName: product.categoryName,
      views: 0,
      addToCarts: 0,
      unitsSold: 0,
      revenue: 0,
      conversionRate: 0,
    };

    category.views += product.views;
    category.addToCarts += product.addToCarts;
    category.unitsSold += product.unitsSold;
    category.revenue += product.revenue;
    category.conversionRate = safeDivide(category.unitsSold, category.views);
    categories.set(category.categoryName, category);
  }

  return [...categories.values()].sort(
    (a, b) => b.revenue - a.revenue || b.views - a.views,
  );
}

// Convert purchase events into the recent orders table for the dashboard.
function buildOrders(events) {
  return events
    .map((event) => ({
      orderNumber: event.orderNumber ?? event.id,
      occurredAt: event.occurredAt,
      items: event.items ?? [],
      units: sumItems(event.items),
      revenue: readEventValue(event),
    }))
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    )
    .slice(0, 10);
}

// Convert failed payment events into the dashboard failure history table.
function buildPaymentFailures(events) {
  return events
    .map((event) => ({
      id: event.id,
      occurredAt: event.occurredAt,
      amount: readEventValue(event),
      reason: event.failureReason ?? 'Payment authorization failed',
      items: event.items ?? [],
    }))
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    )
    .slice(0, 12);
}

// Reuse or initialize a mutable product metrics summary in the provided map.
function getProductSummary(products, product) {
  const productId = Number(product.productId);
  const existing = products.get(productId);

  if (existing) return existing;

  const next = {
    productId,
    productName: product.productName,
    categoryName: product.categoryName ?? 'Uncategorized',
    views: 0,
    addToCarts: 0,
    unitsSold: 0,
    revenue: 0,
    conversionRate: 0,
  };

  products.set(productId, next);
  return next;
}

// Extract the product fields needed for product-level analytics summaries.
function productSummaryFromEvent(event) {
  if (!event.productId || !event.productName) {
    return null;
  }

  return {
    productId: event.productId,
    productName: event.productName,
    categoryName: event.categoryName ?? 'Uncategorized',
  };
}

// Count events of a specific analytics type.
function countEvents(events, type) {
  return events.filter((event) => event.type === type).length;
}

// Count unique values produced by the provided selector callback.
function uniqueCount(events, getValue) {
  return new Set(events.map(getValue)).size;
}

// Sum item quantities while tolerating missing item arrays.
function sumItems(items) {
  return items?.reduce((total, item) => total + (Number(item.quantity) || 0), 0) ?? 0;
}

// Read a monetary value from the event or derive it from item revenue.
function readEventValue(event) {
  return (
    finiteNumber(event?.value) ??
    finiteNumber(event?.revenue) ??
    finiteNumber(event?.amount) ??
    sumItemRevenue(event?.items)
  );
}

// Sum line item revenue while ignoring invalid prices or quantities.
function sumItemRevenue(items) {
  return (
    items?.reduce(
      (total, item) =>
        total +
        (finiteNumber(item.price) ?? 0) * (finiteNumber(item.quantity) ?? 0),
      0,
    ) ?? 0
  );
}

// Convert a value to a finite number, returning null when conversion fails.
function finiteNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

// Divide two numbers and return zero when the denominator is empty.
function safeDivide(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : 0;
}

// Generate deterministic-looking seed analytics across several time windows.
function createSeedEvents() {
  const products = [
    {
      productId: 1,
      productName: 'iPhone 15',
      categoryName: 'Phones',
      price: 59999,
      viewWeight: 36,
      cartWeight: 43,
      purchaseWeight: 44,
    },
    {
      productId: 2,
      productName: 'MacBook Air M5',
      categoryName: 'Laptops',
      price: 72990,
      viewWeight: 24,
      cartWeight: 23,
      purchaseWeight: 22,
    },
    {
      productId: 4,
      productName: 'Orange Studio Monitor',
      categoryName: 'Monitors',
      price: 24999,
      viewWeight: 21,
      cartWeight: 19,
      purchaseWeight: 18,
    },
    {
      productId: 3,
      productName: 'Mechanical Keyboard',
      categoryName: 'Accessories',
      price: 3500,
      viewWeight: 19,
      cartWeight: 15,
      purchaseWeight: 16,
    },
  ];
  const days = [
    {
      daysAgo: 720,
      visitors: 42,
      productViews: 58,
      addToCarts: 9,
      checkoutStarts: 5,
      purchases: 2,
      paymentFailures: 1,
    },
    {
      daysAgo: 545,
      visitors: 67,
      productViews: 102,
      addToCarts: 18,
      checkoutStarts: 9,
      purchases: 4,
      paymentFailures: 1,
    },
    {
      daysAgo: 420,
      visitors: 84,
      productViews: 136,
      addToCarts: 22,
      checkoutStarts: 13,
      purchases: 7,
      paymentFailures: 2,
    },
    {
      daysAgo: 360,
      visitors: 96,
      productViews: 154,
      addToCarts: 26,
      checkoutStarts: 15,
      purchases: 8,
      paymentFailures: 2,
    },
    {
      daysAgo: 300,
      visitors: 118,
      productViews: 196,
      addToCarts: 34,
      checkoutStarts: 21,
      purchases: 12,
      paymentFailures: 3,
    },
    {
      daysAgo: 240,
      visitors: 137,
      productViews: 224,
      addToCarts: 42,
      checkoutStarts: 27,
      purchases: 16,
      paymentFailures: 4,
    },
    {
      daysAgo: 180,
      visitors: 156,
      productViews: 263,
      addToCarts: 51,
      checkoutStarts: 33,
      purchases: 20,
      paymentFailures: 5,
    },
    {
      daysAgo: 120,
      visitors: 174,
      productViews: 292,
      addToCarts: 57,
      checkoutStarts: 37,
      purchases: 24,
      paymentFailures: 4,
    },
    {
      daysAgo: 90,
      visitors: 193,
      productViews: 336,
      addToCarts: 71,
      checkoutStarts: 48,
      purchases: 32,
      paymentFailures: 6,
    },
    {
      daysAgo: 60,
      visitors: 211,
      productViews: 365,
      addToCarts: 76,
      checkoutStarts: 51,
      purchases: 35,
      paymentFailures: 5,
    },
    {
      daysAgo: 29,
      visitors: 225,
      productViews: 389,
      addToCarts: 83,
      checkoutStarts: 58,
      purchases: 39,
      paymentFailures: 7,
    },
    {
      daysAgo: 21,
      visitors: 236,
      productViews: 418,
      addToCarts: 91,
      checkoutStarts: 63,
      purchases: 43,
      paymentFailures: 6,
    },
    {
      daysAgo: 14,
      visitors: 248,
      productViews: 444,
      addToCarts: 97,
      checkoutStarts: 66,
      purchases: 46,
      paymentFailures: 8,
    },
    {
      daysAgo: 6,
      visitors: 132,
      productViews: 216,
      addToCarts: 43,
      checkoutStarts: 28,
      purchases: 18,
      paymentFailures: 3,
    },
    {
      daysAgo: 5,
      visitors: 145,
      productViews: 238,
      addToCarts: 49,
      checkoutStarts: 31,
      purchases: 21,
      paymentFailures: 4,
    },
    {
      daysAgo: 4,
      visitors: 158,
      productViews: 261,
      addToCarts: 55,
      checkoutStarts: 36,
      purchases: 24,
      paymentFailures: 3,
    },
    {
      daysAgo: 3,
      visitors: 151,
      productViews: 249,
      addToCarts: 52,
      checkoutStarts: 34,
      purchases: 22,
      paymentFailures: 5,
    },
    {
      daysAgo: 2,
      visitors: 169,
      productViews: 286,
      addToCarts: 61,
      checkoutStarts: 39,
      purchases: 28,
      paymentFailures: 4,
    },
    {
      daysAgo: 1,
      visitors: 183,
      productViews: 315,
      addToCarts: 68,
      checkoutStarts: 45,
      purchases: 32,
      paymentFailures: 4,
    },
    {
      daysAgo: 0,
      visitors: 176,
      productViews: 302,
      addToCarts: 64,
      checkoutStarts: 41,
      purchases: 29,
      paymentFailures: 5,
    },
  ];
  const events = [];

  for (const day of days) {
    const baseDate = addDays(startOfDay(new Date()), -day.daysAgo);

    pushVisitorSeedEvents(events, day, baseDate);
    pushProductSeedEvents(events, day, baseDate, products, 'product_view');
    pushProductSeedEvents(events, day, baseDate, products, 'add_to_cart');
    pushCheckoutSeedEvents(events, day, baseDate, products);
    pushPurchaseSeedEvents(events, day, baseDate, products);
    pushFailureSeedEvents(events, day, baseDate, products);
  }

  return events;
}

// Append visitor events for one seeded analytics day.
function pushVisitorSeedEvents(events, day, baseDate) {
  for (let index = 0; index < day.visitors; index += 1) {
    events.push(
      createSeedEvent('visitor', baseDate, day.daysAgo, index, {
        visitorId: `seed-visitor-${day.daysAgo}-${index}`,
      }),
    );
  }
}

// Append seeded product view or add-to-cart events using product weights.
function pushProductSeedEvents(events, day, baseDate, products, type) {
  const total = type === 'product_view' ? day.productViews : day.addToCarts;
  const weightKey = type === 'product_view' ? 'viewWeight' : 'cartWeight';

  for (let index = 0; index < total; index += 1) {
    const product = selectWeightedProduct(products, index, weightKey);

    events.push(
      createSeedEvent(type, baseDate, day.daysAgo, index, {
        productId: product.productId,
        productName: product.productName,
        categoryName: product.categoryName,
        quantity: type === 'add_to_cart' ? 1 : undefined,
        value: product.price,
      }),
    );
  }
}

// Append checkout-start seed events with realistic cart item payloads.
function pushCheckoutSeedEvents(events, day, baseDate, products) {
  for (let index = 0; index < day.checkoutStarts; index += 1) {
    const product = selectWeightedProduct(products, index, 'cartWeight');
    const quantity = index % 9 === 0 ? 2 : 1;
    const item = seedProductToItem(product, quantity);

    events.push(
      createSeedEvent('checkout_start', baseDate, day.daysAgo, index, {
        value: item.price * item.quantity,
        items: [item],
      }),
    );
  }
}

// Append purchase seed events, occasionally bundling an accessory item.
function pushPurchaseSeedEvents(events, day, baseDate, products) {
  for (let index = 0; index < day.purchases; index += 1) {
    const product = selectWeightedProduct(products, index, 'purchaseWeight');
    const hasAccessory = product.categoryName !== 'Accessories' && index % 5 === 0;
    const items = [seedProductToItem(product, index % 7 === 0 ? 2 : 1)];

    if (hasAccessory) {
      items.push(seedProductToItem(products[3], 1));
    }

    events.push(
      createSeedEvent('purchase', baseDate, day.daysAgo, index, {
        orderNumber: `OR-SEED-${dateKey(baseDate).replaceAll('-', '')}-${String(
          index + 1,
        ).padStart(3, '0')}`,
        value: items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
        items,
      }),
    );
  }
}

// Append payment failure seed events with rotating failure reasons.
function pushFailureSeedEvents(events, day, baseDate, products) {
  const reasons = [
    'Issuer declined the card',
    'Payment authorization timed out',
    'Insufficient funds',
    '3DS verification was not completed',
  ];

  for (let index = 0; index < day.paymentFailures; index += 1) {
    const product = selectWeightedProduct(products, index, 'cartWeight');
    const item = seedProductToItem(product, 1);

    events.push(
      createSeedEvent('payment_failure', baseDate, day.daysAgo, index, {
        value: item.price,
        failureReason: reasons[index % reasons.length],
        items: [item],
      }),
    );
  }
}

// Create one seed event with stable ids and staggered timestamps.
function createSeedEvent(type, baseDate, daysAgo, index, event = {}) {
  const occurredAt = new Date(baseDate);

  occurredAt.setHours(8 + (index % 12), (index * 7) % 60, 0, 0);

  return {
    id: `seed-${type}-${daysAgo}-${index}`,
    type,
    occurredAt: occurredAt.toISOString(),
    visitorId: event.visitorId ?? `seed-visitor-${daysAgo}-${index % 200}`,
    sessionId: `seed-session-${daysAgo}-${index % 220}`,
    productId: event.productId,
    productName: event.productName,
    categoryName: event.categoryName,
    quantity: event.quantity,
    value: event.value,
    orderNumber: event.orderNumber,
    failureReason: event.failureReason,
    items: event.items,
  };
}

// Convert seed product metadata into an analytics line item.
function seedProductToItem(product, quantity) {
  return {
    productId: product.productId,
    productName: product.productName,
    categoryName: product.categoryName,
    price: product.price,
    quantity,
  };
}

// Select a product by deterministic weighted rotation for seed data variety.
function selectWeightedProduct(products, index, weightKey) {
  const totalWeight = products.reduce(
    (total, product) => total + product[weightKey],
    0,
  );
  let cursor = (index * 37) % totalWeight;

  for (const product of products) {
    cursor -= product[weightKey];

    if (cursor < 0) {
      return product;
    }
  }

  return products[0];
}

// Derive category records from products when the fixture omits categories.
function deriveCategories(products) {
  const categories = new Map();

  for (const product of products) {
    if (!product.categoryId || !product.categoryName) {
      continue;
    }

    categories.set(Number(product.categoryId), {
      id: Number(product.categoryId),
      name: product.categoryName,
    });
  }

  return [...categories.values()].sort((a, b) => a.id - b.id);
}

// Normalize site codes to lowercase strings, or null for empty input.
function normalizeSite(site) {
  return typeof site === 'string' && site.trim()
    ? site.trim().toLowerCase()
    : null;
}

// Build a lightweight unique id with a type-specific prefix.
function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Return a copy of the date pinned to local midnight.
function startOfDay(date) {
  const nextDate = new Date(date);

  nextDate.setHours(0, 0, 0, 0);

  return nextDate;
}

// Return the first day of the month for a given date.
function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Return a copy of the date shifted by the requested number of days.
function addDays(date, days) {
  const nextDate = new Date(date);

  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

// Return a month-start date shifted by the requested number of months.
function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

// Calculate whole-day distance between two dates.
function daysBetween(startDate, endDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.floor(
    (endDate.getTime() - startDate.getTime()) / millisecondsPerDay,
  );
}

// Format a date as a stable YYYY-MM-DD key.
function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

// Format a date as a stable YYYY-MM key.
function monthKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
  ].join('-');
}

// Format a short day label for chart axes.
function formatDayLabel(date) {
  return date.toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
  });
}

// Format a short month label for chart axes.
function formatMonthLabel(date) {
  return date.toLocaleDateString('en', {
    month: 'short',
    year: 'numeric',
  });
}

// Find the earliest valid event timestamp in a list of analytics events.
function findEarliestEventDate(events) {
  return events.reduce((earliest, event) => {
    const occurredAt = new Date(event.occurredAt);

    if (Number.isNaN(occurredAt.getTime())) return earliest;

    return !earliest || occurredAt < earliest ? occurredAt : earliest;
  }, null);
}
