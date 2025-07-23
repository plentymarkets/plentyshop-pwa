// import type { StorageObject } from '@plentymarkets/shop-api';

interface StorageObject {
  key: string;
  lastModified: string;
  eTag: string;
  size: string;
  storageClass: string;
  publicUrl: string;
  previewUrl?: string;
}

export interface UseItemTableState {
  data: StorageObject[];
  loading: boolean;
}

export type GetStorageItems = (fileTypes?: string) => Promise<void>;

export interface UseItemTableTemplate {
  data: Readonly<Ref<UseItemTableState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getStorageItemsServer: GetStorageItems;
  getStorageItems: GetStorageItems;
  bytesToMB: (bytes: string | number) => string;
}

export type UseItemTableReturn = () => UseItemTableTemplate;
