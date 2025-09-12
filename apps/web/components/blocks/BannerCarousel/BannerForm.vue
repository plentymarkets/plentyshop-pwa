<template>
  <div class="block-slider-edit">
    <div :data-testid="`slide-settings-${activeSlide}`">
      <UiAccordionItem
        v-model="imagesOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
        data-testid="slider-image-group"
      >
        <template #summary>
          <h2 data-testid="slider-image-group-title">{{ getEditorTranslation('images-group-label') }}</h2>
        </template>

        <div class="images">
          <UiImagePicker
            v-for="type in imageTypes"
            :key="type"
            :label="labels[type]"
            :image="banner.content.image[type]"
            :placeholder="placeholderImg"
            :dimensions="imageDimensions[type]"
            :selected-image-type="type"
            @add="(payload) => handleImageAddBanner(payload)"
            @delete="deleteImage(banner.content.image, type)"
          />
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="textOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
        data-testid="banner-text-group"
      >
        <template #summary>
          <h2 data-testid="slider-text-group-title">{{ getEditorTranslation('text-group-label') }}</h2>
        </template>

        <div>
          <!-- TO DO: FIND A WAY TO MAKE THE COMPONENT WORK WITH MULTIPLE SLIDES-->
          <!-- <EditorBlocksTextFieldsGroup
            :model="banner.content.text"
            :pretitle-label="getEditorTranslation('pretitle-label')"
            :pretitle-placeholder="getEditorTranslation('pretitle-placeholder')"
            pretitle-testid="banner-input-pre-title"
            :title-label="getEditorTranslation('main-title-label')"
            :title-placeholder="getEditorTranslation('main-title-placeholder')"
            title-testid="banner-input-title"
            :subtitle-label="getEditorTranslation('subtitle-label')"
            :subtitle-placeholder="getEditorTranslation('subtitle-placeholder')"
            subtitle-testid="banner-input-sub-title"
            :description-label="getEditorTranslation('description-label')"
            :description-placeholder="getEditorTranslation('description-placeholder')"
            description-testid="banner-text-content"
          /> -->

          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('pretitle-label') }}</UiFormLabel>
            <SfInput
              v-model="banner.content.text.pretitle"
              name="preTitle"
              type="text"
              :placeholder="getEditorTranslation('pretitle-placeholder')"
              data-testid="banner-input-pre-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('main-title-label') }}</UiFormLabel>
            <SfInput
              v-model="banner.content.text.title"
              name="mainTitle"
              type="text"
              :placeholder="getEditorTranslation('main-title-placeholder')"
              data-testid="banner-input-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('subtitle-label') }}</UiFormLabel>
            <SfInput
              v-model="banner.content.text.subtitle"
              name="subtitle"
              type="text"
              :placeholder="getEditorTranslation('subtitle-placeholder')"
              data-testid="banner-input-sub-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('description-label') }}</UiFormLabel>
            <SfTextarea
              v-model="banner.content.text.htmlDescription"
              name="description"
              data-testid="banner-text-content"
              type="text"
              class="w-full min-h-[232px]"
              :placeholder="getEditorTranslation('description-placeholder')"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('text-color-label') }}</UiFormLabel>

            <SfInput v-model="banner.content.text.color" type="text">
              <template #suffix>
                <label
                  for="text-color"
                  :style="{ backgroundColor: banner.content.text.color }"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer"
                >
                  <input id="text-color" v-model="banner.content.text.color" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-background-label') }}</UiFormLabel>
            <SfSwitch
              v-model="banner.content.text.background"
              class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
            />
          </div>
          <div v-if="banner.content.text.background" class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-color-label') }}</UiFormLabel>

            <SfInput v-model="banner.content.text.bgcolor" type="text">
              <template #suffix>
                <label
                  for="text-bg-color"
                  :style="{ backgroundColor: banner.content.text.bgcolor }"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer"
                >
                  <input id="text-bg-color" v-model="banner.content.text.bgcolor" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </div>
          <div v-if="banner.content.text.background" class="mb-6">
            <label class="block text-sm font-medium mb-4">{{ getEditorTranslation('textbox-opacity-label') }}</label>
            <div class="flex items-center gap-4">
              <div class="flex-1 space-y-1">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <input
                  v-model.number="banner.content.text.bgopacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  class="w-full"
                />
              </div>

              <div class="relative">
                <input
                  v-model.number="banner.content.text.bgopacity"
                  type="number"
                  min="0"
                  max="1"
                  class="w-20 px-2 py-1 border rounded text-color-red-500"
                  @input="clampBrightness($event, 'text')"
                />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-align-x-label') }}</UiFormLabel>

            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="align-top"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.justify === 'top',
                }"
                data-testid="slider-textbox-align-top"
                @click="banner.content.text.justify = 'top'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.justify !== 'top' }" />
                {{ getEditorTranslation('textbox-align-x-top-label') }}
              </div>

              <div
                for="align-center"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.justify === 'center',
                }"
                data-testid="slider-textbox-align-center"
                @click="banner.content.text.justify = 'center'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.justify !== 'center' }" />
                {{ getEditorTranslation('textbox-align-x-center-label') }}
              </div>

              <div
                for="align-bottom"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.justify === 'bottom',
                }"
                data-testid="slider-textbox-align-bottom"
                @click="banner.content.text.justify = 'bottom'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.justify !== 'bottom' }" />
                {{ getEditorTranslation('textbox-align-x-bottom-label') }}
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-align-y-label') }}</UiFormLabel>

            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="textbox-align-left"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.align === 'left',
                }"
                data-testid="slider-textbox-y-align-left"
                @click="banner.content.text.align = 'left'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.align !== 'left' }" />
                {{ getEditorTranslation('textbox-align-y-left-label') }}
              </div>

              <div
                for="textbox-align-center"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.align === 'center',
                }"
                data-testid="slider-textbox-y-align-center"
                @click="banner.content.text.align = 'center'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.align !== 'center' }" />
                {{ getEditorTranslation('textbox-align-y-center-label') }}
              </div>

              <div
                for="textbox-align-right"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.align === 'right',
                }"
                data-testid="slider-textbox-y-align-right"
                @click="banner.content.text.align = 'right'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.align !== 'right' }" />
                {{ getEditorTranslation('textbox-align-y-right-label') }}
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('text-align-label') }}</UiFormLabel>
            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="text-align-left"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.textAlignment === 'left',
                }"
                data-testid="slider-text-align-left"
                @click="banner.content.text.textAlignment = 'left'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.text.textAlignment !== 'left' }"
                />
                {{ getEditorTranslation('text-align-option-left-label') }}
              </div>

              <div
                for="text-align-center"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.textAlignment === 'center',
                }"
                data-testid="slider-text-align-center"
                @click="banner.content.text.textAlignment = 'center'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.text.textAlignment !== 'center' }"
                />
                {{ getEditorTranslation('text-align-option-center-label') }}
              </div>

              <div
                for="text-align-right"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.textAlignment === 'right',
                }"
                data-testid="slider-text-align-right"
                @click="banner.content.text.textAlignment = 'right'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.text.textAlignment !== 'right' }"
                />
                {{ getEditorTranslation('text-align-option-right-label') }}
              </div>
            </div>
          </div>
        </div>
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
                v-model="banner.content.button.label"
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
              v-model="banner.content.button.link"
              name="link"
              data-testid="slider-button-link"
              type="text"
              :placeholder="getEditorTranslation('button-link-placeholder')"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('button-variant-label') }}</UiFormLabel>
            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.button.variant === 'primary',
                }"
                data-testid="slider-button-primary"
                @click="banner.content.button.variant = 'primary'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.button.variant !== 'primary' }"
                />
                {{ getEditorTranslation('button-variant-primary-label') }}
              </div>

              <div
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.button.variant === 'secondary',
                }"
                data-testid="slider-button-secondary"
                @click="banner.content.button.variant = 'secondary'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.button.variant !== 'secondary' }"
                />
                {{ getEditorTranslation('button-variant-secondary-label') }}
              </div>
            </div>
          </div>
        </div>
      </UiAccordionItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clamp } from '@storefront-ui/shared';
