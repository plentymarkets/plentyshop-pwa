import axios, { AxiosRequestConfig } from 'axios';
import https from 'node:https';
import { ConfigurationResponse, BaseColors } from './types';

export class SystemConfiguration {
  private environmentMap = {
    API_ENDPOINT: process.env.API_ENDPOINT,
    API_SECURITY_TOKEN: process.env.API_SECURITY_TOKEN,
    CONFIG_ID: process.env.CONFIG_ID,
  };

  private axiosRequestConfig: AxiosRequestConfig = {
    baseURL: this.environmentMap.API_ENDPOINT,
    url: `/rest/storefront/settings/${this.environmentMap.CONFIG_ID}`,
    method: 'GET',
    withCredentials: true,
    headers: {
      'X-Security-Token': this.environmentMap.API_SECURITY_TOKEN,
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
