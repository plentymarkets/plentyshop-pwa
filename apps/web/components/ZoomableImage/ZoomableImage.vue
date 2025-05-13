<template>
  <div
    ref="containerReference"
    class="w-full h-full relative flex items-center justify-center snap-center snap-always basis-full shrink-0 grow gallery-image"
  >
    <div
      v-if="showZoomHint && isMobile"
      class="zoom-hint absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded z-20"
    >
      {{ $t('double-tap-zoom') }}
    </div>

    <Drift v-if="!isMobile && imagesLoaded[`gallery-img-${index}`]" :key="route.fullPath" :index="index">
      <NuxtImg
        v-bind="nuxtImgProps"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @load="updateImageStatusFor(`gallery-img-${index}`)"
      />
    </Drift>

    <NuxtImg
      v-else
      v-bind="nuxtImgProps"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @load="updateImageStatusFor(`gallery-img-${index}`)"
    />

    <SfLoaderCircular v-if="!imagesLoaded[`gallery-img-${index}`]" class="absolute" size="sm" />
  </div>
</template>

<script setup lang="ts">
import { productImageGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { ImagesData } from '@plentymarkets/shop-api';
import type { ZoomableImageProps } from '~/components/ZoomableImage/types';

const props = defineProps<ZoomableImageProps>();

const containerReference = useTemplateRef<null>('containerReference');
const imagesLoaded = ref([] as unknown as { [key: string]: boolean });

const { isZoomed, imageStyle, onTouchStart, onTouchMove, onTouchEnd } = useImageZoom(containerReference);
const viewport = useViewport();
const route = useRoute();

const image = props.image;
const index = props.index;
const activeIndex = props.activeIndex;
const isFirstImage = props.isFirstImage;
const isMobile = computed(() => viewport.isLessThan('lg'));

const showZoomHint = ref(false);

const imageUrl = productImageGetters.getImageUrl(image);
const imageAlt = productImageGetters.getImageAlternate(image) || productImageGetters.getCleanImageName(image) || '';
const imageTitle = productImageGetters.getImageName(image) || productImageGetters.getCleanImageName(image) || '';

const getSourceSet = (image: ImagesData) => {
  const dpr = 1;
  const secondPreview = productImageGetters.getImageUrlSecondPreview(image);
  const preview = productImageGetters.getImageUrlPreview(image);
  const middle = productImageGetters.getImageUrlMiddle(image);
  const full = productImageGetters.getImageUrl(image);

  return `
    ${secondPreview} ${370 * dpr}w,
    ${preview} ${700 * dpr}w,
    ${middle} ${720 * dpr}w,
    ${full} ${1400 * dpr}w
  `;
};

const computedWidth = computed(() => {
  const imageWidth = productImageGetters.getImageWidth(image) || 600;
  return imageUrl.includes(defaults.IMAGE_LINK_SUFIX) ? imageWidth : '';
});

const computedHeight = computed(() => {
  const imageHeight = productImageGetters.getImageHeight(image) || 600;
  return imageUrl.includes(defaults.IMAGE_LINK_SUFIX) ? imageHeight : '';
});

const nuxtImgProps = computed<Record<string, unknown>>(() => ({
  id: `gallery-img-${index}`,
  alt: imageAlt,
  title: imageTitle,
  'aria-hidden': activeIndex !== index,
  fit: 'fill',
  class: isMobile.value
    ? { 'object-contain h-full w-full': true, zoomed: isZoomed.value }
    : { 'object-contain h-full w-full': true, [`demo-trigger-${index}`]: true },
  'data-zoom': imageUrl,
  quality: 80,
  srcset: getSourceSet(image),
  sizes: '2xs:370px xs:720px sm:740px md:1400px',
  draggable: 'false',
  loading: isFirstImage ? 'eager' : 'lazy',
  fetchpriority: isFirstImage ? 'high' : 'auto',
  width: computedWidth.value,
  height: computedHeight.value,
  style: isMobile.value ? imageStyle.value : '',
}));

const updateImageStatusFor = (imageId: string) => {
  if (!imagesLoaded.value[imageId]) imagesLoaded.value[imageId] = true;
};

onMounted(() => {
  nextTick(() => {
    for (const [index] of props.images.entries()) {
      const myImg: HTMLImageElement | null = document.querySelector(`#gallery-img-${index}`);
      const imgId = String(myImg?.id);
      if (!imagesLoaded.value[imgId]) imagesLoaded.value[imgId] = Boolean(myImg?.complete);
    }
  });

  if (isMobile.value) {
    showZoomHint.value = true;
    setTimeout(() => {
      showZoomHint.value = false;
    }, 3000);
  }
});
</script>
