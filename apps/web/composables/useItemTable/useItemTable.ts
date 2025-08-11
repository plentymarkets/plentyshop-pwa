import type { UseItemTableState, UseItemTableReturn } from './types';
import type { ApiError, StorageObject } from '@plentymarkets/shop-api';

export const useItemsTable: UseItemTableReturn = () => {
  const state = useState<UseItemTableState>('useItemTable', () => ({
    data: [],
    loading: false,
  }));

  const cachedImages = useState<StorageObject[]>('image-table-cache', () => []);
  const folders = useState<string[]>('image-table-folders', () => []);

  const extractFolders = (items: StorageObject[]): string[] => {
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

  const getStorageItems = async (fileTypes = 'png,jpg,jpeg,avif,webp') => {
    state.value.loading = true;

    if (cachedImages.value.length > 0) {
      state.value.data = cachedImages.value;

      folders.value = extractFolders(cachedImages.value);
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

    folders.value = extractFolders(items);
  };

  const headers = ref([
    { title: 'File name', key: 'fileName' },
    { title: 'Path', key: 'path' },
    { title: 'Image size', key: 'size' },
    { title: 'Last change', key: 'lastModified' },
  ]);
  const uploadStorageItem = async (file: File, path = '') => {
    state.value.loading = true;

    const base64String = await fileToBase64(file);
    if (!base64String) {
      state.value.loading = false;
      return null;
    }

    const key = path ? `${path.replace(/\/$/, '')}/${file.name}` : file.name;

    try {
      const result = await useSdk().plentysystems.doUploadStorageItem({
        base64: base64String,
        filename: key,
        type: file.type,
      });

      if (result?.data) {
        const { send } = useNotification();
        send({ type: 'positive', message: `Uploaded: ${result.data.key}` });

        return result.data;
      }
    } catch (error) {
      console.error('Error uploading storage item:', error);
      const { send } = useNotification();
      send({ type: 'negative', message: 'Error uploading storage item.' });
    } finally {
      state.value.loading = false;
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
    folders,
    ...toRefs(state.value),
  };
};
