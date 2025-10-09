declare module 'vue-tel-input' {
  import type { DefineComponent } from 'vue';

  export interface PhoneValidationResult {
    isValid: boolean;
    country: {
      name: string;
      iso2: string;
      dialCode: string;
    };
    countryCode: string;
    nationalNumber: string;
    type: string;
    formatInternational: string;
    formatNational: string;
    uri: string;
    e164: string;
  }

  export interface VueTelInputProps {
    modelValue?: string;
    onlyCountries?: string[];
    defaultCountry?: string;
    autoDefaultCountry?: boolean;
    inputOptions?: Record<string, unknown>;
    validCharactersOnly?: boolean;
    styleClasses?: string;
    preferredCountries?: string[];
    dropdownOptions?: Record<string, unknown>;
    mode?: string;
  }

  export const VueTelInput: DefineComponent<VueTelInputProps, Record<string, never>, unknown>;
  const VueTelInputDefault: DefineComponent<VueTelInputProps, Record<string, never>, unknown>;
  export default VueTelInputDefault;
}
