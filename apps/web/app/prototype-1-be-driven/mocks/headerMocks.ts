import type { Block } from '@plentymarkets/shop-api';
import type { HeaderConfiguration } from '~/prototype-1-be-driven/blocks/Header/types';

export const mockHeaderBlockMinimal: Block = {
  name: 'Header',
  type: 'structure',
  content: [
    {
      name: 'MegaMenuBlock',
      type: 'content',
      content: {},
      meta: {
        uuid: 'mega-menu-default',
      },
    },
  ],
  configuration: {
    layout: {
      backgroundColor: 'transparent',
      sticky: false,
      height: 'auto',
    },
  } as HeaderConfiguration,
  meta: {
    uuid: 'header-block-default',
  },
};
