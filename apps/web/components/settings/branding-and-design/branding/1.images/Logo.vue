<template>
  <div class="py-2">
    <UiImagePicker
      :label="getEditorTranslation('label')"
      :image="headerLogo"
      :placeholder="placeholderImg"
      :dimensions="getEditorTranslation('description')"
      :tooltip="getEditorTranslation('tooltip')"
      :selected-image-type="'Logo'"
      :custom-label="'Change Logo'"
      @add="handleImageAdd"
      @delete="deleteLogo()"
    />

    <span class="typography-text-xs text-neutral-700">
      {{ getEditorTranslation('hint') }}
    </span>
  </div>
</template>

<script setup lang="ts">
const { placeholderImg } = usePickerHelper();

const deleteLogo = () => {
  updateSetting(placeholderImg);
};

const { updateSetting, getSetting } = useSiteSettings('headerLogo');

const headerLogo = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const { handleImageAdd } = useImageAdd(headerLogo);
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
    "tooltip": "The logo is displayed in the header of the shop. For the best performance you should choose an image in one of the following formats: .svg, .avif or .webp.",
    "description": "150×40 px (SVG) or max 180×80 px",
    "hint": "If you choose SVG, the size must be 150 x 40 px. For other formats, the maximum size is 180 px (width) by 80 px (height)."
  },
  "de": {
    "label": "Logo",
    "tooltip": "The logo is displayed in the header of the shop. For the best performance you should choose an image in one of the following formats: .svg, .avif or .webp.",
    "description": "150×40 px (SVG) or max 180×80 px",
    "hint": "If you choose SVG, the size must be 150 x 40 px. For other formats, the maximum size is 180 px (width) by 80 px (height)."
  }
}
</i18n>
