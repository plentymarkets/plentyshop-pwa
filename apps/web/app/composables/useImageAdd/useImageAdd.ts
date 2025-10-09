export const useImageAdd = <T extends Record<string, unknown> | Ref<unknown>>(target: T, key?: string) => {
  const handleImageAdd = (payload: { image: string; type?: string }) => {
    if (isRef(target)) {
      target.value = payload.image;
      return;
    }
    const targetKey = key || payload.type;

    if (targetKey) {
      target[targetKey] = payload.image;
    }
  };
  return { handleImageAdd };
};
