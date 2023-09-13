import type { Ref } from 'vue';
import { OrderDocument } from '@plentymarkets/shop-api';

export interface UseOrderDocumentState {
  data: number[];
  loading: boolean;
}

export type GetDocument = (document: OrderDocument, accessKey: string) => Promise<number[]>;

export interface UseOrderDocumentMethods {
  data: Readonly<Ref<UseOrderDocumentState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getDocument: GetDocument;
}

export type UseOrderDocumentMethodsReturn = () => UseOrderDocumentMethods;
