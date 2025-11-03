import type { StorageObject } from '@plentymarkets/shop-api';

export function extractFolders(items: StorageObject[]): string[] {
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
}

export function createPlaceholderObject(key: string, size: number, uploadingClass: string): StorageObject {
  return {
    key,
    eTag: '',
    size: String(size),
    lastModified: new Date().toISOString(),
    storageClass: uploadingClass,
    publicUrl: '',
    previewUrl: '',
  };
}

export function removeByKeyFromArray(arr: StorageObject[], key: string): StorageObject[] {
  return arr.filter((item) => item.key !== key);
}

export function replaceByKeyInArray(arr: StorageObject[], key: string, item: StorageObject): StorageObject[] {
  const idx = arr.findIndex((el) => el.key === key);
  if (idx < 0) return [item, ...arr];
  const copy = arr.slice();
  copy.splice(idx, 1, item);
  return copy;
}
