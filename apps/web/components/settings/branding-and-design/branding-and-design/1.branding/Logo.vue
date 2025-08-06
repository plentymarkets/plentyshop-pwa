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
    <label>
      <SfInput v-model="headerLogo" type="text" placeholder="Enter URL of the image" data-testid="logo-field" />

      <span class="typography-text-xs text-neutral-700"
        >If you choose SVG, the size must be 150 x 40 px. For other formats, the maximum size is 180 px (width) by 80 px
        (height).</span
      >
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('headerLogo');

const headerLogo = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>
