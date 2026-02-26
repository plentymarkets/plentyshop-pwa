import type { Block } from '@plentymarkets/shop-api';
import type { CategoryContent } from './interface';

export function createCategory(content: CategoryContent): Block[] {
  return [
    {
      name: 'CategoryData',
      type: 'content',
      meta: {
        uuid: '2a8b7e34-3d1a-4b6f-9c9d-5e7a1f2b3c4d',
        isGlobalTemplate: false,
      },
      content: {
        name: content.categoryData.name,
        fields: {
          name: content.categoryData.fields.name,
          description1: content.categoryData.fields.description1,
          description2: content.categoryData.fields.description2,
          shortDescription: content.categoryData.fields.shortDescription,
        },
        fieldsOrder: content.categoryData.fieldsOrder,
        fieldsDisabled: content.categoryData.fieldsDisabled,
        displayCategoryImage: content.categoryData.displayCategoryImage,
        image: {
          fillMode: content.categoryData.image.fillMode,
          alt: content.categoryData.image.alt,
          brightness: content.categoryData.image.brightness,
        },
        text: {
          color: content.categoryData.text.color,
          bgColor: content.categoryData.text.bgColor,
          bgOpacity: content.categoryData.text.bgOpacity,
          textAlignment: content.categoryData.text.textAlignment,
          justify: content.categoryData.text.justify,
          align: content.categoryData.text.align,
          background: content.categoryData.text.background,
        },
        layout: {
          paddingTop: content.categoryData.layout.paddingTop,
          paddingBottom: content.categoryData.layout.paddingBottom,
          paddingLeft: content.categoryData.layout.paddingLeft,
          paddingRight: content.categoryData.layout.paddingRight,
        },
      },
    },
    {
      name: 'MultiGrid',
      type: 'structure',
      meta: {
        uuid: '7b8a7c6d-5e4f-4d3c-ab1a-0f9e8d7c6b5a',
        isGlobalTemplate: false,
      },
      configuration: {
        columnWidths: content.multiGrid.configuration.columnWidths,
        layout: {
          gap: content.multiGrid.layout.gap,
          narrowContainer: content.multiGrid.layout.narrowContainer,
        },
      },
      content: [
        {
          name: 'SortFilter',
          type: 'content',
          meta: {
            uuid: '07b3c1d9-2e6f-4a5b-8c7d-1e2f3b4c5a6z',
            isGlobalTemplate: false,
          },
          parent_slot: 0,
          content: {
            fields: {
              category: content.sortFilter.fields.category,
              sortBy: content.sortFilter.fields.sortBy,
              perPage: content.sortFilter.fields.perPage,
              itemRating: content.sortFilter.fields.itemRating,
              manufacturer: content.sortFilter.fields.manufacturer,
              price: content.sortFilter.fields.price,
              availability: content.sortFilter.fields.availability,
              customizedFilters: content.sortFilter.fields.customizedFilters,
            },
            filtersOrder: content.sortFilter.filtersOrder,
            filtersDisabled: content.sortFilter.filtersDisabled,
            showAllFiltersImmediately: content.sortFilter.showAllFiltersImmediately,
            numberOfFiltersToShowInitially: content.sortFilter.numberOfFiltersToShowInitially,
          },
        },
        {
          name: 'ItemGrid',
          type: 'content',
          meta: {
            uuid: '07b3c1d9-2e6f-4a5b-8c7d-1e2f3b4c5a6d',
            isGlobalTemplate: false,
          },
          parent_slot: 1,
          content: {
            itemsPerRowDesktop: content.itemGrid.itemsPerRowDesktop,
            itemsPerRowTablet: content.itemGrid.itemsPerRowTablet,
            itemsPerRowMobile: content.itemGrid.itemsPerRowMobile,
            showItemCount: content.itemGrid.showItemCount,
            itemCountPosition: content.itemGrid.itemCountPosition,
            fields: {
              title: content.itemGrid.fields.title,
              rating: content.itemGrid.fields.rating,
              previewText: content.itemGrid.fields.previewText,
              price: content.itemGrid.fields.price,
              addToCart: content.itemGrid.fields.addToCart,
            },
            fieldsOrder: content.itemGrid.fieldsOrder,
            fieldsDisabled: content.itemGrid.fieldsDisabled,
            contentAlignment: content.itemGrid.contentAlignment,
            cardBorders: content.itemGrid.cardBorders,
            showSecondImageOnHover: content.itemGrid.showSecondImageOnHover,
            showWishlistButton: content.itemGrid.showWishlistButton,
            addToCartStyle: content.itemGrid.addToCartStyle,
            paginationPosition: content.itemGrid.paginationPosition,
          },
        },
      ],
    },
  ];
}
