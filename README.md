# Project Orange UI

Project Orange UI is an Angular storefront and admin console for a multi-country commerce experience. It includes site-aware routing, product listing and detail pages, cart and checkout flows, guest order lookup, order confirmation and history, add-on experiences, authentication, profile pages, and an admin analytics dashboard with revenue, order, visitor, funnel, product, and payment-failure views. The project is covered by unit and Playwright end-to-end tests, with CI running lint, unit tests, e2e tests, and production builds.

## Tech Stack

- Angular 20 with standalone components and lazy routes
- Angular SSR/server output with client hydration
- Angular Material, Angular CDK, SCSS, and Bootstrap Icons
- NgRx Store, Effects, and Store DevTools for products, cart, and trade-in state
- ngx-translate with split translation resources
- Vitest through Angular's unit test builder
- Playwright for end-to-end tests

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The app runs at `http://localhost:4200/`. The dev server uses `proxy.conf.cjs` to forward `/api` requests to `http://localhost:5175`. Analytics requests prefer the json-server mock on `http://localhost:5176` when it is running, and fall back to `http://localhost:5175` otherwise.

For the local analytics dashboard mock, run this in a second terminal:

```bash
npm run mock:api
```

To enter the storefront, choose a country from the root page or visit a site-scoped route directly:

```text
http://localhost:4200/ph/products
http://localhost:4200/fr/products
http://localhost:4200/cn/products
http://localhost:4200/jp/products
```

## Available Scripts

| Command                               | Description                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| `npm start`                           | Runs `ng serve` with `proxy.conf.cjs`.                                       |
| `npm run mock:api`                    | Runs the local json-server analytics mock on port `5176`.                    |
| `npm run start:e2e`                   | Runs the Angular dev server with the e2e build configuration.                |
| `npm run build`                       | Builds the app for production into `dist/`.                                  |
| `npm run watch`                       | Builds in watch mode with the development configuration.                     |
| `npm test`                            | Runs unit tests.                                                             |
| `npm run test:watch`                  | Runs unit tests in watch mode.                                               |
| `npm run test:ci`                     | Runs unit tests once for CI.                                                 |
| `npm run e2e`                         | Runs Playwright tests.                                                       |
| `npm run e2e:ui`                      | Opens the Playwright UI runner.                                              |
| `npm run e2e:headed`                  | Runs Playwright tests in headed mode.                                        |
| `npm run lint`                        | Runs Angular ESLint over TypeScript and templates.                           |
| `npm run build:ssr`                   | Builds the server-output application.                                        |
| `npm run serve:ssr:project-orange-v2` | Serves the built SSR bundle from `dist/project-orange-v2/server/server.mjs`. |

## Application Flow

The root route (`/`) loads the country entry screen. It uses `/api/sites` and `/api/geo/country` to list supported sites and suggest a country when possible. The selected site is saved in local storage under `orange.sitePreference`.

For detailed analytics dashboard documentation, see [Dashboard Analytics](src/app/features/admin/pages/dashboard/README.md).

Most app routes are scoped by site:

| Route                                 | Purpose                                                            |
| ------------------------------------- | ------------------------------------------------------------------ |
| `/:site/products`                     | Product listing with category, sort, and price filters.            |
| `/:site/products/detail`              | Product detail page.                                               |
| `/:site/cart`                         | Cart review, quantity updates, vouchers, shipping, and add-ons.    |
| `/:site/checkout`                     | Dynamic checkout form, shipping, payment, and order summary flow.  |
| `/:site/auth/login`                   | Sign in.                                                           |
| `/:site/auth/register`                | Account registration.                                              |
| `/:site/auth/forgot-password`         | Password reset entry point.                                        |
| `/:site/auth/reset-password`          | Complete password reset with email and token.                      |
| `/:site/orders`                       | Guest order lookup or signed-in order history.                     |
| `/:site/orders/my-orders`             | Orders route alias for lookup and history.                         |
| `/:site/orders/confirmation/:orderId` | Order confirmation page after checkout.                            |
| `/:site/profile/account-settings`     | Customer account settings.                                         |
| `/:site/admin/dashboard`              | Admin dashboard. Requires an authenticated admin session.          |
| `/:site/admin/manage-orders`          | Admin order management. Requires an authenticated admin session.   |
| `/:site/admin/manage-products`        | Admin product management. Requires an authenticated admin session. |

