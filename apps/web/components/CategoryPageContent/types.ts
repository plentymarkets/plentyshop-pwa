import { Product } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export type CategoryPageContentProps = {
  title: string;
  totalProducts: number;
  itemsPerPage?: number;
  products?: Product[];
};
