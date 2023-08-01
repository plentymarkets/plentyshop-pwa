import { ProductItemDocumentData } from '@plentymarkets/plentymarkets-sdk/packages/api-client';

export type CategoryPageContentProps = {
  title: string;
  totalProducts: number;
  itemsPerPage?: number;
  products?: ProductItemDocumentData[];
};
