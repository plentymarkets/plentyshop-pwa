export const useLazyProductImage = (
  options: {
    priority: Ref<boolean>;
    hoverImageUrl: Ref<string>;
  },
) => {
  const imageContainerRef = ref<HTMLElement | null>(null);
  const shouldLoadMainImage = ref(options.priority.value);
  const shouldLoadHoverImage = ref(options.priority.value && !!options.hoverImageUrl.value);
  const mainImageLoaded = ref(false);
  const hoverImageLoaded = ref(false);

  let observer: IntersectionObserver | null = null;

  const onMainImageLoad = () => {
    mainImageLoaded.value = true;
  };

  const onMainImageError = () => {
    mainImageLoaded.value = true;
  };

  const onHoverImageLoad = () => {
    hoverImageLoaded.value = true;
  };

  const onHoverImageError = () => {
    hoverImageLoaded.value = false;
  };

  const disconnectObserver = () => {
    observer?.disconnect();
    observer = null;
  };

  const enableImageLoading = () => {
    shouldLoadMainImage.value = true;

    if (options.hoverImageUrl.value) {
      shouldLoadHoverImage.value = true;
    }
  };

  onMounted(() => {
    if (options.priority.value) {
      enableImageLoading();
      return;
    }

    const target = imageContainerRef.value;

    if (!(target instanceof HTMLElement)) {
      enableImageLoading();
      return;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        enableImageLoading();
        disconnectObserver();
      },
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.01,
      },
    );

    observer.observe(target);
  });

  onBeforeUnmount(() => {
    disconnectObserver();
  });

  watch(
    () => options.hoverImageUrl.value,
    (value) => {
      if (value && (options.priority.value || shouldLoadMainImage.value)) {
        shouldLoadHoverImage.value = true;
      }
    },
  );

  return {
    imageContainerRef,
    shouldLoadMainImage,
    shouldLoadHoverImage,
    mainImageLoaded,
    hoverImageLoaded,
    onMainImageLoad,
    onMainImageError,
    onHoverImageLoad,
    onHoverImageError,
  };
};
