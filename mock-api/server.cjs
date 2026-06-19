const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');

const PORT = Number(process.env.PORT ?? 5176);
const DEFAULT_SITE = 'ph';
const DEFAULT_ANALYTICS_PERIOD = 'last-7-days';
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
const DEFAULT_SHIPPING_OPTIONS = [
  {
    code: 'free',
    label: 'Free Delivery',
    price: 0,
    estimatedDelivery: '5-7 business days',
  },
  {
    code: 'standard',
    label: 'Standard Delivery',
    price: 100,
    estimatedDelivery: '3-5 business days',
  },
  {
    code: 'express',
    label: 'Express Delivery',
    price: 250,
    estimatedDelivery: '1-2 business days',
  },
];

const server = jsonServer.create();
const baseDb = readBaseDb();
const router = jsonServer.router({
  ...baseDb,
  categories: baseDb.categories ?? deriveCategories(baseDb.products ?? []),
  sites: baseDb.sites ?? DEFAULT_SITES,
  shippingOptions: baseDb.shippingOptions ?? DEFAULT_SHIPPING_OPTIONS,
  analyticsEvents: baseDb.analyticsEvents ?? createSeedEvents(),
});

server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

server.get('/api/geo/country', (_req, res) => {
  res.jsonp({ countryCode: 'PH' });
});

server.get('/api/sites', (_req, res) => {
  res.jsonp({ sites: router.db.get('sites').value() });
});

server.get('/api/sites/:site', (req, res) => {
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
server.get('/api/shipping/options', sendShippingOptions);
server.get('/api/:site/shipping/options', sendShippingOptions);
server.get('/api/options/:kind', sendOptions);
server.get('/api/:site/options/:kind', sendOptions);

server.get('/api/admin/analytics/dashboard', (req, res) => {
  res.jsonp(buildDashboard(getAnalyticsEvents(req), getAnalyticsPeriod(req)));
});

server.get('/api/:site/admin/analytics/dashboard', (req, res) => {
  res.jsonp(
    buildDashboard(
      getAnalyticsEvents(req, req.params.site),
      getAnalyticsPeriod(req),
    ),
  );
});

server.post('/api/analytics/events', (req, res) => {
  saveAnalyticsEvents(req, res);
});

server.post('/api/:site/analytics/events', (req, res) => {
  saveAnalyticsEvents(req, res, req.params.site);
});

server.use(rewriteSiteScopedApi);
server.use('/api', router);

server.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}`);
  console.log('Analytics endpoints:');
  console.log('  GET  /api/admin/analytics/dashboard');
  console.log('  POST /api/analytics/events');
});

function readBaseDb() {
  const dbPath = path.join(__dirname, '..', 'db.json');
  const source = fs.readFileSync(dbPath, 'utf8');
  const { $schema: _schema, ...db } = JSON.parse(source);

  return db;
}

function sendCheckoutForm(_req, res) {
  const checkoutForm = router.db.get('checkoutForm').value();

  if (!checkoutForm) {
    res.status(404).jsonp({ message: 'Checkout form not found' });
    return;
  }

  res.jsonp(checkoutForm);
}

function sendShippingOptions(_req, res) {
  res.jsonp(router.db.get('shippingOptions').value());
}

function sendOptions(req, res) {
  const collection = router.db.get(req.params.kind).value();

  res.jsonp(Array.isArray(collection) ? collection : []);
}

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

function normalizeAnalyticsEvent(event, site) {
  if (!event || !ANALYTICS_TYPES.has(event.type)) {
    return null;
  }

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
    site: normalizeSite(site ?? event.site ?? DEFAULT_SITE),
  };
}

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

function getAnalyticsPeriod(req) {
  const period =
    typeof req.query.period === 'string'
      ? req.query.period
      : DEFAULT_ANALYTICS_PERIOD;

  return ANALYTICS_PERIODS.has(period) ? period : DEFAULT_ANALYTICS_PERIOD;
}

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
    (total, event) => total + (Number(event.value) || 0),
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

function filterEventsByPeriod(events, period) {
  const cutoff = getAnalyticsPeriodStart(period);

  if (!cutoff) return events;

  return events.filter((event) => {
    const occurredAt = new Date(event.occurredAt);

    return !Number.isNaN(occurredAt.getTime()) && occurredAt >= cutoff;
  });
}

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
      point.revenue += Number(event.value) || 0;
      break;
    case 'payment_failure':
      point.paymentFailures += 1;
      break;
  }
}

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

function buildOrders(events) {
  return events
    .map((event) => ({
      orderNumber: event.orderNumber ?? event.id,
      occurredAt: event.occurredAt,
      items: event.items ?? [],
      units: sumItems(event.items),
      revenue: Number(event.value) || 0,
    }))
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    )
    .slice(0, 10);
}

function buildPaymentFailures(events) {
  return events
    .map((event) => ({
      id: event.id,
      occurredAt: event.occurredAt,
      amount: Number(event.value) || 0,
      reason: event.failureReason ?? 'Payment authorization failed',
      items: event.items ?? [],
    }))
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    )
    .slice(0, 12);
}

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

function countEvents(events, type) {
  return events.filter((event) => event.type === type).length;
}

function uniqueCount(events, getValue) {
  return new Set(events.map(getValue)).size;
}

function sumItems(items) {
  return items?.reduce((total, item) => total + (Number(item.quantity) || 0), 0) ?? 0;
}

function safeDivide(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : 0;
}

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

function pushVisitorSeedEvents(events, day, baseDate) {
  for (let index = 0; index < day.visitors; index += 1) {
    events.push(
      createSeedEvent('visitor', baseDate, day.daysAgo, index, {
        visitorId: `seed-visitor-${day.daysAgo}-${index}`,
      }),
    );
  }
}

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

function seedProductToItem(product, quantity) {
  return {
    productId: product.productId,
    productName: product.productName,
    categoryName: product.categoryName,
    price: product.price,
    quantity,
  };
}

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

function normalizeSite(site) {
  return typeof site === 'string' && site.trim()
    ? site.trim().toLowerCase()
    : null;
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function startOfDay(date) {
  const nextDate = new Date(date);

  nextDate.setHours(0, 0, 0, 0);

  return nextDate;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date, days) {
  const nextDate = new Date(date);

  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function daysBetween(startDate, endDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.floor(
    (endDate.getTime() - startDate.getTime()) / millisecondsPerDay,
  );
}

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function monthKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
  ].join('-');
}

function formatDayLabel(date) {
  return date.toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
  });
}

function formatMonthLabel(date) {
  return date.toLocaleDateString('en', {
    month: 'short',
    year: 'numeric',
  });
}

function findEarliestEventDate(events) {
  return events.reduce((earliest, event) => {
    const occurredAt = new Date(event.occurredAt);

    if (Number.isNaN(occurredAt.getTime())) return earliest;

    return !earliest || occurredAt < earliest ? occurredAt : earliest;
  }, null);
}