Unsupported site codes are redirected back to the country selector.

## API Behavior

All API calls start with `/api`. During local development, `proxy.conf.cjs` forwards most requests to `http://localhost:5175`; analytics dashboard and analytics event routes prefer the json-server mock at `http://localhost:5176` and fall back to `http://localhost:5175` when the mock is not running.

`ApiSitePrefixInterceptor` automatically prefixes scoped API calls with the active site code. For example, a component that requests:

```text
/api/products
```

while the active route is `/ph/products` is sent as:

```text
/api/ph/products
```

The interceptor leaves these unscoped endpoints unchanged:

```text
/api/sites
/api/sites/:site
/api/geo/country
```

Primary API areas used by the UI:

| Area              | Endpoints                                                                                                                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sites             | `GET /api/sites`, `GET /api/sites/:site`                                                                                                                                                                                                             |
| Country detection | `GET /api/geo/country`                                                                                                                                                                                                                               |
| Auth              | `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `GET /api/auth/session`, `POST /api/auth/logout`                                                                               |
| Catalog           | `GET /api/products`, `GET /api/products/:id`, `GET /api/categories`                                                                                                                                                                                  |
| Product add-ons   | `GET /api/products/:id/insurance-plans`, `GET /api/products/:id/mobile-plans`                                                                                                                                                                        |
| Cart              | `GET /api/carts/:cartCode`, `POST /api/carts/items`, `POST /api/carts/:cartCode/items`, `PUT /api/carts/:cartCode/items/:productId`, `DELETE /api/carts/:cartCode/items/:productId`                                                                  |
| Cart add-ons      | `PUT /api/carts/:cartCode/items/:productId/addons/:addonId`, `DELETE /api/carts/:cartCode/items/:productId/addons/:addonId`                                                                                                                          |
| Vouchers          | `POST /api/carts/:cartCode/vouchers`, `DELETE /api/carts/:cartCode/vouchers/:code`                                                                                                                                                                   |
| Checkout          | `GET /api/checkout/form`                                                                                                                                                                                                                             |
| Orders            | `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:orderNumber`, `GET /api/orders/lookup?orderNumber=...&email=...`                                                                                                                            |
| Shipping          | `GET /api/shipping/options?postalCode=...`, `PUT /api/carts/:cartCode/shipping`                                                                                                                                                                      |
| Trade-in          | `GET /api/trade-ins/config`, `GET /api/trade-ins/categories`, `GET /api/trade-ins/brands`, `GET /api/trade-ins/devices`, `GET /api/trade-ins/storages`                                                                                               |
| Trade-in sessions | `POST /api/trade-in-sessions`, `GET /api/trade-in-sessions/:id`, `PATCH /api/trade-in-sessions/:id/step-one`, `PATCH /api/trade-in-sessions/:id/step-two`, `PATCH /api/trade-in-sessions/:id/step-three`, `PATCH /api/trade-in-sessions/:id/confirm` |

Auth requests use credentials and XSRF support. `AuthInterceptor` adds `withCredentials` to API requests and redirects unauthenticated users to the site login page when protected requests return `401`.

## Mock Auth

Mock auth is available through `MockAuthInterceptor`, but it is disabled by default. To enable it for local work, set `useMockAuth` to `true` in the active environment file:

```ts
export const environment = {
  production: false,
  useMockAuth: true,
};
```

The mock interceptor handles:

- `GET /api/geo/country`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/session`
- `POST /api/auth/logout`

The default mock user is an admin user with broad product, inventory, order, and user permissions.

## State Management

Global feature state is registered in `src/app/app.config.ts`:

