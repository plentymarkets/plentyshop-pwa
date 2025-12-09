import type { ItemGridProps } from '../types';
import { mockProduct } from './Products.mock';

/**
 * Mock ItemGrid block for testing
 * Fully typed with ItemGridProps for type safety
 * Includes runtime-injected products property
 */
export const ItemGridMock: ItemGridProps = {
  name: 'ItemGrid',
  type: 'content',
  content: {
    itemsPerRowDesktop: 4,
    itemsPerRowTablet: 2,
    itemsPerRowMobile: 1,
    showItemCount: true,
    itemCountPosition: 'left',
    fields: {
      title: true,
      rating: true,
      previewText: true,
      price: true,
      addToCart: true,
      manufacturer: false,
    },
    fieldsOrder: ['title', 'rating', 'previewText', 'price', 'addToCart', 'manufacturer'],
    fieldsDisabled: [],
    contentAlignment: 'left',
    cardBorders: false,
    showSecondImageOnHover: false,
    showWishlistButton: false,
    addToCartStyle: 'primary',
    paginationPosition: 'bottom',
  },
  meta: {
    uuid: 'mock-item-grid-uuid',
  },
  products: mockProduct,
  productsPerPage: 4,
  totalProducts: 4,
};
