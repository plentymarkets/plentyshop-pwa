import type { StorageObject } from '@plentymarkets/shop-api';
import type { RegisterBlobUrl } from '../types';

export const extractFolders = (items: StorageObject[]): string[] => {
  const folderSet = new Set<string>();
  items.forEach((item) => {
    const key = item.key;
    const lastSlash = key.lastIndexOf('/');
    if (lastSlash > 0) {
      const folder = key.substring(0, lastSlash);
      folderSet.add(folder);
    }
  });
  return Array.from(folderSet);
};

export const createPlaceholderObject = (key: string, size: number, uploadingClass: string): StorageObject => {
  return {
    key,
    eTag: '',
    size: String(size),
    lastModified: new Date().toISOString(),
    storageClass: uploadingClass,
    publicUrl: '',
    previewUrl: '',
  };
};

export const removeByKeyFromArray = (arr: StorageObject[], key: string): StorageObject[] => {
  return arr.filter((item) => item.key !== key);
};

export const replaceByKeyInArray = (arr: StorageObject[], key: string, item: StorageObject): StorageObject[] => {
  const idx = arr.findIndex((el) => el.key === key);
  if (idx < 0) return [item, ...arr];
  const copy = arr.slice();
  copy.splice(idx, 1, item);
  return copy;
};

export const buildItemHelper = (
  api: Partial<StorageObject>,
  file: File,
  registerBlobUrl: RegisterBlobUrl,
): StorageObject => {
  const objectUrl = api.publicUrl ? undefined : URL.createObjectURL(file);
  if (objectUrl) registerBlobUrl(objectUrl);

  return {
    key: api.key ?? file.name,
    eTag: api.eTag ?? '',
    size: api.size ?? String(file.size),
    lastModified: api.lastModified ?? new Date().toISOString(),
    storageClass: api.storageClass ?? '',
    publicUrl: api.publicUrl ?? (objectUrl as string),
    previewUrl: api.publicUrl ? undefined : (objectUrl as string),
  };
};
