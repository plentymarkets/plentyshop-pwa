import { Product } from '@plentymarkets/shop-api';

export type WishlistPageContentProps = {
  withHeader?: boolean;
  title?: string;
  products?: Product[];
};
