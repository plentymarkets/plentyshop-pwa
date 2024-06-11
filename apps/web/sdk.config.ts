import type { Endpoints } from '@plentymarkets/shop-api';
import { httpClient } from './sdk.client';

export default defineSdkConfig(({ buildModule, middlewareUrl, middlewareModule, getRequestHeaders }) => ({
  plentysystems: buildModule(middlewareModule<Endpoints>, {
    apiUrl: middlewareUrl + '/plentysystems',
    defaultRequestConfig: {
      headers: getRequestHeaders(),
    },
    httpClient,
  }),
}));
