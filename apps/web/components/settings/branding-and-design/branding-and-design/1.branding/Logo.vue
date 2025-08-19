<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <UiImagePicker
      v-if="runtimeConfig.public.isDev"
      :label="getEditorTranslation('label')"
      :image="headerLogo"
      :placeholder="placeholderImg"
      :dimensions="getEditorTranslation('description')"
      :show-tooltip="true"
      :selected-image-type="'Logo'"
      :custom-label="'Change Logo'"
      @add="handleImageAdd"
      @delete="deleteLogo()"
    />
    <SfInput v-else v-model="headerLogo" placeholder="Enter Logo URL" type="text" />

    <span class="typography-text-xs text-neutral-700">
      {{ getEditorTranslation('hint') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { placeholderImg } = usePickerHelper();
const runtimeConfig = useRuntimeConfig();

const deleteLogo = () => {
  updateSetting(placeholderImg);
};

const { updateSetting, getSetting } = useSiteSettings('headerLogo');

const headerLogo = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

function handleImageAdd({ image }: { image: string }) {
  updateSetting(image);
}
</script>
<style>
img[alt='Logo'] {
  background-color: #f3f4f6;
  object-fit: none;
}
</style>

<i18n lang="json">
{
  "en": {
    "label": "Logo",
    "tooltip": "The logo is displayed in the header of the onlineshop. For the best performance, you should choose an image file in one of the following formats: SVG, AVIF or WebP.",
    "description": "150×40 px (SVG) or max 180×80 px",
    "hint": "If you choose SVG, the size must be 150 × 40 px. For other formats, the maximum size is 180 px (width) by 80 px (height)."
  },
  "de": {
    "label": "Logo",
    "tooltip": "The logo is displayed in the header of the onlineshop. For the best performance, you should choose an image file in one of the following formats: SVG, AVIF or WebP.",
    "description": "150×40 px (SVG) or max 180×80 px",
    "hint": "If you choose SVG, the size must be 150 × 40 px. For other formats, the maximum size is 180 px (width) by 80 px (height)."
  }
}
</i18n>
