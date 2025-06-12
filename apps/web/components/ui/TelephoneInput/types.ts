export type TelephoneInputProps = {
  modelValue: string;
  id?: string;
  label?: string;
  placeholder?: string;
  preferredCountries?: string[];
  onlyCountries?: string[];
  defaultCountry?: string;
  mode?: 'auto' | 'international' | 'national';
  error?: string;
};

export type PhoneValidationResult = {
  country: string;
  countryCode: string;
  formatted: string;
  valid: boolean;
  possible: boolean;
  nationalNumber: string;
  countryCallingCode: string;
  number: string;
};
