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
    <UiImagePicker
      label="Favicon"
      :image="favicon"
      :placeholder="placeholderImg"
      dimensions="32x32px or 48x48px (.ico)"
      :show-tooltip="true"
      @update:image="handleImageAdd"
    />
    <span v-if="!runtimeConfig.public.isDev" class="typography-text-xs text-neutral-700">
      Recommended dimensions: A square of 32 × 32 px or 48 × 48 px
    </span>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import UiImagePicker from '~/components/ui/ImagePicker/ImagePicker.vue';
import { usePickerHelper } from '~/composables/usePickerHelper/usePickerHelper';
import { useSiteSettings } from '~/composables/useSiteSettings/useSiteSettings';

const { placeholderImg } = usePickerHelper();
const runtimeConfig = useRuntimeConfig();

const { updateSetting, getSetting } = useSiteSettings('favicon');

const favicon = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

// This handler works for both add and delete (delete sets image to placeholder)
const { handleImageAdd } = useImageAdd(favicon);
</script>

