<!-- eslint-disable vue/no-mutating-props -->
<template>
  <UiAccordionItem
    v-model="imagesOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="slider-image-group"
  >
    <template #summary>
      <h2 data-testid="slider-image-group-title">Images</h2>
    </template>

    <div class="images px-3">
      <div class="mb-6 mt-4">
        <label>
          <UiFormLabel class="mb-1">Image XL (Desktop)</UiFormLabel>
          <SfInput
            v-model="banner.content.image.wideScreen"
            name="desktopImage"
            data-testid="slide-4xl-image-input"
            type="text"
            placeholder="Enter URL of image"
          />
          <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
            Recommended dimensions: 1920 x 1080 px
          </div>
        </label>
      </div>

      <div class="mb-6">
        <label>
          <UiFormLabel class="mb-1">Image L (Desktop)</UiFormLabel>
          <SfInput
            v-model="banner.content.image.desktop"
            name="desktopImage"
            data-testid="slide-desktop-image-input"
            type="text"
            placeholder="Enter URL of image"
          />
          <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
            Recommended dimensions: 1024 x 576 px
          </div>
        </label>
      </div>

      <div class="mb-6">
        <UiFormLabel class="mb-1">Image M (Tablet)</UiFormLabel>
        <SfInput
          v-model="banner.content.image.tablet"
          name="desktopImage"
          type="text"
          placeholder="Enter URL of image"
        />
        <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">Recommended dimensions: 768 x 432 px</div>
      </div>

      <div class="mb-6">
        <UiFormLabel class="mb-1">Image S (Mobile)</UiFormLabel>
        <SfInput
          v-model="banner.content.image.mobile"
          name="desktopImage"
          type="text"
          placeholder="Enter URL of image"
        />
        <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">Recommended dimensions: 320 x 320 px</div>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium mb-4">Brightness</label>
        <div class="flex items-center gap-4">
          <div class="flex-1 space-y-1">
            <div class="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>100%</span>
            </div>
            <input
              v-model.number="banner.content.image.brightness"
              type="range"
              min="0"
              max="1"
              step="0.01"
              class="w-full"
            />
          </div>

          <div class="relative">
            <input
              v-model.number="banner.content.image.brightness"
              type="number"
              min="0"
              max="1"
              class="w-20 px-2 py-1 border rounded text-color-red-500"
              @input="emitClampBrightness($event)"
            />
          </div>
        </div>
      </div>

      <div class="mb-6">
        <UiFormLabel class="mb-1">Alt</UiFormLabel>
        <SfInput v-model="banner.content.image.alt" name="alt" type="text" data-testid="slide-alt-text" />
        <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">Alternative image text</div>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { SfInput, SfAccordionItem as UiAccordionItem } from '@storefront-ui/vue';
import type { BannerProps } from './types';

defineProps<{
  banner: BannerProps;
}>();

const emit = defineEmits(['clampBrightness']);
const imagesOpen = ref(true);

const emitClampBrightness = (event: Event) => {
  const value = parseFloat((event.target as HTMLInputElement).value);
  emit('clampBrightness', value, 'image');
};
</script>
