export const SITES = {
  ph: {
    lang: 'en',
    currency: 'PHP',
  },
  fr: {
    lang: 'fr',
    currency: 'EUR',
  },
} as const;

export type SiteCode = keyof typeof SITES;
export type SiteConfig = (typeof SITES)[SiteCode];
