import { OrderDocument } from '@plentymarkets/shop-api';

export type DocumentsListProps = {
  documents: OrderDocument[];
  accessKey: string;
};
