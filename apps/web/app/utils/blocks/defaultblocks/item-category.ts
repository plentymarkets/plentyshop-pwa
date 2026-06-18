import type { BlocksListContribution } from '~/composables/useBlocksList/types';

export default {
  'item-category': {
    category: 'item-category',
    accessControl: ['productCategory'],
    title: 'Item Category',
    blockName: 'ItemGrid',
    variations: [
      {
        title: 'Item Category',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/item_grid.png',
        template: {
          en: {
            name: 'ItemGrid',
            type: 'content',
            meta: {
              uuid: '99b3c1d9-2e6f-4a5b-8c7d-1e2f3b4c5a6d',
              isGlobalTemplate: false,
            },
            content: {
              itemsPerRowDesktop: 4,
              itemsPerRowTablet: 3,
              itemsPerRowMobile: 1,
              showItemCount: true,
              itemCountPosition: 'left',
              fields: {
                manufacturer: true,
                title: true,
                rating: true,
                previewText: true,
                price: true,
                addToCart: true,
              },
              fieldsOrder: ['manufacturer', 'title', 'rating', 'previewText', 'price', 'addToCart'],
              fieldsDisabled: ['title'],
              contentAlignment: 'left',
              cardBorders: true,
              showSecondImageOnHover: false,
              showWishlistButton: true,
              addToCartStyle: 'primary',
              paginationPosition: 'bottom',
              layout: {
                fullWidth: false,
              },
            },
          },
          de: {
            name: 'ItemGrid',
            type: 'content',
            meta: {
              uuid: '1233c1d9-2e6f-4a5b-8c7d-1e2f3b4c5a6d',
              isGlobalTemplate: false,
            },
            content: {
              itemsPerRowDesktop: 4,
              itemsPerRowTablet: 3,
              itemsPerRowMobile: 1,
              showItemCount: true,
              itemCountPosition: 'left',
              fields: {
                manufacturer: true,
                title: true,
                rating: true,
                previewText: true,
                price: true,
                addToCart: true,
              },
              fieldsOrder: ['manufacturer', 'title', 'rating', 'previewText', 'price', 'addToCart'],
              fieldsDisabled: ['title'],
              contentAlignment: 'left',
              cardBorders: true,
              showSecondImageOnHover: false,
              showWishlistButton: true,
              addToCartStyle: 'primary',
              paginationPosition: 'bottom',
              layout: {
                fullWidth: false,
              },
            },
          },
        },
      },
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
      {
        title: 'Category Sort',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/Sort_by_updated.svg',
        template: {
          en: {
            name: 'Sort',
            type: 'content',
            meta: {
              uuid: '265438f3-48fe-428f-a87b-d9d29dbeb948',
              isGlobalTemplate: false,
            },
            content: {
              fields: {
                sortBy: true,
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
            name: 'Sort',
            type: 'content',
            meta: {
              uuid: '265438f3-48fe-428f-a87b-d9d29dbeb948',
              isGlobalTemplate: false,
            },
            content: {
              fields: {
                sortBy: true,
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
} satisfies BlocksListContribution;
