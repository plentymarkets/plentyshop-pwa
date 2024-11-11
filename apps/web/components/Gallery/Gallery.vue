<template>
  <div class="flex-col md:flex-row h-full flex relative scroll-smooth md:gap-4 relative" data-testid="gallery">
    <div
      class="after:block after:pt-[100%] flex-1 relative overflow-hidden w-full max-h-[600px]"
      data-testid="gallery-images"
    >
      <SfScrollable
        class="flex items-center snap-x snap-mandatory scrollbar-hidden w-full h-full"
        wrapper-class="!absolute top-0 left-0 w-full h-full"
        buttons-placement="none"
        :active-index="activeIndex"
        is-active-index-centered
        :drag="{ containerWidth: true }"
        @on-scroll="onScroll"
      >
        <div
          v-for="(image, index) in images"
          :key="`image-${index}-thumbnail`"
          class="w-full h-full relative flex items-center justify-center snap-center snap-always basis-full shrink-0 grow"
        >
          <Drift :index="index">
            <NuxtImg
              :id="`gallery-img-${index}`"
              :alt="productImageGetters.getImageAlternate(image) || productImageGetters.getCleanImageName(image) || ''"
              :title="productImageGetters.getImageName(image) || productImageGetters.getCleanImageName(image) || ''"
              :aria-hidden="activeIndex !== index"
              fit="fill"
              :class="`object-contain h-full w-full demo-trigger-${index}`"
              :data-zoom="productImageGetters.getImageUrl(image)"
              :quality="80"
              :srcset="getSourceSet(image)"
              sizes="2xs:370px xs:720px sm:740px md:1400px"
              draggable="false"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              @load="updateImageStatusFor(`gallery-img-${index}`)"
              :width="getWidth(image, productImageGetters.getImageUrl(image))"
              :height="getHeight(image, productImageGetters.getImageUrl(image))"
            />
          </Drift>
          <SfLoaderCircular v-if="!imagesLoaded[`gallery-img-${index}`]" class="absolute" size="sm" />
        </div>
      </SfScrollable>
    </div>

    <div class="md:-order-1 overflow-hidden flex-shrink-0 basis-auto">
      <SfScrollable
        ref="thumbsReference"
        wrapper-class="hidden md:inline-flex"
        direction="vertical"
        class="flex-row w-full items-center md:flex-col md:h-full md:px-0 md:scroll-pl-4 snap-y snap-mandatory flex gap-0.5 md:gap-2 overflow-auto scrollbar-hidden"
        :active-index="activeIndex"
        :prev-disabled="activeIndex === 0"
        :next-disabled="activeIndex === images.length - 1"
      >
        <template #previousButton>
          <UiButton
            variant="secondary"
            size="sm"
            square
            class="absolute !rounded-full bg-white z-10 top-4 rotate-90 disabled:!hidden !ring-neutral-500 !text-neutral-500"
            :class="{ hidden: firstVisibleThumbnailIntersected }"
            :aria-label="$t('gallery.prev')"
          >
            <template #prefix>
              <SfIconChevronLeft />
            </template>
          </UiButton>
        </template>

        <button
          v-for="({ urlPreview, cleanImageName, width, height }, index) in images"
          :key="`imagebutton-${index}-thumbnail`"
          :ref="(el) => assignReference(el, index)"
          type="button"
          :aria-current="activeIndex === index"
          :aria-label="$t('gallery.thumb', index)"
          class="w-20 h-[88px] relative shrink-0 pb-1 border-b-4 snap-start cursor-pointer transition-colors flex-grow-0"
          :class="[activeIndex === index ? 'border-primary-500' : 'border-transparent']"
          @mouseover="onChangeIndex(index)"
          @focus="onChangeIndex(index)"
        >
          <NuxtImg
            :alt="cleanImageName"
            class="object-contain"
            :width="width ?? 80"
            :height="height ?? 80"
            :src="urlPreview"
            :quality="80"
            loading="lazy"
          />
        </button>

        <template #nextButton>
          <UiButton
            variant="secondary"
            size="sm"
            square
            class="absolute !rounded-full bg-white z-10 bottom-4 rotate-90 disabled:!hidden !ring-neutral-500 !text-neutral-500"
            :class="{ hidden: lastVisibleThumbnailIntersected }"
            :aria-label="$t('gallery.next')"
          >
            <template #prefix>
              <SfIconChevronRight />
            </template>
          </UiButton>
        </template>
      </SfScrollable>
      <div class="flex md:hidden gap-0.5" role="group">
        <button
          v-for="({ url }, index) in images"
          :key="url"
          type="button"
          :aria-current="activeIndex === index"
          :aria-label="$t('gallery.thumb', index + 1)"
          class="relative shrink-0 pb-1 border-b-4 cursor-pointer transition-colors flex-grow"
          :class="[activeIndex === index ? 'border-primary-500' : 'border-neutral-200']"
          @click="onChangeIndex(index)"
        />
      </div>
    </div>
    <div v-if="isMobile" class="drift-zoom-image" />
  </div>
