import { US } from 'country-flag-icons/string/3x2';
import { DE } from 'country-flag-icons/string/3x2';

export interface FlagImports {
  [key: string]: string;
}
export const flagImports: FlagImports = {
  en: US as string,
  de: DE as string,
};
