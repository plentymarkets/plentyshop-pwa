import { PlentysystemsModuleType, plentysystemsModule } from '@plentymarkets/shop-sdk';
import { initSDK, buildModule } from '@vue-storefront/sdk';
import { createSharedComposable } from '@vueuse/core';

export const useSdk = createSharedComposable(() => {

  const config = useRuntimeConfig();

  const sdkConfig = {
    plentysystems: buildModule<PlentysystemsModuleType>(plentysystemsModule, {
      apiUrl: `${config.public.apiUrl}/plentysystems`,
    }),
  };

  return initSDK<typeof sdkConfig>(sdkConfig);
});
