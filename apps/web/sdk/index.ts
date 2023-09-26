import { PlentysystemsModuleType, plentysystemsModule, client } from '@plentymarkets/shop-sdk';
import { initSDK, buildModule } from '@vue-storefront/sdk';
import { createSharedComposable } from '@vueuse/core';

export const useSdk = createSharedComposable(() => {
  const config = useRuntimeConfig();

  const sdkConfig = {
    plentysystems: buildModule<PlentysystemsModuleType>(plentysystemsModule, {
      apiUrl: `${config.public.apiUrl}/plentysystems`,
    }),
  };

  const cookieHeaders = useRequestHeaders(['cookie']);

  client.interceptors.request.use(
    (config) => {
      if (process.server) {
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