import { SfTextarea, SfInput, SfIconCheck, SfSwitch } from '@storefront-ui/vue';
import type { BannerFormProps, BannerProps } from './types';

const { blockUuid } = useSiteConfiguration();
const { activeSlideIndex } = useCarousel();
const { data } = useCategoryTemplate();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { placeholderImg, labels, imageDimensions, imageTypes, deleteImage } = usePickerHelper();

const props = defineProps<BannerFormProps>();

const activeSlide = computed(() => activeSlideIndex.value[props.uuid || blockUuid.value]);
const banner = computed(
  () => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value) || {}) as BannerProps,
);

const imagesOpen = ref(true);
const textOpen = ref(true);
const buttonOpen = ref(true);

const clampBrightness = (event: Event, type: string) => {
  const currentValue = (event.target as HTMLInputElement)?.value;
  const nextValue = Number.parseFloat(currentValue);

  if (type === 'image') {
    banner.value.content.image.brightness = clamp(nextValue, 0, 1);
  }
  if (type === 'text') {
    banner.value.content.text.bgopacity = clamp(nextValue, 0, 1);
  }
};

const handleImageAddBanner = ({ image, type }: { image: string; type: string }) => {
  const { handleImageAdd } = useImageAdd(banner.value?.content?.image);
  handleImageAdd({ image, type });
};
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>

