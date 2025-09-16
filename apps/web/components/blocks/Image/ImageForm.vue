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
        :image="uiImageTextBlock[type]"
        :placeholder="placeholderImg"
        :dimensions="imageDimensions[type]"
        :selected-image-type="type"
        @add="(payload) => handleImageAddWrapper(payload)"
        @delete="deleteImage(uiImageTextBlock, type)"
      />
    </div>
    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('alt-label') }}</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.alt" type="text" data-testid="alt-input">
          <template #suffix>
            <label for="alt" class="rounded-lg cursor-pointer">
              <input id="alt" v-model="uiImageTextBlock.alt" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <fieldset class="py-2">
      <UiFormLabel>{{ getEditorTranslation('image-align-label') }}</UiFormLabel>

      <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          for="align-left"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.imageAlignment === 'left' }"
          data-testid="image-align-left"
          @click="uiImageTextBlock.imageAlignment = 'left'"
        >
          <SfIconCheck :class="{ invisible: uiImageTextBlock.imageAlignment !== 'left' }" class="mr-1 w-[1.1rem]" />
          {{ getEditorTranslation('image-align-option-left-label') }}
        </div>

        <div
          for="align-right"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.imageAlignment === 'right' }"
          data-testid="image-align-right"
          @click="uiImageTextBlock.imageAlignment = 'right'"
        >
          <SfIconCheck :class="{ invisible: uiImageTextBlock.imageAlignment !== 'right' }" class="mr-1 w-[1.1rem]" />
          {{ getEditorTranslation('image-align-option-right-label') }}
        </div>
      </div>
    </fieldset>
  </UiAccordionItem>
  <UiAccordionItem
    v-if="runtimeConfig.public.isDev"
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
        v-model="uiImageTextBlock.textOverlay"
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
        <SfInput v-model="uiImageTextBlock.textOverlayColor" type="text" data-testid="text-overlay-color-input">
          <template #suffix>
            <label
              for="text-overlay-color"
              :style="{ backgroundColor: uiImageTextBlock.textOverlayColor }"
              class="border border-[#a0a0a0] rounded-lg cursor-pointer"
            >
              <input
                id="text-overlay-color"
                v-model="uiImageTextBlock.textOverlayColor"
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
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.textOverlayAlignY === 'top' }"
          @click="uiImageTextBlock.textOverlayAlignY = 'top'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.textOverlayAlignY !== 'top' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('text-overlay-align-x-left') }}
        </div>

        <div
          data-testid="align-x-center"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.textOverlayAlignY === 'center' }"
          @click="uiImageTextBlock.textOverlayAlignY = 'center'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.textOverlayAlignY !== 'center' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('text-overlay-align-x-center') }}
        </div>

        <div
          data-testid="align-x-right"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.textOverlayAlignY === 'bottom' }"
          @click="uiImageTextBlock.textOverlayAlignY = 'bottom'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.textOverlayAlignY !== 'bottom' }"
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
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.textOverlayAlignX === 'left' }"
          @click="uiImageTextBlock.textOverlayAlignX = 'left'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.textOverlayAlignX !== 'left' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('text-overlay-align-y-top') }}
        </div>

        <div
          data-testid="align-y-center"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.textOverlayAlignX === 'center' }"
          @click="uiImageTextBlock.textOverlayAlignX = 'center'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.textOverlayAlignX !== 'center' }"
            class="w-[1.1rem] shrink-0 mr-1"
          />
          {{ getEditorTranslation('text-overlay-align-x-center') }}
        </div>

        <div
          data-testid="align-y-bottom"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.textOverlayAlignX === 'right' }"
          @click="uiImageTextBlock.textOverlayAlignX = 'right'"
        >
          <SfIconCheck
            :class="{ invisible: uiImageTextBlock.textOverlayAlignX !== 'right' }"
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
            v-model="uiImageTextBlock.label"
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
          v-model="uiImageTextBlock.link"
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
              'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.variant === 'primary',
            }"
            data-testid="slider-button-primary"
            @click="uiImageTextBlock.variant = 'primary'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: uiImageTextBlock.variant !== 'primary' }" />
            {{ getEditorTranslation('button-variant-primary-label') }}
          </div>

          <div
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.variant === 'secondary',
            }"
            data-testid="slider-button-secondary"
            @click="uiImageTextBlock.variant = 'secondary'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: uiImageTextBlock.variant !== 'secondary' }" />
            {{ getEditorTranslation('button-variant-secondary-label') }}
          </div>
        </div>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfInput, SfIconCheck, SfTextarea } from '@storefront-ui/vue';
import type { ImageFormProps, ImageContent } from './types';

const { placeholderImg, labels, imageDimensions, imageTypes, deleteImage } = usePickerHelper();

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();
const runtimeConfig = useRuntimeConfig();

const props = defineProps<ImageFormProps>();

const uiImageTextBlock = computed(
  () => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content || {}) as ImageContent,
);

const imageGroupOpen = ref(false);
const textGroupOpen = ref(false);
const buttonOpen = ref(false);

const handleImageAddWrapper = ({ image, type }: { image: string; type: string }) => {
  const { handleImageAdd } = useImageAdd(uiImageTextBlock.value);
  handleImageAdd({ image, type });
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

    "alt-label": "Alt",

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

    "alt-label": "Alt",

    "image-align-label": "Image Alignment",
    "image-align-option-left-label": "Left",
    "image-align-option-right-label": "Right",

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
