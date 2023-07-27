import { ProductItemDocumentData } from '../../../../../plentymarkets-sdk/packages/api-client';

export type CategoryPageContentProps = {
  title: string;
  totalProducts: number;
  itemsPerPage?: number;
  products?: ProductItemDocumentData[];
};
