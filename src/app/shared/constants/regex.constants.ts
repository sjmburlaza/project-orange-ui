export const EMAIL_ADDRESS_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const PASSWORD_SPECIAL_CHARACTER_PATTERN = /[^a-zA-Z0-9]/;
export const PASSWORD_NUMBER_PATTERN = /\d/;
export const PASSWORD_UPPERCASE_PATTERN = /[A-Z]/;
export const STRONG_PASSWORD_PATTERN =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;

export const CARD_NUMBER_PATTERN = /^(?:\d[\s-]?){13,19}$/;
export const CARD_EXPIRY_DATE_PATTERN = /^(0[1-9]|1[0-2])\/\d{2}$/;
export const CARD_SECURITY_CODE_PATTERN = /^\d{3,4}$/;
export const GCASH_MOBILE_NUMBER_PATTERN = /^(?:\+?63|0)?9\d{9}$/;

export const PAYMENT_ENDPOINT_PATTERN =
  /^\/api\/(?:(?:ph|fr|cn|jp)\/)?payments\/(.+)$/;

export const DIACRITICS_PATTERN = /[\u0300-\u036f]/g;
export const NON_ALPHANUMERIC_PATTERN = /[^a-z0-9]+/g;
export const LEADING_OR_TRAILING_HYPHENS_PATTERN = /^-+|-+$/g;
export const NON_DIGIT_PATTERN = /\D/g;
export const HYPHEN_PATTERN = /-/g;
export const WHITESPACE_PATTERN = /\s+/g;
