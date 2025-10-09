<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1">
        {{ getEditorTranslation('label') }}
        <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
          <SfIconInfo :size="'sm'" />
        </SfTooltip>
      </UiFormLabel>
      <SfSwitch
        v-model="useAvif"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfSwitch, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('useAvif');

const useAvif = computed({
  get: () => Boolean(getSetting()),
  set: (value) => updateSetting(value.toString()),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Convert item images to AVIF",
    "description": "Automatically convert item images to modern formats for reduced file size and faster loading. This may increase cloud storage costs but can lower traffic expenses.",
    "tooltip": "If item images are requested in a modern image format in which the images are currently not available, these images can automatically be generated. This reduces the image size and thus leads to a faster loading time in the shop. Note that activating this setting may lead to additional cloud storage costs for content and item images. Please also note that after activating this option, each requested item image must be generated once in a modern image format, which may initially result in longer loading times for a short time. Provides better compression than JPEG, PNG, GIF, and WebP. Supported by most modern browsers, but fewer than WebP. If not supported, WebP is used instead (if enabled)."
  },
  "de": {
    "label": "Convert item images to AVIF",
    "description": "Automatically convert item images to modern formats for reduced file size and faster loading. This may increase cloud storage costs but can lower traffic expenses.",
    "tooltip": "If item images are requested in a modern image format in which the images are currently not available, these images can automatically be generated. This reduces the image size and thus leads to a faster loading time in the shop. Note that activating this setting may lead to additional cloud storage costs for content and item images. Please also note that after activating this option, each requested item image must be generated once in a modern image format, which may initially result in longer loading times for a short time. Provides better compression than JPEG, PNG, GIF, and WebP. Supported by most modern browsers, but fewer than WebP. If not supported, WebP is used instead (if enabled)."
  }
}
</i18n>
