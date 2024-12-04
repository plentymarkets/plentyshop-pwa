const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const useImageZoom = (containerReference: Ref<HTMLElement | null>) => {
  const isZoomed = ref(false);
  const currentTranslateX = ref(0);
  const currentTranslateY = ref(0);
  let lastTap = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let startTranslateX = 0;
  let startTranslateY = 0;
  const maxTranslateX = ref(0);
  const maxTranslateY = ref(0);
  const zoomScale = 2;

  const updateMaxTranslations = () => {
    const container = containerReference.value;

    if (container) {
      const containerRect = container.getBoundingClientRect();

      const scaledWidth = containerRect.width * zoomScale;
      const scaledHeight = containerRect.height * zoomScale;

      const maxTransX = (scaledWidth - containerRect.width) / 2;
      const maxTransY = (scaledHeight - containerRect.height) / 2;

      maxTranslateX.value = Math.max(0, maxTransX);
      maxTranslateY.value = Math.max(0, maxTransY);
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTap;
    const isDoubleTap = tapLength < 300 && tapLength > 0;

    if (isDoubleTap) {
      isZoomed.value = !isZoomed.value;
      currentTranslateX.value = 0;
      currentTranslateY.value = 0;
      startTranslateX = 0;
      startTranslateY = 0;
      event.preventDefault();

      if (isZoomed.value) {
        updateMaxTranslations();
      } else {
        maxTranslateX.value = 0;
        maxTranslateY.value = 0;
      }
    }

    lastTap = currentTime;

    if (isZoomed.value) {
      const touch = event.touches[0];
      touchStartX = touch.pageX - startTranslateX;
      touchStartY = touch.pageY - startTranslateY;
    }
  };

  const onTouchMove = (event: TouchEvent) => {
    if (isZoomed.value && event.touches.length === 1) {
      const touch = event.touches[0];
      const deltaX = touch.pageX - touchStartX;
      const deltaY = touch.pageY - touchStartY;

      currentTranslateX.value = clamp(deltaX, -maxTranslateX.value, maxTranslateX.value);
      currentTranslateY.value = clamp(deltaY, -maxTranslateY.value, maxTranslateY.value);

      event.preventDefault();
    }
  };

  const onTouchEnd = () => {
    if (isZoomed.value) {
      startTranslateX = currentTranslateX.value;
      startTranslateY = currentTranslateY.value;
    }
  };

  const imageStyle = computed(() => {
    return isZoomed.value
      ? {
          transform: `scale(${zoomScale}) translate(${currentTranslateX.value / zoomScale}px, ${currentTranslateY.value / zoomScale}px)`,
          transition: 'none',
          cursor: 'move',
        }
      : {};
  });

  onMounted(() => {
    updateMaxTranslations();
  });

  return {
    isZoomed,
    imageStyle,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
