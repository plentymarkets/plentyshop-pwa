import type { Product } from '@plentymarkets/shop-api';
import type { BlockProps, TextAlignment } from '~/types/blocks';

export type ItemCountPosition = TextAlignment;
export type ContentAlignment = TextAlignment;
export type PaginationPosition = 'top' | 'bottom' | 'both';
export type AddToCartStyle = 'primary' | 'secondary';

export type ItemGridFieldKey = 'title' | 'rating' | 'previewText' | 'price' | 'addToCart' | 'manufacturer';

export type ItemGridFieldsVisibility = Record<ItemGridFieldKey, boolean>;

/**
 * ItemGrid block with runtime-injected properties.
 * Uses intersection pattern to extend BlockProps with products array and pagination properties.
 */
export type ItemGridProps = BlockProps<ItemGridContent> & {
  products?: Product[];
  productsPerPage?: number;
  totalProducts?: number;
};

export interface ItemGridContent {
  itemsPerRowDesktop: number;
  itemsPerRowTablet: number;
  itemsPerRowMobile: number;
  showItemCount: boolean;
  itemCountPosition: ItemCountPosition;
  fields: ItemGridFieldsVisibility;
  fieldsOrder: ItemGridFieldKey[];
  fieldsDisabled: ItemGridFieldKey[];
  contentAlignment: ContentAlignment;
  cardBorders: boolean;
  showSecondImageOnHover: boolean;
  showWishlistButton: boolean;
  addToCartStyle: AddToCartStyle;
  paginationPosition: PaginationPosition;
}

export interface ItemGridFormProps {
  uuid?: string;
}
