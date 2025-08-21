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
</template>

<script setup lang="ts">
import { SfInput, SfIconCheck } from '@storefront-ui/vue';
import type { ImageFormProps, ImageContent } from './types';

const { placeholderImg, labels, imageDimensions, imageTypes, deleteImage } = usePickerHelper();

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const props = defineProps<ImageFormProps>();

const uiImageTextBlock = computed(
  () => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content || {}) as ImageContent,
);

const imageGroupOpen = ref(false);

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
    "image-align-option-right-label": "Right"
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
    "image-align-option-right-label": "Right"
  }
}
</i18n>
