import { initSDK, buildModule } from '@vue-storefront/sdk';
import { PlentysystemsModuleType, plentysystemsModule } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src/index';
import { createSharedComposable } from '@vueuse/core';

export const useSdk = createSharedComposable(() => {
  const sdkConfig = {
    plentysystems: buildModule<PlentysystemsModuleType>(plentysystemsModule, {
      apiUrl: 'http://localhost:8181/plentysystems'
    }),
  };

  return initSDK<typeof sdkConfig>(sdkConfig);
});
