<template>
  <div class="py-2">
    <div v-if="!runtimeConfig.public.isDev" class="flex justify-between mb-2">
      <UiFormLabel>Favicon</UiFormLabel>
      <SfTooltip
        label="A favicon helps customers recognize your site in browser tabs and bookmarks. Required file format: .ico"
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
        label="Favicon"
        :image="favicon"
        :placeholder="placeholderImg"
        dimensions="32x32px or 48x48px (.ico)"
        :show-tooltip="true"
        @select="onImageSelect('Favicon')"
        @delete="deleteFavicon()"
      />

      <span v-if="!runtimeConfig.public.isDev" class="typography-text-xs text-neutral-700"
        >Recommended dimensions: A square of 32 × 32 px or 48 × 48 px
      </span>
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

const { updateSetting, getSetting } = useSiteSettings('favicon');

const onImageSelect = (setting: 'Logo' | 'Favicon') => {
  openUploader(undefined, setting);
};

const deleteFavicon = () => {
  updateSetting(placeholderImg);
};

const favicon = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const { handleImageAdd } = useImageAdd(favicon);

const activeImage = computed(() => favicon.value);
</script>
