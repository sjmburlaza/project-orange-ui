export interface SiteConfig {
  code: string;
  countryName: string;
  flag: string;
  locale: string;
  currency: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  features: {
    insurance: boolean;
    tradeIn: boolean;
    vouchers: boolean;
  };
}

export const SITES = {
  ph: {
    code: 'ph',
    countryName: 'Philippines',
    flag: '🇵🇭',
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
  fr: {
    code: 'fr',
    countryName: 'France',
    flag: '🇫🇷',
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
  cn: {
    code: 'cn',
    countryName: 'China',
    flag: '🇨🇳',
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
  jp: {
    code: 'jp',
    countryName: 'Japan',
    flag: '🇯🇵',
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
} satisfies Record<string, SiteConfig>;

export type SiteCode = keyof typeof SITES;

export const SUPPORTED_SITE_CODES = [
  'ph',
  'cn',
  'jp',
  'fr',
] as const satisfies readonly SiteCode[];

export function isSiteCode(value: string | null | undefined): value is SiteCode {
  return !!value && Object.prototype.hasOwnProperty.call(SITES, value);
}

export function siteFromCountryCode(
  countryCode: string | null | undefined,
): SiteCode | null {
  const site = countryCode?.trim().toLowerCase();
  return isSiteCode(site) ? site : null;
}
