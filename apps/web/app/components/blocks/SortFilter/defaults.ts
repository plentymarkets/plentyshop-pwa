import type { BlocksList } from '~/composables/useBlocksList/types';

const blocksList = {
  'item-category': {
    category: 'item-category',
    accessControl: ['productCategory'],
    title: 'Item Category',
    blockName: 'ItemGrid',
    variations: [
      {
        title: 'Category Sort & Filter Vertical',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/sorting_vertical.png',
        template: {
          en: {
            name: 'SortFilter',
            type: 'content',
            meta: {
              uuid: '1233c1d9-2e6f-4a5b-8c7d-1e2f3b4c5a6z',
              isGlobalTemplate: false,
            },
            content: {
              fields: {
                category: true,
                sortBy: true,
                perPage: true,
                itemRating: true,
                manufacturer: true,
                price: true,
                availability: true,
                customizedFilters: true,
              },
              filtersOrder: [
                'category',
                'sortBy',
                'perPage',
                'itemRating',
                'manufacturer',
                'price',
                'availability',
                'customizedFilters',
              ],
              filtersDisabled: [],
              showAllFiltersImmediately: true,
              numberOfFiltersToShowInitially: 0,
              layout: {
                isFullWidth: false,
              },
            },
          },
          de: {
            name: 'SortFilter',
            type: 'content',
            meta: {
              uuid: '1233c1d9-2e6f-4a5b-8c7d-1e2f3b4c5a6z',
              isGlobalTemplate: false,
            },
            content: {
              fields: {
                category: true,
                sortBy: true,
                perPage: true,
                itemRating: true,
                manufacturer: true,
                price: true,
                availability: true,
                customizedFilters: true,
              },
              filtersOrder: [
                'category',
                'sortBy',
                'perPage',
                'itemRating',
                'manufacturer',
                'price',
                'availability',
                'customizedFilters',
              ],
              filtersDisabled: [],
              showAllFiltersImmediately: true,
              numberOfFiltersToShowInitially: 0,
              layout: {
                isFullWidth: false,
              },
            },
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
