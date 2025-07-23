export const useImageMetadata = () => {
  // Shared state for image metadata
  const metadata = ref<Record<string, { width: string; height: string }>>({});
  const width = ref<string>('');
  const height = ref<string>('');

  const setMetadata = (key: string, data: { width: string; height: string }) => {
    metadata.value[key] = data;
    width.value = data.width;
    height.value = data.height;
  };

  const getMetadata = (key: string) => {
    return metadata.value[key] || { width: '', height: '' };
  };

  return {
    metadata,
    width,
    height,
    getMetadata,
    setMetadata,
  };
};
