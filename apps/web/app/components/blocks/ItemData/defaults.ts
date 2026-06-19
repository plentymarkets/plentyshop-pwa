import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  'item-page': {
    category: 'item-page',
    accessControl: ['product'],
    title: 'Item Page',
    blockName: 'ItemPage',
    variations: [
      {
        title: 'More details',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/Item_data_updated.svg',
        template: {
          en: {
            name: 'ItemData',
            type: 'content',
            meta: {
              uuid: 'e1b7c9d2-3f4a-4e6b-9c8d-7a5f2e1b3cfd',
              isGlobalTemplate: false,
            },
            parent_slot: 0,
            content: {
              text: {
                title: 'More details',
              },
              fields: {
                itemId: true,
                condition: true,
                ageRating: true,
                externalVariationId: true,
                model: true,
                manufacturer: true,
                manufacturingCountry: true,
                content: true,
                grossWeight: true,
                netWeight: true,
                dimensions: true,
                customTariffNumber: true,
                properties: true,
              },
              fieldsOrder: [
                'itemId',
                'condition',
                'ageRating',
                'externalVariationId',
                'model',
                'manufacturer',
                'manufacturingCountry',
                'content',
                'grossWeight',
                'netWeight',
                'dimensions',
                'customTariffNumber',
                'properties',
              ],
              layout: {
                paddingTop: 0,
                paddingBottom: 0,
                paddingRight: 0,
                paddingLeft: 0,
                displayAsCollapsable: false,
                initiallyCollapsed: false,
              },
            },
          },
          de: {
            name: 'ItemData',
            type: 'content',
            meta: {
              uuid: 'a9c2e3f4-5b6d-4c7e-8f9a-0b1c2d3e4t5a',
              isGlobalTemplate: false,
            },
            parent_slot: 0,
            content: {
              text: {
                title: 'Weitere Details',
              },
              fields: {
                itemId: true,
                condition: true,
                ageRating: true,
                externalVariationId: true,
                model: true,
                manufacturer: true,
                manufacturingCountry: true,
                content: true,
                grossWeight: true,
                netWeight: true,
                dimensions: true,
                customTariffNumber: true,
                properties: true,
              },
              fieldsOrder: [
                'itemId',
                'condition',
                'ageRating',
                'externalVariationId',
                'model',
                'manufacturer',
                'manufacturingCountry',
                'content',
                'grossWeight',
                'netWeight',
                'dimensions',
                'customTariffNumber',
                'properties',
              ],
              layout: {
                paddingTop: 0,
                paddingBottom: 0,
                paddingRight: 0,
                paddingLeft: 0,
                displayAsCollapsable: false,
                initiallyCollapsed: false,
              },
            },
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
