<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>Title</UiFormLabel>
      <SfTooltip
        label="Title displayed in search results of search engines (format: Title | Shop name). To update the shop name, open your Plenty system and go to Setup » Client » [Client name] » Settings."
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput v-model="metaTitle" type="text" data-testid="seo-title" placeholder="Enter title" />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('metaTitle');

const metaTitle = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>
