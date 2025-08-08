import type { StorageObject, StorageMetadataData } from '@plentymarkets/shop-api';

export interface UseItemTableState {
  data: StorageObject[];
  loading: boolean;
}

export type GetStorageItems = (fileTypes?: string) => Promise<void>;

export interface UseItemTableTemplate {
  data: Readonly<Ref<UseItemTableState['data']>>;
  loading: Readonly<Ref<boolean>>;
  headers: Readonly<Ref<{ title: string; key: string }[]>>;
  uploadStorageItem: (file: File, filePath: string) => unknown;
  getStorageItemsServer: GetStorageItems;
  bytesToMB: (bytes: string | number) => string;
  formatDate: (dateString: string) => string;
  getStorageMetadata: (key: string) => Promise<StorageMetadataData>;
  folders: Readonly<Ref<string[]>>;
}

export type UseItemTableReturn = () => UseItemTableTemplate;
