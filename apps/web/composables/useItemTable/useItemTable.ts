import type { UseItemTableState, UseItemTableReturn } from './types';
import type { StorageObject } from '@plentymarkets/shop-api';
import { fileToBase64 } from '../../utils/fileHelper';

export const useItemsTable: UseItemTableReturn = () => {
  const state = useState<UseItemTableState>('useItemTable', () => ({
    data: [],
    loading: false,
  }));

  const cachedImages = useState<StorageObject[]>('image-table-cache', () => []);
  const folders = useState<string[]>('image-table-folders', () => []);

  // Method for folders!
  // const uploadStorageItem = async (file: File, path = '') => {
  //   state.value.loading = true;

  //   const base64String = await fileToBase64(file);
  //   if (!base64String) {
  //     state.value.loading = false;
  //     return null;
  //   }

  //   const key = path
  //     ? `${path.replace(/\/$/, '')}/${file.name}`
  //     : file.name;

  //   try {
  //     const { error } = await useAsyncData(() =>
  //       useSdk().plentysystems.doUploadStorageItem({
  //         base64: base64String,
  //         filename: key,
  //         type: file.type,
  //       }),
  //     );

  //     if (error.value) {
  //       const { send } = useNotification();
  //       send({ type: 'negative', message: error.value.message });
  //       return;
  //     }
  //   } catch (error) {
  //     console.error('Error uploading storage item:', error);
  //   } finally {
  //     state.value.loading = false;
  //   }
  // };

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
        // Optionally refresh items here
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
  const getStorageItemsServer = async (fileTypes = 'png,jpg,jpeg,avif,webp') => {
    state.value.loading = true;

    if (cachedImages.value.length > 0) {
      state.value.data = cachedImages.value;
      // Extract folders from cached images
      const folderSet = new Set<string>();
      cachedImages.value.forEach((item) => {
        const key = item.key;
        const lastSlash = key.lastIndexOf('/');
        if (lastSlash > 0) {
          const folder = key.substring(0, lastSlash);
          folderSet.add(folder);
        }
      });
      folders.value = Array.from(folderSet);
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

    // Extract folders from fetched items
    const folderSet = new Set<string>();
    items.forEach((item) => {
      const key = item.key;
      const lastSlash = key.lastIndexOf('/');
      if (lastSlash > 0) {
        const folder = key.substring(0, lastSlash);
        folderSet.add(folder);
      }
    });
    folders.value = Array.from(folderSet);
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
    uploadStorageItem,
    getStorageItemsServer,
    getStorageMetadata,
    bytesToMB,
    formatDate,
    headers,
    folders,
    ...toRefs(state.value),
  };
};
