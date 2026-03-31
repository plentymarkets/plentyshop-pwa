export const useNearViewport = (
  target: Ref<HTMLElement | null>,
  options?: {
    rootMargin?: string;
    once?: boolean;
  },
) => {
  const isNearViewport = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (!target.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const visible = entry.isIntersecting || entry.intersectionRatio > 0;

        if (visible) {
          isNearViewport.value = true;

          if (options?.once) {
            observer?.disconnect();
            observer = null;
          }
        } else if (!options?.once) {
          isNearViewport.value = false;
        }
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
