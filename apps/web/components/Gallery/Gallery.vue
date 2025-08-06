<template>
  <div class="flex-col md:flex-row h-full flex scroll-smooth md:gap-4 relative" data-testid="gallery">
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
        <ZoomableImage
          v-for="(image, index) in images"
          :key="`image-${index}-thumbnail`"
          :images="images"
          :image="image"
          :index="index"
          :active-index="activeIndex"
          :is-first-image="index === 0"
        />
      </SfScrollable>
    </div>

    <div class="md:-order-1 overflow-hidden flex-shrink-0 basis-auto">
      <SfScrollable
        ref="thumbsReference"
        wrapper-class="hidden md:inline-flex"
        direction="vertical"
        class="flex-row w-full items-center md:flex-col md:h-full md:px-0 md:scroll-pl-4 snap-y snap-mandatory flex gap-0.5 md:gap-0.5 overflow-auto scrollbar-hidden"
        :active-index="activeIndex"
        :prev-disabled="activeIndex === 0"
        :next-disabled="activeIndex === images.length - 1"
      >
        <template #previousButton="defaultProps">
          <UiButton
            v-bind="defaultProps"
            variant="secondary"
            size="sm"
            square
            class="absolute !rounded-full bg-white z-10 top-4 rotate-90 disabled:!hidden !ring-neutral-500 !text-neutral-500"
            :class="{ hidden: firstVisibleThumbnailIntersected }"
            :aria-label="t('gallery.prev')"
          >
            <template #prefix>
              <SfIconChevronLeft />
            </template>
          </UiButton>
        </template>

        <button
          v-for="(image, index) in images"
          :key="`imagebutton-${index}-thumbnail`"
          :ref="(el: Element | ComponentPublicInstance | null) => assignReference(el, index)"
          type="button"
          :aria-current="activeIndex === index"
          :aria-label="t('gallery.thumb', {index: index + 1})"
          class="w-20 relative shrink-0 pb-1 snap-start cursor-pointer transition-colors flex-grow-0"
          @click="onChangeIndex(index)"
          @focus="onChangeIndex(index)"
        >
          <NuxtImg
            :alt="productImageGetters.getImageAlternate(image) || productImageGetters.getCleanImageName(image) || ''"
            :title="productImageGetters.getImageName(image) ? productImageGetters.getImageName(image) : null"
            class="object-contain"
            :width="productImageGetters.getImageWidth(image) ?? 80"
            :height="productImageGetters.getImageHeight(image) ?? 80"
            :src="productImageGetters.getImageUrlPreview(image)"
            :quality="80"
            loading="lazy"
          />
        </button>

        <template #nextButton="defaultProps">
          <UiButton
            v-bind="defaultProps"
            variant="secondary"
            size="sm"
            square
            class="absolute !rounded-full bg-white z-10 bottom-4 rotate-90 disabled:!hidden !ring-neutral-500 !text-neutral-500"
            :class="{ hidden: lastVisibleThumbnailIntersected }"
            :aria-label="t('gallery.next')"
          >
            <template #prefix>
              <SfIconChevronRight />
            </template>
          </UiButton>
        </template>
      </SfScrollable>
      <div class="flex md:hidden gap-0.5" role="group">
        <button
          v-for="(image, index) in images"
          :key="productImageGetters.getImageUrl(image)"
          type="button"
          :aria-current="activeIndex === index"
          :aria-label="t('gallery.thumb', {index: index + 1})"
          class="relative shrink-0 pb-1 border-b-4 cursor-pointer transition-colors flex-grow"
          :class="[activeIndex === index ? 'border-primary-500' : 'border-neutral-200']"
          @click="onChangeIndex(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfScrollable, SfIconChevronLeft, SfIconChevronRight } from '@storefront-ui/vue';
import { productImageGetters } from '@plentymarkets/shop-api';
import { clamp, type SfScrollableOnScrollData } from '@storefront-ui/shared';
import { useTimeoutFn, useIntersectionObserver, unrefElement } from '@vueuse/core';
import type { ImagesData } from '@plentymarkets/shop-api';

const props = defineProps<{ images: ImagesData[] }>();

const { t } = useI18n();
const { isPending, start, stop } = useTimeoutFn(() => {}, 50);

const thumbsReference = ref<HTMLElement>();
const firstThumbReference = ref<HTMLButtonElement>();
const lastThumbReference = ref<HTMLButtonElement>();
const firstVisibleThumbnailIntersected = ref(true);
const lastVisibleThumbnailIntersected = ref(true);
const activeIndex = ref(0);

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
