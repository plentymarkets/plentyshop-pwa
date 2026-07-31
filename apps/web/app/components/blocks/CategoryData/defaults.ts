import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  'item-category': {
    category: 'item-category',
    accessControl: ['productCategory'],
    title: 'Item Category',
    blockName: 'ItemGrid',
    variations: [
      {
        title: 'Category Data',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/category_data.png',
        template: {
          en: {
            name: 'CategoryData',
            type: 'content',
            meta: {
              uuid: 'abc3c1d9-2e6f-4a5b-8c7d-1e2f3b4c5a6d',
              isGlobalTemplate: false,
            },
            content: {
              name: 'Category name',
              fields: {
                name: true,
                description1: false,
                description2: false,
                shortDescription: false,
              },
              fieldsOrder: ['name', 'description1', 'description2', 'shortDescription'],
              fieldsDisabled: [],
              displayCategoryImage: 'off',
              image: {
                fillMode: 'fill',
                alt: '',
                brightness: 0.75,
              },
              text: {
                color: '#000',
                bgColor: '#fff',
                bgOpacity: 1,
                textAlignment: 'left',
                justify: 'top',
                align: 'left',
                background: true,
              },
              layout: {
                paddingTop: 40,
                paddingBottom: 40,
                paddingLeft: 0,
                paddingRight: 0,
                narrowContainer: true,
                fullWidth: false,
              },
            },
          },
          de: {
            name: 'CategoryData',
            type: 'content',
            meta: {
              uuid: '998c1d9-2e6f-4a5b-8c7d-1e2f3b4c5a6d',
              isGlobalTemplate: false,
            },
            content: {
              name: 'Category name',
              fields: {
                name: true,
                description1: false,
                description2: false,
                shortDescription: false,
              },
              fieldsOrder: ['name', 'description1', 'description2', 'shortDescription'],
              fieldsDisabled: [],
              displayCategoryImage: 'off',
              image: {
                fillMode: 'fill',
                alt: '',
                brightness: 0.75,
              },
              text: {
                color: '#000',
                bgColor: '#fff',
                bgOpacity: 1,
                textAlignment: 'left',
                justify: 'top',
                align: 'left',
                background: true,
              },
              layout: {
                paddingTop: 40,
                paddingBottom: 40,
                paddingLeft: 0,
                paddingRight: 0,
                narrowContainer: true,
                fullWidth: false,
              },
            },
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
