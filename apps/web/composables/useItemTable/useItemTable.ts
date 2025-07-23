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

  const getStorageItemsServer = async (fileTypes = 'png,jpg,jpeg,avif,webp') => {
    state.value.loading = true;

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

  return {
    getStorageItemsServer,
    getStorageItems,
    ...toRefs(state.value),
  };
};
