import { ConfigurationResponse, BaseColors } from './types';
import fetchConfiguration from '../fetchConfiguration';

export class SystemConfiguration {
  private response: ConfigurationResponse = {};

  async fetch() {
    this.response = await fetchConfiguration();
  }

  private findValueInResponseByKey(category: string, key: string): string {
    const foundEntry = this.response[category]?.find((entry) => entry.key === key);
    return foundEntry ? foundEntry.value : '';
  }

  getBaseColors(): BaseColors {
    return {
      primary: this.findValueInResponseByKey('styling', 'primary'),
      secondary: this.findValueInResponseByKey('styling', 'secondary'),
    };
  }

  getFaviconUrl(): string {
    return this.findValueInResponseByKey('store', 'favicon');
  }

  getLogoUrl(): string {
    return this.findValueInResponseByKey('store', 'logo');
  }
}
