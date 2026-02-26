export interface CategoryContent {
  categoryData: {
    name: string;
    fields: {
      name: boolean;
      description1: boolean;
      description2: boolean;
      shortDescription: boolean;
    };
    fieldsOrder: string[];
    fieldsDisabled: string[];
    displayCategoryImage: string;
    image: {
      fillMode: string;
      alt: string;
      brightness: number;
    };
    text: {
      color: string;
      bgColor: string;
      bgOpacity: number;
      textAlignment: string;
      justify: string;
      align: string;
      background: boolean;
    };
    layout: {
      paddingTop: number;
      paddingBottom: number;
      paddingLeft: number;
      paddingRight: number;
    };
  };
  multiGrid: {
    configuration: {
      columnWidths: number[];
    };
    layout: {
      gap: string;
      narrowContainer: boolean;
    };
  };
  sortFilter: {
    fields: {
      category: boolean;
      sortBy: boolean;
      perPage: boolean;
      itemRating: boolean;
      manufacturer: boolean;
      price: boolean;
      availability: boolean;
      customizedFilters: boolean;
    };
    filtersOrder: string[];
    filtersDisabled: string[];
    showAllFiltersImmediately: boolean;
    numberOfFiltersToShowInitially: number;
  };
  itemGrid: {
    itemsPerRowDesktop: number;
    itemsPerRowTablet: number;
    itemsPerRowMobile: number;
    showItemCount: boolean;
    itemCountPosition: string;
    fields: {
      title: boolean;
      rating: boolean;
      previewText: boolean;
      price: boolean;
      addToCart: boolean;
    };
    fieldsOrder: string[];
    fieldsDisabled: string[];
    contentAlignment: string;
    cardBorders: boolean;
    showSecondImageOnHover: boolean;
    showWishlistButton: boolean;
    addToCartStyle: string;
    paginationPosition: string;
  };
}
