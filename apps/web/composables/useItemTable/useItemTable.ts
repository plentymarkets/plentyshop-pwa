import type { UseItemTableState, UseItemTableReturn } from './types';
import type { StorageObject } from '@plentymarkets/shop-api';
import { ApiError, StorageObject } from '@plentymarkets/shop-api';
import { fileToBase64 } from '~/utils/fileHelper';

export const useItemsTable: UseItemTableReturn = () => {
  const state = useState<UseItemTableState>('useItemTable', () => ({
    data: [],
    loading: false,
  }));

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
const uploadStorageItem = async (file: File) => {
  state.value.loading = true;

  const base64String = await fileToBase64(file);
  if (!base64String) {
    state.value.loading = false;
    return null;
  }

  try {
    const result = await useSdk().plentysystems.doUploadStorageItem({
      base64: base64String,
      key: file.name,
      type: file.type,
    });
    return result.data;
  } catch (error) {
    const { send } = useNotification();

    const err = error as ApiError;

    send({
      type: 'negative',
      message: err.message || 'Image upload failed.',
    });

    console.error('Upload error:', error);
  } finally {
    state.value.loading = false;
  }
};

  const headers = ref([
    { title: 'File name', key: 'key' },
    { title: 'Image size', key: 'size' },
    { title: 'Last change', key: 'lastModified' },
  ]);

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
    getStorageMetadata,
    bytesToMB,
    formatDate,
    headers,
    ...toRefs(state.value),
  };
};
