import { initSDK, buildModule } from '@vue-storefront/sdk';
import { type BoilerplateModuleType, boilerplateModule } from '../../../../plentymarkets-sdk/packages/sdk/src/index';

const sdkConfig = {
  commerce: buildModule<BoilerplateModuleType>(boilerplateModule),
};

export const sdk = initSDK<typeof sdkConfig>(sdkConfig);
