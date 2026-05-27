import type { UseItemTableState, UseItemTableReturn } from './types';
import type { ApiError, StorageObject } from '@plentymarkets/shop-api';
import { validateImageFile, getAllowedImageExtensions } from '~/utils/allowedImageFilesHelper';
import {
  extractFolders,
  createPlaceholderObject,
  removeByKeyFromArray,
  replaceByKeyInArray,
  buildItemHelper,
} from './helpers/itemTableHelpers';
export const UPLOADING_CLASS = '__uploading__';

export const useItemsTable: UseItemTableReturn = () => {
  const state = useState<UseItemTableState>('useItemTable', () => ({
    data: [],
    loading: false,
    loadingMore: false,
  }));
  const pendingBlobUrls = useState<string[]>('pending-blob-urls', () => []);

  const registerBlobUrl = (url: string) => {
    pendingBlobUrls.value.push(url);
  };

  const revokeAllBlobUrls = () => {
    for (const url of pendingBlobUrls.value) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* empty */
      }
    }
    pendingBlobUrls.value = [];
  };
  const cachedImages = useState<StorageObject[]>('image-table-cache', () => []);
  const folders = useState<string[]>('image-table-folders', () => []);

  const loadMoreStorageItems = async (fileTypes: string, continuationToken: string) => {
    const { data } = await useSdk().plentysystems.getTruncatedStorageItems({
      fileTypes: fileTypes ?? getAllowedImageExtensions(),
      includeFolders: 'true',
      continuationToken: continuationToken,
    });

    if (!data) {
      return;
    }

    const items: StorageObject[] = data.objects ?? [];

    state.value.data.push(...items);
    cachedImages.value.push(...items);
    folders.value.push(...extractFolders(items));

    state.value.data = Array.from(new Map(state.value.data.map((item) => [item.key, item])).values());
    cachedImages.value = Array.from(new Map(cachedImages.value.map((item) => [item.key, item])).values());
    folders.value = Array.from(new Set(folders.value));

    if (data.nextContinuationToken && data.isTruncated) {
      await loadMoreStorageItems(fileTypes, data.nextContinuationToken);
    }
  };

  const getStorageItems = async (fileTypes: string) => {
    state.value.loading = true;

    if (cachedImages.value.length > 0) {
      state.value.data = cachedImages.value;
      folders.value = extractFolders(cachedImages.value);
      state.value.loading = false;
      return;
    }

    const { data } = await useSdk().plentysystems.getTruncatedStorageItems({
      fileTypes: fileTypes ?? getAllowedImageExtensions(),
      includeFolders: 'true',
    });
    state.value.loading = false;

    if (!data) {
      const { send } = useNotification();
      send({ type: 'negative', message: 'Failed to fetch images.' });
      return;
    }

    try {
      const items: StorageObject[] = data.objects ?? [];

      state.value.data = items;
      cachedImages.value = items;
      folders.value = extractFolders(items);

      if (data.isTruncated && data.nextContinuationToken) {
        state.value.loadingMore = true;
        await loadMoreStorageItems(fileTypes, data.nextContinuationToken);
        state.value.loadingMore = false;
      }
    } finally {
      state.value.loading = false;
      state.value.loadingMore = false;
    }
  };

  const headers = ref([
    { title: 'File name', key: 'fileName' },
    { title: 'Path', key: 'path' },
    { title: 'Image size', key: 'size' },
    { title: 'Last change', key: 'lastModified' },
  ]);

  const makeTempKey = (name: string) => `__uploading__:${Date.now()}:${name}`;

  const addPlaceholderFirst = (key: string, size: number) => {
    const placeholder = createPlaceholderObject(key, size, UPLOADING_CLASS);
    state.value.data = [placeholder, ...state.value.data];
    cachedImages.value = [placeholder, ...cachedImages.value];
  };
  const removeByKey = (key: string) => {
    state.value.data = removeByKeyFromArray(state.value.data, key);
    cachedImages.value = removeByKeyFromArray(cachedImages.value, key);
  };

  const replaceByKey = (key: string, item: StorageObject) => {
    state.value.data = replaceByKeyInArray(state.value.data, key, item);
    cachedImages.value = replaceByKeyInArray(cachedImages.value, key, item);
  };

  const uploadFile = async (base64: string, file: File, folderPath: string = '') => {
    const filename = folderPath ? `${folderPath.replace(/\/$/, '')}/${file.name}` : file.name;

    const { data } = await useSdk().plentysystems.doUploadStorageItem({
      base64,
      key: filename,
      type: file.type,
    });
    return data as Partial<StorageObject>;
  };

  const buildItemFrom = (api: Partial<StorageObject>, file: File): StorageObject => {
    return buildItemHelper(api, file, registerBlobUrl);
  };

  const uploadStorageItem = async (file: File, filePath = ''): Promise<StorageObject | null> => {
    const errorMsg = validateImageFile(file);
    if (!errorMsg.ok) {
      const { send } = useNotification();
      send({ type: 'negative', message: errorMsg.reason });
      return null;
    }

    const tempKey = makeTempKey(file.name);
    addPlaceholderFirst(tempKey, file.size);

    try {
      const base64 = await fileToBase64(file);
      if (!base64) {
        removeByKey(tempKey);
        return null;
      }

      const api = await uploadFile(base64, file, filePath);

      const newItem = buildItemFrom(api, file);

      replaceByKey(tempKey, newItem);

      return newItem;
    } catch (e) {
      removeByKey(tempKey);
      const { send } = useNotification();
      send({ type: 'negative', message: (e as ApiError).message || 'Image upload failed.' });
      console.error('Upload error:', e);
      return null;
    }
  };
  const bytesToMB = (bytes: string | number): string => {
    const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
    return (num / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getStorageMetadata = async (key: string) => {
    const response = await useSdk().plentysystems.getStorageMetadata({ key });

    return response.data;
  };

  return {
    getStorageItems,
    uploadStorageItem,
    getStorageMetadata,
    bytesToMB,
    formatDate,
    headers,
    registerBlobUrl,
    revokeAllBlobUrls,
    folders,
    ...toRefs(state.value),
  };
};
