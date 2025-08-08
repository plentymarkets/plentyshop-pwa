<template>
  <div class="py-2">
    <div v-if="!runtimeConfig.public.isDev" class="flex justify-between mb-2">
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
    <label>
      <UiImagePicker
        v-if="runtimeConfig.public.isDev"
        label="Logo"
        :image="headerLogo"
        :placeholder="placeholderImg"
        dimensions="150x40px (SVG) or max 180x80px"
        :show-tooltip="true"
        @select="onImageSelect('Logo')"
        @delete="deleteLogo()"
      />

      <span v-if="!runtimeConfig.public.isDev" class="typography-text-xs text-neutral-700"
        >If you choose SVG, the size must be 150 x 40 px. For other formats, the maximum size is 180 px (width) by 80 px
        (height).</span
      >
    </label>

    <UiImageSelectorModal
      :open="isUploaderOpen"
      :custom-label="customLabel"
      :image-type="''"
      :current-image="activeImage"
      @close="closeUploader"
      @add="handleImageAdd"
    />
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';

const { placeholderImg, isUploaderOpen, openUploader, closeUploader, customLabel } = usePickerHelper();
const runtimeConfig = useRuntimeConfig();

const onImageSelect = (setting: 'Logo' | 'Favicon') => {
  openUploader(undefined, setting);
};

const deleteLogo = () => {
  updateSetting(placeholderImg);
};

const handleImageAdd = ({ image }: { image: string; name: string }) => {
  updateSetting(image);
};

const { updateSetting, getSetting } = useSiteSettings('headerLogo');

const headerLogo = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const activeImage = computed(() => headerLogo.value);
</script>