<i18n lang="json">
{
  "en": {
    "images-group-label": "Images",

    "image-xl-label": "Image XL (Desktop)",
    "image-l-label": "Image L (Desktop)",
    "image-m-label": "Image M (Tablet)",
    "image-s-label": "Image S (Mobile)",
    "image-url-placeholder": "Enter URL of image",
    "image-xl-hint": "Recommended dimensions: 1920 × 1080 px",
    "image-l-hint": "Recommended dimensions: 1024 × 576 px",
    "image-m-hint": "Recommended dimensions: 768 × 432 px",
    "image-s-hint": "Recommended dimensions: 320 × 320 px",

    "brightness-label": "Brightness",
    "alt-label": "Alt",
    "alt-hint": "Alternative image text",

    "text-group-label": "Text",
    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",
    "main-title-label": "Main title",
    "main-title-placeholder": "Title",
    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "SubTitle",
    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",
    "text-color-label": "Text Colour",
    "textbox-background-label": "Textbox Background",
    "textbox-color-label": "Textbox Colour",
    "textbox-opacity-label": "Textbox Opacity",

    "textbox-align-x-label": "Textbox Alignment (x)",
    "textbox-align-x-top-label": "Top",
    "textbox-align-x-center-label": "Center",
    "textbox-align-x-bottom-label": "Bottom",

    "textbox-align-y-label": "Textbox Alignment (y)",
    "textbox-align-y-left-label": "Left",
    "textbox-align-y-center-label": "Center",
    "textbox-align-y-right-label": "Right",

    "text-align-label": "Text Alignment (y)",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

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
    "image-l-label": "Image L (Desktop)",
    "image-m-label": "Image M (Tablet)",
    "image-s-label": "Image S (Mobile)",
    "image-url-placeholder": "Enter URL of image",
    "image-xl-hint": "Recommended dimensions: 1920 × 1080 px",
    "image-l-hint": "Recommended dimensions: 1024 × 576 px",
    "image-m-hint": "Recommended dimensions: 768 × 432 px",
    "image-s-hint": "Recommended dimensions: 320 × 320 px",

    "brightness-label": "Brightness",
    "alt-label": "Alt",
    "alt-hint": "Alternative image text",

    "text-group-label": "Text",
    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",
    "main-title-label": "Main title",
    "main-title-placeholder": "Title",
    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "SubTitle",
    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",
    "text-color-label": "Text Colour",
    "textbox-background-label": "Textbox Background",
    "textbox-color-label": "Textbox Colour",
    "textbox-opacity-label": "Textbox Opacity",

    "textbox-align-x-label": "Textbox Alignment (x)",
    "textbox-align-x-top-label": "Top",
    "textbox-align-x-center-label": "Center",
    "textbox-align-x-bottom-label": "Bottom",

    "textbox-align-y-label": "Textbox Alignment (y)",
    "textbox-align-y-left-label": "Left",
    "textbox-align-y-center-label": "Center",
    "textbox-align-y-right-label": "Right",

    "text-align-label": "Text Alignment (y)",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

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
