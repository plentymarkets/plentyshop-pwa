<template>
  <UiAccordionItem
    v-model="imageGroupOpen"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="image-group"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('images-group-label') }}</h2>
    </template>

    <div class="images">
      <UiImagePicker
        v-for="type in imageTypes"
        :key="type"
        :label="labels[type]"
        :image="uiImageTextBlock.image[type]"
        :placeholder="placeholderImg"
        :dimensions="imageDimensions[type]"
        :selected-image-type="type"
        @add="(payload: { image: string; type: string }) => handleImageAddWrapper(payload)"
        @delete="deleteImage(uiImageTextBlock.image, type)"
      />
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('alt-label') }}</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.image.alt" type="text" data-testid="alt-input">
          <template #suffix>
            <label for="alt" class="rounded-lg cursor-pointer">
              <input id="alt" v-model="uiImageTextBlock.image.alt" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <div class="py-2">
      <label class="block text-sm font-medium mb-4">Brightness</label>
      <div class="flex items-center gap-4">
        <div class="flex-1 space-y-1">
          <div class="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>100%</span>
          </div>
          <input
            v-model.number="uiImageTextBlock.image.brightness"
            type="range"
            min="0"
            max="1"
            step="0.01"
            class="w-full"
          />
        </div>

        <div class="relative">
          <input
            v-model.number="uiImageTextBlock.image.brightness"
            type="number"
            min="0"
            max="1"
            class="w-20 px-2 py-1 border rounded text-color-red-500"
            @input="clampBrightness($event, 'image')"
          />
        </div>
      </div>
    </div>

    <fieldset class="py-2">
      <div class="flex items-center gap-2">
        <legend class="text-sm font-medium text-black m-0">
          {{ getEditorTranslation('image-scalling-label') }}
        </legend>
        <SfTooltip :label="fillTooltip" placement="top">
          <SfIconInfo :size="'sm'" />
        </SfTooltip>
      </div>
      <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden mt-2">
        <div
          data-testid="align-y-center"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.image.fillMode === 'fill' }"
          @click="uiImageTextBlock.image.fillMode = 'fill'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.image.fillMode !== 'fill' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('image-scalling-fill-label') }}
        </div>

        <div
          data-testid="align-y-top"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.image.fillMode === 'fit' }"
          @click="uiImageTextBlock.image.fillMode = 'fit'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.image.fillMode !== 'fit' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('image-scalling-fit-label') }}
        </div>
      </div>
    </fieldset>

    <fieldset class="py-2">
      <UiFormLabel>{{ getEditorTranslation('image-align-label') }}</UiFormLabel>

      <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          for="align-left"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.image.imageAlignment === 'left' }"
          data-testid="image-align-left"
          @click="uiImageTextBlock.image.imageAlignment = 'left'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.image.imageAlignment !== 'left' }"
            class="mr-1 w-[1.1rem]"
          />
          {{ getEditorTranslation('image-align-option-left-label') }}
        </div>

        <div
          for="align-right"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.image.imageAlignment === 'right' }"
          data-testid="image-align-right"
          @click="uiImageTextBlock.image.imageAlignment = 'right'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.image.imageAlignment !== 'right' }"
            class="mr-1 w-[1.1rem]"
          />
          {{ getEditorTranslation('image-align-option-right-label') }}
        </div>
      </div>
    </fieldset>
  </UiAccordionItem>
  <UiAccordionItem
    v-model="textGroupOpen"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="text-group"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('text-overlay-label') }}</h2>
    </template>

    <div class="py-2">
      <UiFormLabel>{{ getEditorTranslation('text-overlay-label') }}</UiFormLabel>
      <SfTextarea
        id="text-overlay"
        v-model="uiImageTextBlock.text.textOverlay"
        data-testid="text-overlay"
        name="text-overlay"
        rows="3"
        class="min-h-[232px] mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
        :placeholder="getEditorTranslation('text-overlay-placeholder')"
      />
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('text-overlay-color-label') }}</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.text.textOverlayColor" type="text" data-testid="text-overlay-color-input">
          <template #suffix>
            <label
              for="text-overlay-color"
              :style="{ backgroundColor: uiImageTextBlock.text.textOverlayColor }"
              class="border border-[#a0a0a0] rounded-lg cursor-pointer"
            >
              <input
                id="text-overlay-color"
                v-model="uiImageTextBlock.text.textOverlayColor"
                data-testid="text-overlay-color-picker"
                type="color"
                class="invisible w-8"
              />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <fieldset class="py-2">
      <legend class="text-sm font-medium text-black">
        {{ getEditorTranslation('text-overlay-align-x-label') }}
      </legend>

      <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden mt-2">
        <div
          data-testid="align-x-left"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.text.textOverlayAlignY === 'top' }"
          @click="uiImageTextBlock.text.textOverlayAlignY = 'top'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.text.textOverlayAlignY !== 'top' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('text-overlay-align-x-left') }}
        </div>

        <div
          data-testid="align-x-center"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.text.textOverlayAlignY === 'center' }"
          @click="uiImageTextBlock.text.textOverlayAlignY = 'center'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.text.textOverlayAlignY !== 'center' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('text-overlay-align-x-center') }}
        </div>

        <div
          data-testid="align-x-right"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.text.textOverlayAlignY === 'bottom' }"
          @click="uiImageTextBlock.text.textOverlayAlignY = 'bottom'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.text.textOverlayAlignY !== 'bottom' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('text-overlay-align-x-right') }}
        </div>
      </div>
    </fieldset>

    <fieldset class="py-2">
      <legend class="text-sm font-medium text-black">
        {{ getEditorTranslation('text-overlay-align-y-label') }}
      </legend>

      <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden mt-2">
        <div
          data-testid="align-y-top"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.text.textOverlayAlignX === 'left' }"
          @click="uiImageTextBlock.text.textOverlayAlignX = 'left'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.text.textOverlayAlignX !== 'left' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('text-overlay-align-y-top') }}
        </div>

        <div
          data-testid="align-y-center"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.text.textOverlayAlignX === 'center' }"
          @click="uiImageTextBlock.text.textOverlayAlignX = 'center'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.text.textOverlayAlignX !== 'center' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('text-overlay-align-x-center') }}
        </div>

        <div
          data-testid="align-y-bottom"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.text.textOverlayAlignX === 'right' }"
          @click="uiImageTextBlock.text.textOverlayAlignX = 'right'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.text.textOverlayAlignX !== 'right' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('text-overlay-align-y-bottom') }}
        </div>
      </div>
    </fieldset>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="buttonOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2 data-testid="slider-button-group-title">{{ getEditorTranslation('button-group-label') }}</h2>
    </template>

    <div class="images">
      <div class="mb-6 mt-4">
        <label>
          <UiFormLabel class="mb-1">{{ getEditorTranslation('button-text-label') }}</UiFormLabel>
          <SfInput
            v-model="uiImageTextBlock.button.label"
            data-testid="slider-button-label"
            name="label"
            type="text"
            :placeholder="getEditorTranslation('button-text-placeholder')"
          />
        </label>
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('button-link-label') }}</UiFormLabel>
        <SfInput
          v-model="uiImageTextBlock.button.link"
          name="link"
          data-testid="slider-button-link"
          type="text"
          :placeholder="getEditorTranslation('button-link-placeholder')"
        />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('button-variant-label') }}</UiFormLabel>
        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.button.variant === 'primary',
            }"
            data-testid="slider-button-primary"
            @click="uiImageTextBlock.button.variant = 'primary'"
          >
            <SfIconCheck
              class="mr-1 w-[1.1rem]"
              :class="{ invisible: uiImageTextBlock.button.variant !== 'primary' }"
            />
            {{ getEditorTranslation('button-variant-primary-label') }}
          </div>

          <div
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.button.variant === 'secondary',
            }"
            data-testid="slider-button-secondary"
            @click="uiImageTextBlock.button.variant = 'secondary'"
          >
            <SfIconCheck
              class="mr-1 w-[1.1rem]"
              :class="{ invisible: uiImageTextBlock.button.variant !== 'secondary' }"
            />
            {{ getEditorTranslation('button-variant-secondary-label') }}
          </div>
        </div>
      </div>
    </div>
  </UiAccordionItem>
  <UiAccordionItem
    v-model="layoutOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2 data-testid="slider-button-group-title">{{ getEditorTranslation('layout-label') }}</h2>
    </template>

    <div class="py-2 flex items-center justify-between gap-3">
      <UiFormLabel for="keep-transparent" class="m-0">
        {{ getEditorTranslation('keep-transparent-label') }}
      </UiFormLabel>

      <SfSwitch
        id="keep-transparent"
        v-model="isTransparent"
        data-testid="switch-keep-transparent"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>

    <div v-if="!isTransparent" class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('background-color-label') }}</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="backgroundColor" type="text" data-testid="input-background-color">
          <template #suffix>
            <label
              for="background-color"
              :style="{ backgroundColor: backgroundColor }"
              class="border border-[#a0a0a0] rounded-lg cursor-pointer"
            >
              <input
                id="background-color"
                v-model="backgroundColor"
                data-testid="color-input-background"
                type="color"
                class="invisible w-8"
              />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <div id="padding-form" class="py-2">
      <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
      <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowUpward /></span>
          <input
            v-model.number="uiImageTextBlock.layout.paddingTop"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-top"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowDownward /></span>
          <input
            v-model.number="uiImageTextBlock.layout.paddingBottom"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-bottom"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowBack /></span>
          <input
            v-model.number="uiImageTextBlock.layout.paddingLeft"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-left"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
          <span><SfIconArrowForward /></span>
          <input
            v-model.number="uiImageTextBlock.layout.paddingRight"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-right"
          />
        </div>
      </div>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('linktarget-label') }}</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.image.linktarget" type="text" data-testid="linktarget-input">
          <template #suffix>
            <label for="linktarget" class="rounded-lg cursor-pointer">
              <input id="linktarget" v-model="uiImageTextBlock.image.linktarget" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import {
  SfInput,
  SfIconCheck,
  SfTextarea,
  SfIconArrowBack,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowForward,
  SfSwitch,
  SfTooltip,
  SfIconInfo,
} from '@storefront-ui/vue';

