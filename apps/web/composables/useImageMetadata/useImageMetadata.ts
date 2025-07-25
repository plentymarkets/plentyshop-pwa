const metadata = ref<Record<string, { width: string; height: string }>>({});
const currentKey = ref<string | null>(null);

const setMetadata = (key: string, data: { width: string; height: string }) => {
  metadata.value[key] = data;
};

const getMetadata = (key: string) => {
  return metadata.value[key] || { width: '', height: '' };
};

export const useImageMetadata = () => {
  return {
    metadata,
    currentKey,
    setMetadata,
    getMetadata,
  };
};
