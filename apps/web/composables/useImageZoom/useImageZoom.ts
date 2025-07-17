const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const getDistance = (touch1: Touch, touch2: Touch): number => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
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

  let initialPinchDistance = 0;
  let isPanningEnabled = false;
  const shouldTransition = ref(false);

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

    if (event.touches.length === 1) {
      if (isDoubleTap) {
        isZoomed.value = !isZoomed.value;
        shouldTransition.value = true;
        event.preventDefault();

        if (isZoomed.value) {
          updateMaxTranslations();

          const touch = event.touches[0];
          const container = containerReference.value;
          if (!container) return;
          const containerRect = container.getBoundingClientRect();

          const tapX = touch.clientX - containerRect.left;
          const tapY = touch.clientY - containerRect.top;

          currentTranslateX.value = (containerRect.width / 2 - tapX) * (zoomScale - 1);
          currentTranslateY.value = (containerRect.height / 2 - tapY) * (zoomScale - 1);

          startTranslateX = currentTranslateX.value;
          startTranslateY = currentTranslateY.value;
        } else {
          currentTranslateX.value = 0;
          currentTranslateY.value = 0;
          startTranslateX = 0;
          startTranslateY = 0;
        }

        setTimeout(() => {
          shouldTransition.value = false;
        }, 300);
      }

      lastTap = currentTime;

      if (isZoomed.value) {
        isPanningEnabled = true;
        const touch = event.touches[0];
        touchStartX = touch.pageX - startTranslateX;
        touchStartY = touch.pageY - startTranslateY;
      }
    } else if (event.touches.length === 2) {
      event.preventDefault();

      isPanningEnabled = false;

      const touch1 = event.touches[0];
      const touch2 = event.touches[1];

      initialPinchDistance = getDistance(touch1, touch2);
    }
  };

  const onTouchMove = (event: TouchEvent) => {
    if (isZoomed.value && event.touches.length === 1 && isPanningEnabled) {
      const touch = event.touches[0];
      const deltaX = touch.pageX - touchStartX;
      const deltaY = touch.pageY - touchStartY;

      currentTranslateX.value = clamp(deltaX, -maxTranslateX.value, maxTranslateX.value);
      currentTranslateY.value = clamp(deltaY, -maxTranslateY.value, maxTranslateY.value);

      event.preventDefault();
    } else if (event.touches.length === 2) {
      event.preventDefault();

      const touch1 = event.touches[0];
      const touch2 = event.touches[1];

      const currentPinchDistance = getDistance(touch1, touch2);

      const distanceChange = currentPinchDistance - initialPinchDistance;

      const threshold = 10;

      if (Math.abs(distanceChange) > threshold) {
        const container = containerReference.value;
        if (!container) return;
        const containerRect = container.getBoundingClientRect();

        const pinchCenterX = (touch1.clientX + touch2.clientX) / 2 - containerRect.left;
        const pinchCenterY = (touch1.clientY + touch2.clientY) / 2 - containerRect.top;

        if (distanceChange > 0 && !isZoomed.value) {
          isZoomed.value = true;
          shouldTransition.value = true;
          updateMaxTranslations();

          currentTranslateX.value = (containerRect.width / 2 - pinchCenterX) * (zoomScale - 1);
          currentTranslateY.value = (containerRect.height / 2 - pinchCenterY) * (zoomScale - 1);

          startTranslateX = currentTranslateX.value;
          startTranslateY = currentTranslateY.value;

          setTimeout(() => {
            shouldTransition.value = false;
          }, 300);
        } else if (distanceChange < 0 && isZoomed.value) {
          isZoomed.value = false;
          shouldTransition.value = true;

          currentTranslateX.value = 0;
          currentTranslateY.value = 0;
          startTranslateX = 0;
          startTranslateY = 0;

          setTimeout(() => {
            shouldTransition.value = false;
          }, 300);
        }
      }
    }
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length === 0) {
      isPanningEnabled = false;
    }
    if (isZoomed.value) {
      startTranslateX = currentTranslateX.value;
      startTranslateY = currentTranslateY.value;
    }
  };

  const imageStyle = computed(() => {
    return {
      transform: isZoomed.value
        ? `scale(${zoomScale}) translate(${currentTranslateX.value / zoomScale}px, ${currentTranslateY.value / zoomScale}px)`
        : '',
      transition: shouldTransition.value ? 'transform 0.3s ease' : 'none',
      cursor: isZoomed.value ? 'move' : 'auto',
    };
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