- `productFeature` and `ProductEffects` for catalog loading and filters
- `cartFeature` and `CartEffects` for cart, vouchers, shipping, and add-ons
- `tradeInFeature` and `TradeInEffects` for trade-in configuration and sessions

Feature facades sit beside their stores and are the preferred integration point for components.

## Localization and Sites

Translations live in `src/assets/i18n/<language>/`. The current resources are:

```text
common.json
home.json
products.json
cart.json
orders.json
```

`MultiTranslateLoader` loads and merges those resources for the active language. Current language folders are:

```text
en
fr
zh
ja
```

Site configuration is loaded from the backend through `SiteService`. Each site includes:

- `code`
- `countryName`
- `locale`
- `currency`
- `defaultLanguage`
- `supportedLanguages`
- `features`

Feature flags currently affect add-ons such as insurance, trade-in, and vouchers.

## Project Structure

```text
src/app/core
  auth/             Session models, auth service, auth store, roles, permissions
  guards/           Auth, role, and site route guards
  i18n/             Site types and multi-file translation loader
  interceptors/     API site prefixing, auth, and mock auth
  models/           Shared API/domain models
  services/         Site, storage, country detection, and postal code services

src/app/features
  admin/            Admin dashboard, order management, product management
  auth/             Login, register, forgot password, reset password
  cart/             Cart page, cart store, cart API, cart item add-ons
  checkout/         Dynamic checkout form, shipping, payment
  common/           Reusable commerce UI such as order summary, voucher, CTA
  country-entry/    Country selector and detected-country entry flow
  home/             Home feature
  orders/           Guest lookup, signed-in history, confirmation, and order item card
  products/         Product list, product detail, filters, product store
  profile/          Account settings
  trade-in/         Trade-in store and API

src/app/layout
  auth-layout/      Layout for auth pages
  checkout-layout/  Layout for cart and checkout
  main-layout/      Storefront shell
  header/ footer/ sidebar/

src/app/shared
  components/       Shared controls such as buttons, dropdowns, sliders, spinners
  pipes/            Shared pipes
  validators/       Shared validators
```

## Testing

Run unit tests:

```bash
npm run test:ci
```

Run Playwright e2e tests:

```bash
npm run e2e
```

The Playwright configuration starts the app automatically with:

```bash
npm run start:e2e -- --host 127.0.0.1 --port 4200
```

The e2e suite mocks the Orange API in `e2e/app.spec.ts` and uses fixture data from `e2e/fixtures/catalog.ts`, so a backend is not required for e2e tests.

If Playwright browsers are missing, install Chromium:

```bash
npx playwright install chromium
```

## Common Development Tasks

### Add a New Translation Key

1. Add the key to each language resource under `src/assets/i18n/<language>/`.
2. Keep keys in the resource that matches the feature area, such as `products.json` or `cart.json`.
3. Use ngx-translate in the component template or TypeScript code.

### Add a New Site

1. Add the site in the backend response for `/api/sites`.
2. Make sure the site has a matching language folder in `src/assets/i18n/` for its default language.
3. Confirm the site `features` map enables the expected add-ons and checkout behavior.
4. Visit `/<site-code>/products` locally and verify API calls are prefixed correctly.

### Add a New API Call

1. Add or update the feature service in `src/app/features/**/services/`.
2. Use `/api/...` as the base path. The site prefix interceptor will add the active site when needed.
3. Add model types under `src/app/core/models/` if the payload is shared.
4. Add focused unit tests for service or store behavior, and extend e2e mocks when the flow is user-facing.

### Add a New Feature Route

1. Add the lazy route to the feature route file or `src/app/app.routes.ts`.
2. Choose the correct layout: main, checkout, auth, or standalone.
3. Add guards and role metadata when the route is protected.
4. Add route coverage to Playwright if the flow is part of the customer or admin journey.

## Build and Serve SSR Output

Build the app:

```bash
npm run build:ssr
```

Serve the built bundle:

```bash
npm run serve:ssr:project-orange-v2
```
