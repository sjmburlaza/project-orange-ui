import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client,
  },
  {
    path: ':site',
    renderMode: RenderMode.Server,
  },

  // product listing
  {
    path: ':site/products',
    renderMode: RenderMode.Server,
  },

  // product details
  {
    path: ':site/products/:slug',
    renderMode: RenderMode.Server,
  },

  // authenticated/private
  {
    path: ':site/admin/**',
    renderMode: RenderMode.Client,
  },
  {
    path: ':site/cart/**',
    renderMode: RenderMode.Client,
  },
  {
    path: ':site/checkout/**',
    renderMode: RenderMode.Client,
  },
  {
    path: ':site/orders/**',
    renderMode: RenderMode.Client,
  },
  {
    path: ':site/profile/**',
    renderMode: RenderMode.Client,
  },
  {
    path: ':site/auth/**',
    renderMode: RenderMode.Client,
  },

  // fallback
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
