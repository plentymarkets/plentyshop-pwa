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
