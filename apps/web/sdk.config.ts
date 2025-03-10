import type { Endpoints } from '@plentymarkets/shop-api';
import { httpClient } from './sdk.client';

export default defineSdkConfig((context) => {
  const { buildModule, config, middlewareModule, getRequestHeaders } = context;
  return {
    plentysystems: buildModule(middlewareModule<Endpoints>, {
      apiUrl: config.apiUrl + '/plentysystems',
      defaultRequestConfig: {
        headers: getRequestHeaders(),
      },
      httpClient,
    }),
  };
});
