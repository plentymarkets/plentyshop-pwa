import type { HeaderSettings, HeaderConfiguration } from '~/prototype-1-be-driven/blocks/Header/types';
import type { Block } from '@plentymarkets/shop-api';
import { mockHeaderBlockMinimal } from '~/prototype-1-be-driven/mocks/headerMocks';

export const useHeader = () => {
  const getHeaderSettings = (): HeaderSettings => {
    const config = mockHeaderBlockMinimal.configuration as HeaderConfiguration;
    return {
      layout: config?.layout,
      blocks: mockHeaderBlockMinimal.content as Block[],
    };
  };

  return {
    getHeaderSettings,
  };
};
