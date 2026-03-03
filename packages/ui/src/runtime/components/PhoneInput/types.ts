export interface Country {
  /** ISO 3166-1 alpha-2 code (e.g., "US") */
  code: string;
  /** English country name */
  name: string;
  /** Calling code with + prefix (e.g., "+1") */
  dialCode: string;
}

export interface PhoneInputProps {
  /** Full phone string — dial code + number (v-model) */
  modelValue?: string;
  /** ISO 2-letter country code to override locale auto-detect */
  defaultCountry?: string;
  /** Disable the entire component */
  disabled?: boolean;
  /** Make inputs read-only */
  readonly?: boolean;
  /** Placeholder for the phone number input */
  placeholder?: string;
  /** Form field name attribute */
  name?: string;
  /** Enable search filtering in country dropdown (default: true) */
  searchable?: boolean;
}
