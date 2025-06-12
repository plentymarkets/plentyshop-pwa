export type TelephoneInputProps = {
  modelValue: string;
  label?: string;
  id?: string;
  placeholder?: string;
  preferredCountries?: string[];
  onlyCountries?: string[];
  defaultCountry?: string;
  enableSearch?: boolean;
  mode?: 'auto' | 'international' | 'national';
  error?: string;
};
