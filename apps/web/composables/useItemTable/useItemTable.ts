import type { UseItemTableState, UseItemTableReturn } from './types';
import type { ApiError, StorageObject } from '@plentymarkets/shop-api';
import { validateImageFile } from '~/utils/allowedFilesHelper';
export const UPLOADING_CLASS = '__uploading__';

export const useItemsTable: UseItemTableReturn = () => {
  const state = useState<UseItemTableState>('useItemTable', () => ({
    data: [],
    loading: false,
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

  const getStorageItems = async (fileTypes = 'png,jpg,jpeg,avif,webp') => {
    state.value.loading = true;

    if (cachedImages.value.length > 0) {
      state.value.data = cachedImages.value;
      state.value.loading = false;
      return;
    }

    const response = await useSdk().plentysystems.getStorageItems({ fileTypes });
    state.value.loading = false;

    if (!response || !response.data) {
      const { send } = useNotification();
      send({ type: 'negative', message: 'Failed to fetch images.' });
      return;
    }

    const items: StorageObject[] = response.data ?? [];
    state.value.data = items;
    cachedImages.value = items;
  };
  const headers = ref([
    { title: 'File name', key: 'key' },
    { title: 'Image size', key: 'size' },
    { title: 'Last change', key: 'lastModified' },
  ]);

  const makeTempKey = (name: string) => `__uploading__:${Date.now()}:${name}`;

  const addPlaceholderFirst = (key: string, size: number) => {
    const ph: StorageObject = {
      key,
      eTag: '',
      size: String(size),
      lastModified: new Date().toISOString(),
      storageClass: UPLOADING_CLASS,
      publicUrl: '',
      previewUrl: '',
    };
    state.value.data = [ph, ...state.value.data];
    cachedImages.value = [ph, ...cachedImages.value];
  };

  const removeByKey = (key: string) => {
    const remove = (arr: StorageObject[]) => arr.filter((item) => item.key !== key);
    state.value.data = remove(state.value.data);
    cachedImages.value = remove(cachedImages.value);
  };

  const replaceByKey = (key: string, item: StorageObject) => {
    const replace = (arr: StorageObject[]) => {
      const idx = arr.findIndex((item) => item.key === key);
      if (idx < 0) return [item, ...arr];
      const copy = arr.slice();
      copy.splice(idx, 1, item);
      return copy;
    };
    state.value.data = replace(state.value.data);
    cachedImages.value = replace(cachedImages.value);
  };

  const uploadFile = async (base64: string, file: File) => {
    const { data } = await useSdk().plentysystems.doUploadStorageItem({
      base64,
      key: file.name,
      type: file.type,
    });
    return data as Partial<StorageObject>;
  };

  const buildItemFrom = (api: Partial<StorageObject>, file: File): StorageObject => {
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

  const uploadStorageItem = async (file: File): Promise<StorageObject | null> => {
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

      const api = await uploadFile(base64, file);

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

  onBeforeUnmount(() => {
    revokeAllBlobUrls();
  });

  return {
    getStorageItems,
    uploadStorageItem,
    getStorageMetadata,
    bytesToMB,
    formatDate,
    headers,
    revokeAllBlobUrls,
    ...toRefs(state.value),
  };
};