</template>

<script setup lang="ts">
import { clamp, type SfScrollableOnScrollData } from '@storefront-ui/shared';
import { SfScrollable, SfIconChevronLeft, SfIconChevronRight, SfLoaderCircular } from '@storefront-ui/vue';
import { unrefElement, useIntersectionObserver, useTimeoutFn } from '@vueuse/core';
import type { ImagesData } from '@plentymarkets/shop-api';
import { productImageGetters } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';

const props = defineProps<{ images: ImagesData[] }>();
const viewport = useViewport();

const { isPending, start, stop } = useTimeoutFn(() => {}, 50);

const thumbsReference = ref<HTMLElement>();
const firstThumbReference = ref<HTMLButtonElement>();
const lastThumbReference = ref<HTMLButtonElement>();
const firstVisibleThumbnailIntersected = ref(true);
const lastVisibleThumbnailIntersected = ref(true);
const activeIndex = ref(0);
const imagesLoaded = ref([] as unknown as { [key: string]: boolean });
const isMobile = computed(() => viewport.isLessThan('md'));

const getSourceSet = (image: ImagesData) => {
  const dpr = 2;
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
onMounted(() => {
  nextTick(() => {
    for (const [index] of props.images.entries()) {
      const myImg: HTMLImageElement | null = document.querySelector(`#gallery-img-${index}`);
      const imgId = String(myImg?.id);
      if (!imagesLoaded.value[imgId]) imagesLoaded.value[imgId] = Boolean(myImg?.complete);
    }
  });
});

const updateImageStatusFor = (imageId: string) => {
  if (!imagesLoaded.value[imageId]) imagesLoaded.value[imageId] = true;
};

const registerThumbsWatch = (
  singleThumbReference: Ref<HTMLButtonElement | undefined>,
  thumbnailIntersected: Ref<boolean>,
) => {
  watch(
    thumbsReference,
    (reference) => {
      if (reference) {
        useIntersectionObserver(
          singleThumbReference,
          ([{ isIntersecting }]) => {
            thumbnailIntersected.value = isIntersecting;
          },
          {
            root: unrefElement(reference),
            rootMargin: '0px',
            threshold: 1,
          },
        );
      }
    },
    { immediate: true },
  );
};

registerThumbsWatch(firstThumbReference, firstVisibleThumbnailIntersected);
registerThumbsWatch(lastThumbReference, lastVisibleThumbnailIntersected);

const getWidth = (image: ImagesData, imageUrl: string) => {
  const imageWidth = productImageGetters.getImageWidth(image) || 600;
  if (imageUrl.includes(defaults.IMAGE_LINK_SUFIX)) {
    return imageWidth;
  }
  return '';
};

const getHeight = (image: ImagesData, imageUrl: string) => {
  const imageHeight = productImageGetters.getImageHeight(image) || 600;
  if (imageUrl.includes(defaults.IMAGE_LINK_SUFIX)) {
    return imageHeight;
  }
  return '';
};

const onChangeIndex = (index: number) => {
  stop();
  activeIndex.value = clamp(index, 0, props.images.length - 1);
  start();
};

const onScroll = ({ left, scrollWidth }: SfScrollableOnScrollData) => {
  if (!isPending.value) onChangeIndex(Math.round(left / (scrollWidth / props.images.length)));
};

const assignReference = (element: Element | ComponentPublicInstance | null, index: number) => {
  if (!element) return;

  if (index === props.images.length - 1) {
    lastThumbReference.value = element as HTMLButtonElement;
    return;
  }

  if (index === 0) firstThumbReference.value = element as HTMLButtonElement;
};
</script>
