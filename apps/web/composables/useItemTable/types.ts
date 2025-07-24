// import type { StorageObject, StorageMetadataData } from '@plentymarkets/shop-api';

interface StorageObject {
  key: string;
  lastModified: string;
  eTag: string;
  size: string;
  storageClass: string;
  publicUrl: string;
  previewUrl?: string;
}

interface StorageMetadataData {
  width: string;
  height: string;
}

export interface UseItemTableState {
  data: StorageObject[];
  loading: boolean;
}

export type GetStorageItems = (fileTypes?: string) => Promise<void>;

export interface UseItemTableTemplate {
  data: Readonly<Ref<UseItemTableState['data']>>;
  loading: Readonly<Ref<boolean>>;
  headers: Readonly<Ref<{ title: string; key: string }[]>>;
  getStorageItemsServer: GetStorageItems;
  bytesToMB: (bytes: string | number) => string;
  formatDate: (dateString: string) => string;
  getStorageMetadata: (key: string) => Promise<StorageMetadataData>;
}

export type UseItemTableReturn = () => UseItemTableTemplate;
