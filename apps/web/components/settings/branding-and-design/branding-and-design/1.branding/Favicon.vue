<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
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
      <SfInput v-model="favicon" type="text" placeholder="Enter URL of the image" data-testid="favicon-field" />

      <span class="typography-text-xs text-neutral-700"
        >Recommended dimensions: A square of 32 × 32 px or 48 × 48 px
      </span>
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('favicon');

const favicon = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>
