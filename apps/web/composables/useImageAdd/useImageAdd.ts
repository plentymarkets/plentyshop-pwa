export const useImageAdd = <T extends Record<string, unknown> | Ref<unknown>>(target: T, key?: string) => {
  const isRefTarget = !!(target as Ref<unknown>).value;

  const image = computed({
    get: () => {
      if (isRefTarget) return (target as Ref<unknown>).value;
      if (key) return (target as Record<string, unknown>)[key];
      return undefined;
    },
    set: (val: string) => {
      if (isRefTarget) (target as Ref<unknown>).value = val;
      else if (key) (target as Record<string, unknown>)[key] = val;
    },
  });

  const handleImageAdd = (payload: { image: string; type?: string }) => {
    switch (true) {
      case isRefTarget:
        (target as Ref<unknown>).value = payload.image;
        break;
      case !!key:
        (target as Record<string, unknown>)[key as string] = payload.image;
        break;
      case !!payload.type:
        (target as Record<string, unknown>)[payload.type as string] = payload.image;
        break;
      default:
        break;
    }
  };

  return { image, handleImageAdd };
};
