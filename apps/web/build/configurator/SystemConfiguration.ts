import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import https from 'node:https';
import type { ConfigurationResponse, BaseColors, Languages } from './types';

export class SystemConfiguration {
  private axiosRequestConfig: AxiosRequestConfig = {
    baseURL: process.env.API_ENDPOINT,
    url: `/rest/storefront/settings/${process.env.CONFIG_ID}`,
    method: 'GET',
    withCredentials: true,
    headers: {
      'X-Security-Token': process.env.API_SECURITY_TOKEN,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  };

  private response: ConfigurationResponse = {};

  async fetch() {
    const { data } = await axios(this.axiosRequestConfig);
    this.response = data;
  }

  private findValueInResponseByKey(category: string, key: string): string {
    const foundEntry = this.response[category]?.find((entry) => entry.key === key);
    return foundEntry ? foundEntry.value : '';
  }

  getResponse(): ConfigurationResponse {
    return this.response;
  }

  getBaseColors(): BaseColors {
    return {
      primary:
        this.findValueInResponseByKey('styling', 'primary') === ''
          ? '#0c7992'
          : this.findValueInResponseByKey('styling', 'primary'),
      secondary:
        this.findValueInResponseByKey('styling', 'secondary') === ''
          ? '#31687d'
          : this.findValueInResponseByKey('styling', 'secondary'),
    };
  }

  getFaviconUrl(): string {
    return this.findValueInResponseByKey('store', 'favicon');
  }

  getLogoUrl(): string {
    return this.findValueInResponseByKey('store', 'logo');
  }

  getLanugages(): Languages {
    return {
      default: this.findValueInResponseByKey('languages', 'defaultLanguage'),
      activated: this.findValueInResponseByKey('languages', 'languageList'),
    };
  }
}
