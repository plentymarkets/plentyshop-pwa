import type { Product } from '@plentymarkets/shop-api';

export type CategoryPageContentProps = {
  title: string;
  totalProducts: number;
  itemsPerPage: number;
  products?: Product[];
};
