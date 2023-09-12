import { PlentysystemsModuleType, plentysystemsModule } from '@plentymarkets/shop-sdk';
import { initSDK, buildModule } from '@vue-storefront/sdk';
import { createSharedComposable } from '@vueuse/core';

export const useSdk = createSharedComposable(() => {
  const config = useRuntimeConfig();

  console.log(config.public);

  const sdkConfig = {
    plentysystems: buildModule<PlentysystemsModuleType>(plentysystemsModule, {
      apiUrl: config.public.API_ENDPOINT
        ? `${config.public.API_ENDPOINT}/plentysystems`
        : 'http://localhost:8181/plentysystems',
    }),
  };

  return initSDK<typeof sdkConfig>(sdkConfig);
});
