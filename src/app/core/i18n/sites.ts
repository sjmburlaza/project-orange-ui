export interface SiteConfig {
  code: string;
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
