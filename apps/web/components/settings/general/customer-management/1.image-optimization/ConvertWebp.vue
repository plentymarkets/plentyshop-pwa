<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1"
        >Convert item images to WebP
        <SfTooltip
          label="Automatically convert item images to modern formats for reduced file size and faster loading. This may increase cloud storage costs but can lower traffic expenses."
          :placement="'top'"
          :show-arrow="true"
          class="ml-2 z-10"
        >
          <SfIconInfo :size="'sm'" /> </SfTooltip
      ></UiFormLabel>
      <SfSwitch
        v-model="useWebp"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>

    <span class="typography-text-xs text-neutral-700"
      >Better compression than JPEG, PNG, and GIF. Supported by most modern browsers. If AVIF is enabled, WebP serves as
      a fallback for unsupported browsers.
    </span>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfSwitch, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('useWebp');

const useWebp = computed({
  get: () => getSetting() === 'true',
  set: (value) => updateSetting(value.toString()),
});
</script>
