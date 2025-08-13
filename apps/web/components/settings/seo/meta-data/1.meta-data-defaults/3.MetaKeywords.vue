<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>Meta keywords</UiFormLabel>
      <SfTooltip
        label="List of relevant terms, separated by commas. Some search engines may use them to improve discoverability."
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput v-model="metaKeywords" type="text" data-testid="seo-keywords" placeholder="Enter keywords" />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('metaKeywords');

const metaKeywords = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>
