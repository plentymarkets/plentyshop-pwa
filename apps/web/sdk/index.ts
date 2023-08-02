import { PlentysystemsModuleType, plentysystemsModule } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src/index';
import { initSDK, buildModule } from '@vue-storefront/sdk';

const sdkConfig = {
  plentysystems: buildModule<PlentysystemsModuleType>(plentysystemsModule, {
    apiUrl: 'http://localhost:8181/plentysystems'
  }),
};


export const sdk = initSDK<typeof sdkConfig>(sdkConfig);
