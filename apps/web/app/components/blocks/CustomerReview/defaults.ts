import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  'item-page': {
    category: 'item-page',
    accessControl: ['product'],
    title: 'Item Page',
    blockName: 'ItemPage',
    variations: [
      {
        title: 'Customer Reviews',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/customer_reviews.svg',
        template: {
          en: {
            name: 'CustomerReview',
            type: 'content',
            meta: {
              uuid: 'b7e8f9a1-2c3d-4e5f-9a8b-7c6d5e4f3a2b',
              isGlobalTemplate: false,
            },
            parent_slot: 0,
            content: {
              text: {
                title: 'Customer Reviews',
              },
              layout: {
                collapsible: true,
                initiallyCollapsed: false,
                fullWidth: false,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
          },
          de: {
            name: 'CustomerReview',
            type: 'content',
            meta: {
              uuid: 'f4e3d2c1-b0a9-48f7-8e6d-5c4b3a2f1e0d',
              isGlobalTemplate: false,
            },
            parent_slot: 0,
            content: {
              text: {
                title: 'Kundenrezensionen',
              },
              layout: {
                collapsible: true,
                initiallyCollapsed: false,
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
