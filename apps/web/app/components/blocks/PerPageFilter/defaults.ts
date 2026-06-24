import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  'item-category': {
    category: 'item-category',
    accessControl: ['productCategory'],
    title: 'Item Category',
    blockName: 'ItemGrid',
    variations: [
      {
        title: 'Category Filter Per Page',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/Per_page_updated.svg',
        template: {
          en: {
            name: 'PerPageFilter',
            type: 'content',
            meta: {
              uuid: '265438f3-48fe-428f-a87b-d9d29dbeb748',
              isGlobalTemplate: false,
            },
            content: {
              fields: {
                perPage: true,
              },
              layout: {
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                fullWidth: false,
              },
              settings: {
                selectionModeCompact: false,
              },
            },
          },
          de: {
            name: 'PerPageFilter',
            type: 'content',
            meta: {
              uuid: '265438f3-48fe-428f-a87b-d9d29dbeb748',
              isGlobalTemplate: false,
            },
            content: {
              fields: {
                perPage: true,
              },
              layout: {
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                fullWidth: false,
              },
              settings: {
                selectionModeCompact: false,
              },
            },
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
