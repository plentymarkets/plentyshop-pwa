import type { OrderDocument } from '@plentymarkets/shop-api';

export interface UseOrderDocumentState {
  data: number[];
  loading: boolean;
}

export type GetDocument = (document: OrderDocument, accessKey: string) => Promise<number[]>;

export type DownloadFile = (bufferArray: number[], name: string, type: string) => void;

export interface UseOrderDocumentMethods {
  data: Readonly<Ref<UseOrderDocumentState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getDocument: GetDocument;
  downloadFile: DownloadFile;
}

export type UseOrderDocumentMethodsReturn = () => UseOrderDocumentMethods;
