<template>
  <NuxtErrorBoundary>
    <div
      :id="`carousel-${meta.uuid}`"
      class="relative w-full max-h-[85vh]"
      v-bind="carouselProps"
      :aria-roledescription="t('homepage.banner.ariaRoleDescriptionCarousel')"
      :aria-label="t('homepage.banner.ariaRoleDescriptionCarousel')"
      @keydown.left="scrollPrev"
      @keydown.right="scrollNext"
    >
      <div ref="emblaRef" class="overflow-hidden">
        <div class="flex touch-pan-y">
          <div
            v-for="(block, slideIndex) in visibleContent"
            :key="block.meta.uuid"
            class="min-w-0 shrink-0 grow-0 basis-full"
            :aria-labelledby="visibleContent.length > 1 ? `carousel_item-${slideIndex}_heading` : undefined"
            :aria-label="
              visibleContent.length > 1
                ? t('homepage.banner.ariaLabelSlidePosition', {
                    current: slideIndex + 1,
                    total: visibleContent.length,
                  })
                : undefined
            "
            v-bind="carouselProps"
            :aria-roledescription="t('homepage.banner.ariaRoleDescriptionSlide')"
          >
            <slot
              name="content"
              :content-block="block"
              :index="getSlideAdjustedIndex(slideIndex)"
              :slide-index="slideIndex"
              :lazy-loading="slideIndex > 0 ? 'lazy' : 'eager'"
            />
          </div>
        </div>
      </div>

      <template v-if="hasMultipleSlides && configuration.controls.displayArrows !== false && showArrows">
        <button
          type="button"
          class="absolute left-2 top-1/2 z-raised flex size-11 -translate-y-1/2 items-center justify-center text-white drop-shadow"
          :aria-controls="`carousel-${meta.uuid}`"
          :aria-label="t('homepage.banner.ariaLabelPreviousSlide')"
          :style="{ color: configuration.controls.color }"
          @click="scrollPrev"
        >
          <SfIconChevronLeft />
        </button>
        <button
          type="button"
          class="absolute right-2 top-1/2 z-raised flex size-11 -translate-y-1/2 items-center justify-center text-white drop-shadow"
          :aria-controls="`carousel-${meta.uuid}`"
          :aria-label="t('homepage.banner.ariaLabelNextSlide')"
          :style="{ color: configuration.controls.color }"
          @click="scrollNext"
        >
          <SfIconChevronRight />
        </button>
      </template>

      <div
        v-if="hasMultipleSlides && configuration.controls.color && configuration.controls.displayIndicators !== false"
        class="absolute inset-x-0 bottom-2 z-raised flex justify-center gap-2"
      >
        <button
          v-for="(_, slideIndex) in visibleContent"
          :key="`dot-${slideIndex}`"
          type="button"
          class="size-2 rounded-full"
          :class="slideIndex === selectedIndex ? 'opacity-100' : 'opacity-20'"
          :style="{ backgroundColor: configuration.controls.color }"
          :aria-label="
            t('homepage.banner.ariaLabelSlidePosition', {
              current: slideIndex + 1,
              total: visibleContent.length,
            })
          "
          @click="scrollTo(slideIndex)"
        />
      </div>
    </div>
  </NuxtErrorBoundary>
</template>

<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue';
import { SfIconChevronLeft, SfIconChevronRight } from '@storefront-ui/vue';
import type { CarouselStructureProps, SlideBlock } from './types';

const { activeSlideIndex, setIndex } = useCarousel();
const { content, index, configuration, meta } = defineProps<CarouselStructureProps>();
const viewport = useViewport();
const showArrows = computed(() => !viewport.isLessThan('md'));

const visibleContent = computed(() => {
  return (content as SlideBlock[]).filter((slide) => slide.configuration?.visible !== false);
});
const hasMultipleSlides = computed(() => visibleContent.value.length > 1);
const emblaOptions = computed(() => ({ loop: hasMultipleSlides.value, align: 'start' as const }));
const [emblaRef, emblaApi] = emblaCarouselVue(emblaOptions);
const selectedIndex = ref(0);

const getActualIndex = (visibleIndex: number): number => {
  const contentArray = content as SlideBlock[];
  let visibleCount = 0;
  for (let i = 0; i < contentArray.length; i++) {
    const slide = contentArray[i];
    if (slide && slide.configuration?.visible !== false) {
      if (visibleCount === visibleIndex) {
        return i;
      }
      visibleCount++;
    }
  }
  return visibleIndex;
};

const getVisibleIndex = (actualIndex: number): number => {
  const contentArray = content as SlideBlock[];
  let visibleIndex = 0;
  for (let i = 0; i < actualIndex && i < contentArray.length; i++) {
    const slide = contentArray[i];
    if (slide && slide.configuration?.visible !== false) {
      visibleIndex++;
    }
  }
  return visibleIndex;
};

const carouselProps = computed(() => {
  return content.length > 1 ? { role: 'group' } : {};
});

const syncSelectedSlide = () => {
  const api = emblaApi.value;
  if (!api) {
    return;
  }

  const visibleIndex = api.selectedScrollSnap();
  selectedIndex.value = visibleIndex;
  const actualIndex = getActualIndex(visibleIndex);
  if (actualIndex !== activeSlideIndex.value[meta.uuid]) {
    setIndex(meta.uuid, actualIndex);
  }
};

const scrollPrev = () => emblaApi.value?.scrollPrev();
const scrollNext = () => emblaApi.value?.scrollNext();
const scrollTo = (slideIndex: number) => emblaApi.value?.scrollTo(slideIndex);

watch(
  emblaApi,
  (api, previousApi) => {
    previousApi?.off('select', syncSelectedSlide);
    previousApi?.off('reInit', syncSelectedSlide);
    if (!api) {
      return;
    }

    api.on('select', syncSelectedSlide);
    api.on('reInit', syncSelectedSlide);
    syncSelectedSlide();
  },
  { immediate: true },
);

watch(
  () => visibleContent.value.map((slide) => slide.meta.uuid),
  async () => {
    await nextTick();
    emblaApi.value?.reInit();
  },
);

onBeforeUnmount(() => {
  const api = emblaApi.value;
  if (api) {
    api.off('select', syncSelectedSlide);
    api.off('reInit', syncSelectedSlide);
  }
});

const getSlideAdjustedIndex = (slideIndex: number) => {
  return activeSlideIndex.value[meta.uuid] === slideIndex ? index : index + slideIndex;
};

watch(
  () => activeSlideIndex.value[meta.uuid],
  (newIndex) => {
    const visibleIndex = getVisibleIndex(newIndex ?? 0);
    if (selectedIndex.value !== visibleIndex) {
      scrollTo(visibleIndex);
    }
  },
  { flush: 'post' },
);
</script>
