export const useNearViewport = (
  target: Ref<HTMLElement | null>,
  options?: {
    rootMargin?: string;
    once?: boolean;
  },
) => {
  const isNearViewport = ref(false);
  let observer: IntersectionObserver | null = null;

  const handleVisibilityChange = (visible: boolean) => {
    if (!visible && options?.once) return;

    isNearViewport.value = visible;

    if (visible && options?.once) {
      observer?.disconnect();
      observer = null;
    }
  };

  onMounted(() => {
    if (!('IntersectionObserver' in globalThis)) {
      isNearViewport.value = true;
      return;
    }

    if (!target.value) return;

    observer = new globalThis.IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const visible = entry.isIntersecting || entry.intersectionRatio > 0;
        handleVisibilityChange(visible);
      },
      {
        root: null,
        rootMargin: options?.rootMargin ?? '200px 0px 200px 0px',
        threshold: 0,
      },
    );

    observer.observe(target.value);
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });

  return {
    isNearViewport,
  };
};
