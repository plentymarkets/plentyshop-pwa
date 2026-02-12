import type { Block } from '@plentymarkets/shop-api';

export const mockPageAreasResponse = {
  data: [
    {
      name: 'TextCard',
      type: 'content',
      content: { text: { headline: 'Welcome' } },
      meta: { uuid: 'text-1' },
    },
    {
      name: 'MegaMenuBlock',
      type: 'content',
      content: {},
      meta: { uuid: 'menu-1' },
    },
    {
      name: 'TextCard',
      type: 'content',
      content: { text: { headline: 'Support' } },
      meta: { uuid: 'text-2' },
    },
  ] as Block[],
};
