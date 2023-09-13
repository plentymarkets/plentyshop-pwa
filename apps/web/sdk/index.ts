import { PlentysystemsModuleType, plentysystemsModule, client } from '@plentymarkets/shop-sdk';
import { initSDK, buildModule } from '@vue-storefront/sdk';
import { createSharedComposable } from '@vueuse/core';

export const useSdk = createSharedComposable(() => {
  const cookieHeaders = useRequestHeaders(['cookie']);
  const sdkConfig = {
    plentysystems: buildModule<PlentysystemsModuleType>(plentysystemsModule, {
      apiUrl: process.env.API_ENDPOINT
        ? `${process.env.API_ENDPOINT}/plentysystems`
        : 'http://localhost:8181/plentysystems',
    }),
  };


  client.interceptors.request.use(
    (config) => {

      if(process.server) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.cookie = cookieHeaders.cookie ?? '';
      }
      return config;
    },
    (error) => { 
      // Do something with request error
      return Promise.reject(error);
    },
  );

  return initSDK<typeof sdkConfig>(sdkConfig);
});
