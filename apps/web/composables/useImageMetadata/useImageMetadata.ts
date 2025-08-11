import type { MetadataRecord, SetMetadata, GetMetadata, UseImageMetadata } from './types';

const metadata = ref<MetadataRecord>({});
const currentKey = ref<string | null>(null);

const setMetadata: SetMetadata = (key, data) => {
  metadata.value[key] = data;
};

const getMetadata: GetMetadata = (key) => {
  return metadata.value[key] || { width: '', height: '' };
};

export const useImageMetadata = (): UseImageMetadata => ({
  metadata,
  currentKey,
  setMetadata,
  getMetadata,
});