import type { ImageFormProps } from './types';
import { migrateImageContent } from '~/utils/migrate-image-content';
import { clamp } from '@storefront-ui/shared';

const { placeholderImg, labels, imageDimensions, imageTypes, deleteImage } = usePickerHelper();
const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();


const props = defineProps<ImageFormProps>();

const DEFAULT_LAYOUT = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
};

const uiImageTextBlock = computed(() => {
  const rawContent = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content || {};
  const migrated = migrateImageContent(rawContent);

  if (!migrated.layout) {
    migrated.layout = { ...DEFAULT_LAYOUT };
  } else {
    (Object.keys(DEFAULT_LAYOUT) as Array<keyof typeof DEFAULT_LAYOUT>).forEach((key) => {
      if (typeof migrated.layout[key] !== 'number') {
        migrated.layout[key] = DEFAULT_LAYOUT[key];
      }
    });
  }
  return migrated;
});

const backgroundColorInit = uiImageTextBlock.value.layout.backgroundColor;
const isTransparent = ref(!backgroundColorInit || backgroundColorInit === 'transparent');
const backgroundColor = ref(isTransparent.value ? '' : backgroundColorInit);

watch([isTransparent, backgroundColor], () => {
  uiImageTextBlock.value.layout.backgroundColor = isTransparent.value ? 'transparent' : backgroundColor.value;
});

