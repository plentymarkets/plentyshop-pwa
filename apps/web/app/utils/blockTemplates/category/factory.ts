import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';
import { createFooter } from '../footer/factory';

export function createCategory(): Block[] {
  const categoryName = t('defaultTemplate.category.categoryData.name');

  return [
    {
      name: 'CategoryData',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: false,
      },
      content: {
        name: categoryName,
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
        },
      },
    },
    {
      name: 'MultiGrid',
      type: 'structure',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: false,
      },
      configuration: {
        columnWidths: [3, 9],
      },
      layout: {
        gap: 'XL',
        narrowContainer: true,
      },
      content: [
        {
          name: 'SortFilter',
          type: 'content',
          meta: {
            uuid: uuid(),
            isGlobalTemplate: false,
          },
          parent_slot: 0,
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
          },
        },
        {
          name: 'ItemGrid',
          type: 'content',
          meta: {
            uuid: uuid(),
            isGlobalTemplate: false,
          },
          parent_slot: 1,
          content: {
            itemsPerRowDesktop: 4,
            itemsPerRowTablet: 3,
            itemsPerRowMobile: 1,
            showItemCount: true,
            itemCountPosition: 'left',
            fields: {
              title: true,
              rating: true,
              previewText: true,
              price: true,
              addToCart: true,
            },
            fieldsOrder: ['title', 'rating', 'previewText', 'price', 'addToCart'],
            fieldsDisabled: ['title'],
            contentAlignment: 'left',
            cardBorders: true,
            showSecondImageOnHover: false,
            showWishlistButton: true,
            addToCartStyle: 'primary',
            paginationPosition: 'bottom',
          },
        },
      ],
    },
    createFooter(),
  ] as Block[];
}
