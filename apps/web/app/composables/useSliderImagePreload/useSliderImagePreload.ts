import type { UseSliderImagePreloadOptions } from '~/composables/useSliderImagePreload/types';

export const useSliderImagePreload = (options: UseSliderImagePreloadOptions) => {
  const sliderRootRef = ref<HTMLElement | null>(null);
  const scrollContainerRef = ref<HTMLElement | null>(null);
  const activatedIndexes = ref<Set<number>>(new Set());

  const ITEM_WIDTH = options.itemWidth;
  const ITEM_GAP = options.itemGap;
  const PRELOAD_BUFFER = options.preloadBuffer ?? 2;

  const shouldLoadImage = (index: number) => {
    return activatedIndexes.value.has(index);
  };

  const updateActivatedWindow = () => {
    const el = scrollContainerRef.value;
    if (!el) return;

    const itemFullWidth = ITEM_WIDTH + ITEM_GAP;
    const firstVisibleIndex = Math.floor(el.scrollLeft / itemFullWidth);
    const visibleCount = Math.max(1, Math.ceil(el.clientWidth / itemFullWidth));

    const start = Math.max(0, firstVisibleIndex - PRELOAD_BUFFER);
    const end = firstVisibleIndex + visibleCount + PRELOAD_BUFFER;

    for (let i = start; i <= end; i++) {
      activatedIndexes.value.add(i);
    }
  };

  const resolveScrollContainer = () => {
    if (!sliderRootRef.value) return null;

    return (sliderRootRef.value.querySelector('[data-testid="product-slider"] [class*="overflow-x-auto"]') ||
      sliderRootRef.value.querySelector('[data-testid="product-slider"] .sf-scrollable__wrapper') ||
      sliderRootRef.value.querySelector('[data-testid="product-slider"]')) as HTMLElement | null;
  };

  onMounted(async () => {
    await nextTick();

    scrollContainerRef.value = resolveScrollContainer();
    if (!scrollContainerRef.value) return;

    updateActivatedWindow();

    scrollContainerRef.value.addEventListener('scroll', updateActivatedWindow, { passive: true });
    window.addEventListener('resize', updateActivatedWindow, { passive: true });
  });

  onBeforeUnmount(() => {
    scrollContainerRef.value?.removeEventListener('scroll', updateActivatedWindow);
    window.removeEventListener('resize', updateActivatedWindow);
  });

  return {
    sliderRootRef,
    shouldLoadImage,
    activatedIndexes,
    updateActivatedWindow,
  };
};
