import type { CategoryContent } from './interface';

const content: CategoryContent = {
  categoryData: {
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
    },
  },
  multiGrid: {
    configuration: {
      columnWidths: [3, 9],
    },
    layout: {
      gap: 'XL',
      narrowContainer: true,
    },
  },
  sortFilter: {
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
  itemGrid: {
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
};

export default content;
