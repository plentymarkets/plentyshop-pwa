<template>
  <div :class="['h-full flex scroll-smooth relative', galleryDirClass, galleryGapClass]" data-testid="gallery">
    <div
      ref="mainBox"
      class="after:block after:pt-[100%] flex-1 relative overflow-hidden w-full max-h-[600px]"
      data-testid="gallery-images"
    >
      <Swiper
        :modules="mainModules"
        :slides-per-view="1"
        :loop="false"
        :keyboard="{ enabled: true }"
        :thumbs="{ swiper: thumbsSwiper || null }"
        class="!absolute top-0 left-0 w-full h-full"
        @swiper="onMainInit"
        @slide-change="onMainSlideChange"
      >
        <SwiperSlide v-for="(image, index) in images" :key="`main-${index}`" class="flex items-center justify-center">
          <ZoomableImage
            :images="images"
            :image="image"
            :index="index"
            :active-index="activeIndex"
            :is-first-image="index === 0"
            :disable-zoom="configuration.thumbnails.enableHoverZoom === false"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <div
      v-show="configuration.thumbnails.showThumbnails"
      :class="['md:relative', thumbContainerClass, isSide ? 'md:self-stretch' : 'md:w-full']"
    >
      <div class="hidden md:block md:relative md:h-full md:overflow-hidden">
        <Swiper
          :modules="thumbsModules"
          :direction="thumbsDirection"
          :slides-per-view="thumbsSlidesPerView"
          :space-between="4"
          :free-mode="true"
          :watch-slides-progress="true"
          :centered-slides="false"
          :class="thumbsSwiperClass"
          :style="isSide ? { height: `${thumbsHeight}px` } : {}"
          @swiper="onThumbsInit"
        >
          <SwiperSlide
            v-for="(image, index) in images"
            :key="`thumb-${index}`"
            :class="thumbSlideClass(index)"
            @click="slideTo(index)"
          >
            <NuxtImg
              :alt="productImageGetters.getImageAlternate(image) || productImageGetters.getCleanImageName(image) || ''"
              :title="productImageGetters.getImageName(image) ? productImageGetters.getImageName(image) : null"
              class="rounded h-full w-full"
              :class="activeIndex === index ? 'border-primary-500' : ''"
              :width="productImageGetters.getImageWidth(image) ?? 80"
              :height="productImageGetters.getImageHeight(image) ?? 80"
              :src="productImageGetters.getImageUrlPreview(image)"
              :quality="80"
              loading="lazy"
            />
          </SwiperSlide>
        </Swiper>

        <button
          v-if="showNav && mainSwiper"
          :disabled="atStart"
          :class="prevThumbBtnClass"
          aria-label="Previous"
          @click="mainSwiper?.slidePrev()"
        >
          <SfIconChevronLeft />
        </button>
        <button
          v-if="showNav && mainSwiper"
          :disabled="atEnd"
          :class="nextThumbBtnClass"
          aria-label="Next"
          @click="mainSwiper?.slideNext()"
        >
          <SfIconChevronRight />
        </button>
      </div>

      <div class="flex md:hidden gap-0.5" role="group">
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
import { ref, computed, onMounted, onBeforeUnmount, toRefs } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Thumbs, FreeMode, Keyboard, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { SfIconChevronLeft, SfIconChevronRight } from '@storefront-ui/vue';
import { productImageGetters } from '@plentymarkets/shop-api';
import type { GalleryProps } from '~/components/Gallery/types';
import type { ImageGalleryContent } from '~/components/blocks/ImageGallery/types';

const props = withDefaults(defineProps<GalleryProps>(), {
  configuration: () => ({
    thumbnails: {
      showThumbnails: true,
      thumbnailType: 'left-vertical',
      enableHoverZoom: false,
    },
  }),
});

const configuration = computed(() => props.configuration as ImageGalleryContent);
const { images } = toRefs(props);

const mainBox = ref<HTMLElement | null>(null);
const thumbsHeight = ref(0);

const activeIndex = ref(0);
const mainSwiperRef = ref<SwiperType | null>(null);
const thumbsSwiperRef = ref<SwiperType | null>(null);

const mainSwiper = computed(() => mainSwiperRef.value);
const thumbsSwiper = computed(() => thumbsSwiperRef.value as SwiperType | null);

const viewport = useViewport();
const showNav = computed(() => !viewport.isLessThan('md'));

const type = computed(() => configuration.value.thumbnails.thumbnailType);
const isSide = computed(() => type.value === 'left-vertical' || type.value === 'right-vertical');
const isLeft = computed(() => type.value === 'left-vertical');

const galleryDirClass = computed(() => (isSide.value ? 'flex-col md:flex-row' : 'flex-col md:flex-col'));
const galleryGapClass = computed(() => (isSide.value ? 'md:gap-4' : 'md:gap-2'));
const thumbContainerClass = computed(() => [isLeft.value ? 'md:order-first' : 'md:order-last']);

const mainModules = [Thumbs, Keyboard, A11y];
const thumbsModules = [FreeMode, Thumbs];

const thumbsDirection = computed(() => (isSide.value ? 'vertical' : 'horizontal'));
const thumbsSlidesPerView = computed(() => (isSide.value ? 'auto' : Math.min(images.value.length, 6)));
const thumbsSwiperClass = computed(() =>
  isSide.value ? 'hidden md:block md:h-full md:w-[5.5rem]' : 'hidden md:block md:w-full md:min-h-[5.5rem]',
);

const thumbSlideClass = (index: number) =>
  isSide.value
    ? [
        '!w-[5rem] !h-[5rem] flex items-center justify-center cursor-pointer snap-start',
        activeIndex.value === index ? 'opacity-100' : 'opacity-80 hover:opacity-100',
      ]
    : [
        '!w-[5rem] !h-[5rem] inline-flex items-center justify-center cursor-pointer snap-start',
        activeIndex.value === index ? 'opacity-100' : 'opacity-80 hover:opacity-100',
      ];

const onMainInit = (swiper: SwiperType) => {
  mainSwiperRef.value = swiper;
  activeIndex.value = swiper.realIndex ?? 0;
};

const onThumbsInit = (swiper: SwiperType) => {
  thumbsSwiperRef.value = swiper;
};

const onMainSlideChange = (swiper: SwiperType) => {
  activeIndex.value = swiper.realIndex ?? 0;
};

const slideTo = (index: number) => {
  activeIndex.value = index;
  if (mainSwiper.value?.params.loop) mainSwiper.value.slideToLoop(index);
  else mainSwiper.value?.slideTo(index);
};

const atStart = computed(() => activeIndex.value === 0);
const atEnd = computed(() => activeIndex.value === images.value.length - 1);

const prevThumbBtnClass = computed(() =>
  [
    'hidden md:flex items-center justify-center absolute z-30 rounded-full p-2 bg-white ring-1 ring-neutral-300 disabled:opacity-40',
    isSide.value ? 'left-1/2 -translate-x-1/2 top-2 rotate-90' : 'left-2 top-1/2 -translate-y-1/2',
  ].join(' '),
);

const nextThumbBtnClass = computed(() =>
  [
    'hidden md:flex items-center justify-center absolute z-30 rounded-full p-2 bg-white ring-1 ring-neutral-300 disabled:opacity-40',
    isSide.value ? 'left-1/2 -translate-x-1/2 bottom-2 rotate-90' : 'right-2 top-1/2 -translate-y-1/2',
  ].join(' '),
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
</script>

<style src="swiper/css"></style>
