<template>
  <div :class="['h-full flex scroll-smooth relative', galleryDirClass, galleryGapClass]" data-testid="gallery">
    <div
      ref="mainBox"
      class="after:block after:pt-[100%] flex-1 relative overflow-hidden w-full max-h-[600px]"
      data-testid="gallery-images"
    >
      <div
        ref="mainEmblaRef"
        class="absolute inset-0 overflow-hidden"
        tabindex="0"
        role="group"
        @keydown.left="scrollPrev"
        @keydown.right="scrollNext"
      >
        <div class="flex h-full touch-pan-y">
          <div
            v-for="(image, index) in images"
            :key="`main-${index}`"
            class="flex min-w-0 shrink-0 grow-0 basis-full items-center justify-center"
          >
            <ZoomableImage
              :images="images"
              :image="image"
              :index="index"
              :active-index="activeIndex"
              :is-first-image="index === 0"
              :disable-zoom="shouldEnableEditorFeatures || configuration.thumbnails.enableHoverZoom === false"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="configuration.thumbnails.showThumbnails"
      :class="['@md:relative', thumbContainerClass, isSide ? '@md:self-stretch' : '@md:w-full']"
    >
      <div class="hidden @md:block @md:relative @md:h-full @md:overflow-hidden">
        <div
          ref="thumbsContainerRef"
          :class="thumbsContainerClass"
          :style="isSide ? { height: `${thumbsHeight}px` } : {}"
        >
          <button
            v-for="(image, index) in images"
            :key="`thumb-${index}`"
            type="button"
            :data-gallery-thumbnail="index"
            :class="thumbSlideClass(index)"
            @click="slideTo(index)"
          >
            <NuxtImg
              :alt="productImageGetters.getImageAlternate(image) || productImageGetters.getCleanImageName(image) || ''"
              :title="productImageGetters.getImageName(image) ? productImageGetters.getImageName(image) : null"
              class="rounded h-full w-full object-contain"
              :class="activeIndex === index ? 'border-primary-500' : ''"
              :width="productImageGetters.getImageWidth(image) ?? 80"
              :height="productImageGetters.getImageHeight(image) ?? 80"
              :src="productImageGetters.getImageUrlPreview(image)"
              :quality="80"
              loading="lazy"
            />
          </button>
        </div>

        <template v-if="hasMoreImages">
          <button
            v-if="showNav"
            :disabled="atStart"
            :class="prevThumbBtnClass"
            aria-label="Previous"
            @click="scrollPrev"
          >
            <SfIconChevronLeft />
          </button>
          <button v-if="showNav" :disabled="atEnd" :class="nextThumbBtnClass" aria-label="Next" @click="scrollNext">
            <SfIconChevronRight />
          </button>
        </template>
      </div>

      <div v-if="hasMoreImages" class="flex @md:hidden gap-0.5" v-bind="carouselProps">
        <button
          v-for="(image, index) in images"
          :key="productImageGetters.getImageUrl(image)"
          type="button"
          :aria-current="activeIndex === index"
          class="relative shrink-0 pb-1 border-b-4 cursor-pointer transition-colors flex-grow"
          :class="[activeIndex === index ? 'border-primary-500' : 'border-neutral-200']"
          @click="slideTo(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue';
import { SfIconChevronLeft, SfIconChevronRight } from '@storefront-ui/vue';
import { productImageGetters } from '@plentymarkets/shop-api';
import type { GalleryProps } from '~/components/Gallery/types';

const props = withDefaults(defineProps<GalleryProps>(), {
  configuration: () => ({
    thumbnails: {
      showThumbnails: true,
      thumbnailType: 'left-vertical',
      enableHoverZoom: true,
    },
    layout: {
      fullWidth: false,
    },
  }),
});

const { shouldEnableEditorFeatures } = useEditorState();

const configuration = computed(() => props.configuration);
const { images } = toRefs(props);
const activeIndex = ref(0);

const viewport = useViewport();
const showNav = computed(() => !viewport.isLessThan('md'));

const type = computed(() => configuration.value.thumbnails.thumbnailType);
const isSide = computed(() => type.value === 'left-vertical' || type.value === 'right-vertical');
const isLeft = computed(() => type.value === 'left-vertical');

