import type { StorageObject, StorageMetadataData } from '@plentymarkets/shop-api';

export interface UseItemTableState {
  data: StorageObject[];
  loading: boolean;
}

export type GetStorageItems = (fileTypes?: string) => Promise<void>;
export type RegisterBlobUrl = (url: string) => void;

export interface UseItemTableTemplate {
  data: Readonly<Ref<UseItemTableState['data']>>;
  loading: Readonly<Ref<boolean>>;
  headers: Readonly<Ref<{ title: string; key: string }[]>>;
  getStorageItems: GetStorageItems;
  uploadStorageItem: (file: File, filePath: string) => Promise<StorageObject | null>;
  bytesToMB: (bytes: string | number) => string;
  formatDate: (dateString: string) => string;
  getStorageMetadata: (key: string) => Promise<StorageMetadataData>;
  folders: Readonly<Ref<string[]>>;
  revokeAllBlobUrls: () => void;
  registerBlobUrl: RegisterBlobUrl;
}

export type UseItemTableReturn = () => UseItemTableTemplate;
