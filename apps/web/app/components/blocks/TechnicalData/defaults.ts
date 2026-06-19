import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  'item-page': {
    category: 'item-page',
    accessControl: ['product'],
    title: 'Item Page',
    blockName: 'ItemPage',
    variations: [
      {
        title: 'Technical Data',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/technical_data.svg',
        template: {
          en: {
            name: 'TechnicalData',
            type: 'content',
            meta: {
              uuid: 'c7f1e2d3-4b5a-6c7d-8e9f-0a1b2c3d4e5f',
              isGlobalTemplate: false,
            },
            parent_slot: 0,
            content: {
              text: {
                title: 'Technical Data',
              },
              layout: {
                displayAsCollapsable: true,
                initiallyCollapsed: true,
                fullWidth: false,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
          },
          de: {
            name: 'TechnicalData',
            type: 'content',
            meta: {
              uuid: 'd8e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a',
              isGlobalTemplate: false,
            },
            parent_slot: 0,
            content: {
              text: {
                title: 'Technische Daten',
              },
              layout: {
                displayAsCollapsable: true,
                initiallyCollapsed: true,
                fullWidth: false,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