const imageGroupOpen = ref(false);
const textGroupOpen = ref(false);
const buttonOpen = ref(false);
const layoutOpen = ref(false);

const fillTooltip =
  'Fit: The image maintains its original aspect ratio and fits inside the available space, allowing padding. Fill: The image completely fills the available space, potentially cropping parts of the image, and ignores padding.';

type ImageTypeKey = 'wideScreen' | 'desktop' | 'tablet' | 'mobile';

const handleImageAddWrapper = ({ image, type }: { image: string; type: string }) => {
  if (uiImageTextBlock.value.image && ['wideScreen', 'desktop', 'tablet', 'mobile'].includes(type)) {
    uiImageTextBlock.value.image[type as ImageTypeKey] = image;
  }
};

const clampBrightness = (event: Event, type: string) => {
  const currentValue = (event.target as HTMLInputElement)?.value;
  const nextValue = Number.parseFloat(currentValue);
  if (type === 'image') {
    uiImageTextBlock.value.image.brightness = clamp(nextValue, 0, 1);
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "images-group-label": "Images",

    "image-xl-label": "Image XL (Desktop)",
    "image-xl-hint": "Recommended dimensions: 1920 × 1080 px",

    "image-l-label": "Image L (Desktop)",
    "image-l-hint": "Recommended dimensions: 1024 × 576 px",

    "image-m-label": "Image M (Laptop)",
    "image-m-hint": "Recommended dimensions: 768 × 432 px",

    "image-s-label": "Image S (Mobile)",
    "image-s-hint": "Recommended dimensions: 320 × 320 px",

    "image-scalling-label": "Image Scaling",
    "image-scalling-fit-label": "Fit",
    "image-scalling-fill-label": "Fill",

    "layout-label": "Layout",

    "alt-label": "Alt",
    "linktarget-label": "Link-Target",
    "padding-label": "Padding",
    "image-align-label": "Image Alignment",
    "image-align-option-left-label": "Left",
    "image-align-option-right-label": "Right",

    "text-overlay-label": "Overlay text",
    "text-overlay-placeholder": "Text that supports HTML formatting",
    "text-overlay-color-label": "Text Color",

    "text-overlay-align-x-label": "Horizontal Alignment (x)",
    "text-overlay-align-x-left": "Left",
    "text-overlay-align-x-center": "Center",
    "text-overlay-align-x-right": "Right",
    "background-color-label": "Background Color",

    "keep-transparent-label": "Keep background transparent",

    "text-overlay-align-y-label": "Vertical Alignment (y)",
    "text-overlay-align-y-top": "Top",
    "text-overlay-align-y-center": "Center",
    "text-overlay-align-y-bottom": "Bottom",
    "button-group-label": "Button",
    "button-text-label": "Label",
    "button-text-placeholder": "Button",
    "button-link-label": "Link Target",
    "button-link-placeholder": "Enter URL here",
    "button-variant-label": "Variant",
    "button-variant-primary-label": "Primary",
    "button-variant-secondary-label": "Secondary"
  },
  "de": {
    "images-group-label": "Images",

    "image-xl-label": "Image XL (Desktop)",
    "image-xl-hint": "Recommended dimensions: 1920 × 1080 px",

    "image-l-label": "Image L (Desktop)",
    "image-l-hint": "Recommended dimensions: 1024 × 576 px",

    "image-m-label": "Image M (Laptop)",
    "image-m-hint": "Recommended dimensions: 768 × 432 px",

    "image-s-label": "Image S (Mobile)",
    "image-s-hint": "Recommended dimensions: 320 × 320 px",

    "image-scaling-label": "Image Scaling",
    "image-scalling-fit-label": "Fit",
    "image-scalling-fill-label": "Fill",
    "background-color-label": "Background Color",

    "layout-label": "Layout",

    "alt-label": "Alt",
    "linktarget-label": "Link-Target",
    "padding-label": "Padding",
    "image-align-label": "Image Alignment",
    "image-align-option-left-label": "Left",
    "image-align-option-right-label": "Right",
    "keep-transparent-label": "Keep background transparent",

    "text-overlay-label": "Overlay text",
    "text-overlay-placeholder": "Enter text (HTML allowed)",
    "text-overlay-color-label": "Text Color",
    "text-overlay-align-x-label": "Horizontal Alignment (x)",
    "text-overlay-align-x-left": "Left",
    "text-overlay-align-x-center": "Center",
    "text-overlay-align-x-right": "Right",

    "text-overlay-align-y-label": "Vertical Alignment (y)",
    "text-overlay-align-y-top": "Top",
    "text-overlay-align-y-center": "Center",
    "button-group-label": "Button",
    "button-text-label": "Label",
    "button-text-placeholder": "Button",
    "button-link-label": "Link Target",
    "button-link-placeholder": "Enter URL here",
    "button-variant-label": "Variant",
    "button-variant-primary-label": "Primary",
    "button-variant-secondary-label": "Secondary"
  }
}
</i18n>
