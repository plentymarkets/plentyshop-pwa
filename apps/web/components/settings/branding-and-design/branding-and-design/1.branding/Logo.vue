<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>Logo</UiFormLabel>
      <SfTooltip
        label="The logo is displayed in the header of the onlineshop. For the best performance, you should choose an image file in one of the following formats: SVG, AVIF or WebP."
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <UiImagePicker
      label="Logo"
      :image="headerLogo"
      :placeholder="placeholderImg"
      dimensions="150x40px (SVG) or max 180x80px"
      :show-tooltip="true"
      @update:image="handleImageAdd"
    />
    <span class="typography-text-xs text-neutral-700">
      If you choose SVG, the size must be 150 x 40 px. For other formats, the maximum size is 180 px (width) by 80 px
      (height).
    </span>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';

const { placeholderImg } = usePickerHelper();
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
