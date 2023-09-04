import { PlentysystemsModuleType, plentysystemsModule } from '@plentymarkets/shop-sdk';
import { initSDK, buildModule } from '@vue-storefront/sdk';
import { createSharedComposable } from '@vueuse/core';

export const useSdk = createSharedComposable(() => {
  const sdkConfig = {
    plentysystems: buildModule<PlentysystemsModuleType>(plentysystemsModule, {
      apiUrl: 'https://fcsgmt0e4z97.c14-01.plentymarkets.com/plentysystems',
    }),
  };

  return initSDK<typeof sdkConfig>(sdkConfig);
});
