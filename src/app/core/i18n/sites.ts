export type SiteCode = string;

export interface SiteFeatures {
  insurance?: boolean;
  tradeIn?: boolean;
  vouchers?: boolean;
  [feature: string]: boolean | undefined;
}

export interface SiteConfig {
  code: SiteCode;
  countryName: string;
  locale: string;
  currency: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  features: SiteFeatures;
}

export function normalizeSiteCode(
  value: string | null | undefined,
): SiteCode | null {
  const site = value?.trim().toLowerCase();
  return site || null;
}
