const http = require('http');

const BACKEND_TARGET = 'http://localhost:5175';
const ANALYTICS_MOCK_TARGET = 'http://localhost:5176';
const ANALYTICS_MOCK_HEALTH_PATH = '/api/admin/analytics/dashboard';
const HEALTH_CACHE_MS = 1000;
const HEALTH_TIMEOUT_MS = 250;

let healthCheckedAt = 0;
let mockApiAvailable = false;
let pendingHealthCheck = null;

module.exports = {
  '/api/admin/analytics': createAnalyticsProxy(),
  '/api/analytics': createAnalyticsProxy(),
  '^/api/[^/]+/admin/analytics': createAnalyticsProxy(),
  '^/api/[^/]+/analytics': createAnalyticsProxy(),
  '/api': {
    target: BACKEND_TARGET,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
};

function createAnalyticsProxy() {
  let proxyServer = null;

  return {
    target: BACKEND_TARGET,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    configure(proxy) {
      proxyServer = proxy;
    },
    async bypass(_req, _res, options) {
      const target = await resolveAnalyticsTarget();

      options.target = target;

      if (proxyServer?.options) {
        proxyServer.options.target = target;
      }
    },
  };
}

async function resolveAnalyticsTarget() {
  return (await isAnalyticsMockAvailable())
    ? ANALYTICS_MOCK_TARGET
    : BACKEND_TARGET;
}

function isAnalyticsMockAvailable() {
  const now = Date.now();

  if (now - healthCheckedAt < HEALTH_CACHE_MS) {
    return Promise.resolve(mockApiAvailable);
  }

  if (pendingHealthCheck) {
    return pendingHealthCheck;
  }

  pendingHealthCheck = probeAnalyticsMock()
    .then((available) => {
      mockApiAvailable = available;
      healthCheckedAt = Date.now();
      return available;
    })
    .finally(() => {
      pendingHealthCheck = null;
    });

  return pendingHealthCheck;
}

function probeAnalyticsMock() {
  return new Promise((resolve) => {
    let settled = false;
    const settle = (available) => {
      if (settled) return;
      settled = true;
      resolve(available);
    };
    const request = http.get(
      `${ANALYTICS_MOCK_TARGET}${ANALYTICS_MOCK_HEALTH_PATH}`,
      (response) => {
        response.resume();
        settle(response.statusCode >= 200 && response.statusCode < 500);
      },
    );

    request.setTimeout(HEALTH_TIMEOUT_MS, () => {
      request.destroy();
      settle(false);
    });
    request.on('error', () => settle(false));
  });
}
