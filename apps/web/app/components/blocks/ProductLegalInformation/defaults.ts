import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  'item-page': {
    category: 'item-page',
    accessControl: ['product'],
    title: 'Item Page',
    blockName: 'ItemPage',
    variations: [
      {
        title: 'Legal Information',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/legal_information.svg',
        template: {
          en: {
            name: 'ProductLegalInformation',
            type: 'content',
            meta: {
              uuid: 'e1b7c9d2-3f4a-4e6b-9c8d-7a5f2e1b3c4d',
              isGlobalTemplate: false,
            },
            parent_slot: 0,
            content: {
              text: {
                title: 'Item legal details',
                linkText: 'EU Responsible Person - click for details',
              },
              layout: {
                fullWidth: false,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
          },
          de: {
            name: 'ProductLegalInformation',
            type: 'content',
            meta: {
              uuid: 'a9c2e3f4-5b6d-4c7e-8f9a-0b1c2d3e4f5a',
              isGlobalTemplate: false,
            },
            parent_slot: 0,
            content: {
              text: {
                title: 'Rechtliche Angaben zum Artikel',
                linkText: 'EU-Verantwortlicher – hier klicken für Details',
              },
              layout: {
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
