import type { UseLazyProductImageOptions } from '~/composables/useLazyProductImage/types';

export const useLazyProductImage = (options: UseLazyProductImageOptions) => {
  const imageContainerRef = ref<HTMLElement | null>(null);
  const shouldLoadMainImage = ref(options.priority.value);
  const shouldLoadHoverImage = ref(options.priority.value && !!options.hoverImageUrl.value);

  const mainImageRef = ref<unknown>(null);
  const hoverImageRef = ref<unknown>(null);

  const mainImageLoaded = ref(false);
  const hoverImageLoaded = ref(false);

  let observer: IntersectionObserver | null = null;

  const getNativeImg = (value: unknown): HTMLImageElement | null => {
    if (value instanceof HTMLImageElement) {
      return value;
    }

    if (value instanceof HTMLElement) {
      return value.querySelector('img');
    }

    if (value && typeof value === 'object' && '$el' in value) {
      const el = (value as { $el?: unknown }).$el;

      if (el instanceof HTMLImageElement) {
        return el;
      }

      if (el instanceof HTMLElement) {
        return el.querySelector('img');
      }
    }

    return null;
  };
  const syncLoadedState = async (targetRef: Ref<unknown>, loadedRef: Ref<boolean>) => {
    await nextTick();

    const img = getNativeImg(targetRef.value);
    if (img?.complete && img.naturalWidth > 0) {
      loadedRef.value = true;
    }
  };

  const syncMainImageLoadedState = () => syncLoadedState(mainImageRef, mainImageLoaded);
  const syncHoverImageLoadedState = () => syncLoadedState(hoverImageRef, hoverImageLoaded);

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

  const enableAndSyncImages = async () => {
    enableImageLoading();
    await syncMainImageLoadedState();
    await syncHoverImageLoadedState();
  };

  onMounted(async () => {
    if (options.priority.value) {
      await enableAndSyncImages();
      return;
    }

    if (typeof globalThis.IntersectionObserver === 'undefined') {
      await enableAndSyncImages();
      return;
    }

    const target = imageContainerRef.value;

    if (!(target instanceof HTMLElement)) {
      await enableAndSyncImages();
      return;
    }

    observer = new globalThis.IntersectionObserver(
      async ([entry]) => {
        if (!entry?.isIntersecting) return;

        disconnectObserver();
        await enableAndSyncImages();
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
    () => shouldLoadMainImage.value,
    async (value) => {
      if (value) {
        await syncMainImageLoadedState();
      }
    },
  );

  watch(
    () => shouldLoadHoverImage.value,
    async (value) => {
      if (value) {
        await syncHoverImageLoadedState();
      }
    },
  );

  watch(
    () => options.hoverImageUrl.value,
    async (value) => {
      if (value && (options.priority.value || shouldLoadMainImage.value)) {
        shouldLoadHoverImage.value = true;
        await syncHoverImageLoadedState();
      }
    },
  );

  return {
    imageContainerRef,
    mainImageRef,
    hoverImageRef,
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