const galleryDirClass = computed(() => (isSide.value ? 'flex-col md:flex-row' : 'flex-col md:flex-col'));
const galleryGapClass = computed(() => (isSide.value ? '@md:gap-4' : '@md:gap-2'));
const thumbContainerClass = computed(() => [isLeft.value ? '@md:order-first' : '@md:order-last']);
const hasMoreImages = computed(() => images.value.length > 1);

const thumbsContainerClass = computed(() =>
  isSide.value
    ? 'hidden @md:flex @md:h-full @md:w-24 @md:flex-col @md:gap-1 @md:overflow-y-auto'
    : 'hidden @md:flex @md:w-full @md:min-h-24 @md:gap-1 @md:overflow-x-auto',
);

const thumbSlideClass = (index: number) =>
  isSide.value
    ? [
        'size-20 shrink-0 flex items-center justify-center cursor-pointer snap-start',
        activeIndex.value === index ? 'opacity-100' : 'opacity-80 hover:opacity-100',
      ]
    : [
        'size-20 shrink-0 inline-flex items-center justify-center cursor-pointer snap-start',
        activeIndex.value === index ? 'opacity-100' : 'opacity-80 hover:opacity-100',
      ];

const prevThumbBtnClass = computed(() =>
  [
    'hidden md:flex items-center justify-center absolute z-raised rounded-full p-2 bg-white ring-1 ring-neutral-300 disabled:opacity-40',
    isSide.value ? 'left-1/2 -translate-x-1/2 top-2 rotate-90' : 'left-2 top-1/2 -translate-y-1/2',
  ].join(' '),
);

const nextThumbBtnClass = computed(() =>
  [
    'hidden md:flex items-center justify-center absolute z-raised rounded-full p-2 bg-white ring-1 ring-neutral-300 disabled:opacity-40',
    isSide.value ? 'left-1/2 -translate-x-1/2 bottom-2 rotate-90' : 'right-2 top-1/2 -translate-y-1/2',
  ].join(' '),
);

const mainBox = ref<HTMLElement | null>(null);
const thumbsHeight = ref(0);
const thumbsContainerRef = ref<HTMLElement | null>(null);
const [mainEmblaRef, mainEmblaApi] = emblaCarouselVue({ loop: false, align: 'start' });

const syncSelectedImage = () => {
  const api = mainEmblaApi.value;
  if (!api) {
    return;
  }

  const nextIndex = api.selectedScrollSnap();
  if (nextIndex === activeIndex.value) {
    return;
  }

  activeIndex.value = nextIndex;
  const activeThumbnail = thumbsContainerRef.value?.querySelector<HTMLElement>(
    `[data-gallery-thumbnail="${activeIndex.value}"]`,
  );
  activeThumbnail?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
};

const slideTo = (index: number) => {
  mainEmblaApi.value?.scrollTo(index);
};
const scrollPrev = () => mainEmblaApi.value?.scrollPrev();
const scrollNext = () => mainEmblaApi.value?.scrollNext();

const atStart = computed(() => activeIndex.value === 0);
const atEnd = computed(() => activeIndex.value === images.value.length - 1);

const carouselProps = computed(() => {
  return hasMoreImages.value ? { role: 'group' } : {};
});

watch(
  mainEmblaApi,
  (api, previousApi) => {
    previousApi?.off('select', syncSelectedImage);
    previousApi?.off('reInit', syncSelectedImage);
    if (!api) {
      return;
    }

    api.on('select', syncSelectedImage);
    api.on('reInit', syncSelectedImage);
    syncSelectedImage();
  },
  { immediate: true },
);

watch(
  () => images.value.map((image) => productImageGetters.getImageUrl(image)),
  async () => {
    await nextTick();
    mainEmblaApi.value?.reInit();
  },
);

onMounted(() => {
  if (!mainBox.value) return;
  const ro = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const h = Math.floor(entry.contentRect.height);
    if (h && h !== thumbsHeight.value) thumbsHeight.value = h;
  });
  ro.observe(mainBox.value);
  onBeforeUnmount(() => ro.disconnect());
});

onBeforeUnmount(() => {
  const api = mainEmblaApi.value;
  if (api) {
    api.off('select', syncSelectedImage);
    api.off('reInit', syncSelectedImage);
  }
});
</script>
