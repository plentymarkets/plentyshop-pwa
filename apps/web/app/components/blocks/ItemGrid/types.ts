import type { Product } from '@plentymarkets/shop-api';

export type ItemCountPosition = 'left' | 'center' | 'right';
export type ContentAlignment = 'left' | 'center' | 'right';
export type PaginationPosition = 'top' | 'bottom' | 'both';
export type AddToCartStyle = 'primary' | 'secondary';

export type ItemGridFieldKey = 'title' | 'rating' | 'previewText' | 'price' | 'addToCart';

export type ItemGridFieldsVisibility = Record<ItemGridFieldKey, boolean>;

export type ItemGridProps = {
  name: string;
  type: string;
  content: ItemGridContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
  products?: Product[];
  productsPerPage?: number;
  totalProducts?: number;
  parentUuid?: string;
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
