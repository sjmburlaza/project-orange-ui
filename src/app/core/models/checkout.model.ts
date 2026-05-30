export interface CheckoutFormConfig {
  version: string;
  steps: CheckoutStep[];
}

export interface CheckoutStep {
  id: string;
  label: string;
  fields?: DynamicField[];
}

export interface DynamicField {
  type: FieldType;
  name: string;
  label?: string;
  value?: string;
  placeholder?: string;

  options?: Option[];
  optionsApi?: string;
  dependsOn?: string;

  visibleIf?: {
    field: string;
    value: unknown;
  };

  validators?: string[];
  asyncValidators?: string[];
  updateOn?: 'change' | 'blur' | 'submit';
  fields?: DynamicField[];

  grid?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export interface Option {
  label: string;
  value: string;
}

export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'password'
  | 'select'
  | 'select-search'
  | 'checkbox'
  | 'textarea'
  | 'array'
  | 'group';
