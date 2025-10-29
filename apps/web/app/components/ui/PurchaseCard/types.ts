import type { Product } from '@plentymarkets/shop-api';

export type PriceCardFieldKey =
  | 'itemName'
  | 'price'
  | 'tags'
  | 'availability'
  | 'starRating'
  | 'variationProperties'
  | 'orderProperties'
  | 'previewText'
  | 'attributes'
  | 'itemBundle'
  | 'graduatedPrices'
  | 'addToWishlist'
  | 'quantityAndAddToCart'
  | 'itemText'
  | 'technicalData';

export type WishlistSize = 'small' | 'large';

export type PriceCardFieldsVisibility = Record<PriceCardFieldKey, boolean>;

export type PriceCardPadding = {
  paddingTop: number;
  paddingBottom: number;
  paddingRight: number;
  paddingLeft: number;
};

export interface PriceCardContent {
  fields: PriceCardFieldsVisibility;
  fieldsOrder: PriceCardFieldKey[];
  fieldsDisabled: PriceCardFieldKey[];
  wishlistSize: WishlistSize;

  dropShadow: boolean;
  borders: boolean;
  borderColor: string;
  layout: PriceCardPadding
}

export type PurchaseCardProps = {
  product: Product;
  configuration?: PriceCardContent;
};
