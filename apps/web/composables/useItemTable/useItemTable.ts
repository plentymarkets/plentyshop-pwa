import type { UseItemTableState, UseItemTableReturn } from './types';
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

export const useItemsTable: UseItemTableReturn = () => {
  const state = useState<UseItemTableState>('useItemTable', () => ({
    data: [],
    loading: false,
  }));

  const cachedImages = useState<StorageObject[]>('image-table-cache', () => []);

  const getStorageItemsServer = async (fileTypes = 'png,jpg,jpeg,avif,webp') => {
    state.value.loading = true;

    if (cachedImages.value.length > 0) {
      state.value.data = cachedImages.value;
      state.value.loading = false;
      return;
    }

    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.getStorageItems({
        fileTypes,
      }),
    );
    state.value.loading = false;

    if (error.value) {
      const { send } = useNotification();
      send({ type: 'negative', message: error.value.message });
      return;
    }

    const items: StorageObject[] = data?.value?.data ?? [];

    state.value.data = items;
    cachedImages.value = items;
  };

  const getStorageItems = async (fileTypes = 'png,jpg,jpeg,avif,webp') => {
    state.value.loading = true;

    const response = await useSdk().plentysystems.getStorageItems({ fileTypes });
    const items: StorageObject[] = response?.data ?? [];

    state.value.loading = false;

    if (!items.length) {
      state.value.data = [];
    } else {
      state.value.data = items;
    }
  };

  const bytesToMB = (bytes: string | number): string => {
    const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
    return (num / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
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
    getStorageItemsServer,
    getStorageItems,
    getStorageMetadata,
    bytesToMB,
    formatDate,
    ...toRefs(state.value),
  };
};
