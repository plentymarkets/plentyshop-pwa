<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>Meta description</UiFormLabel>
      <SfTooltip
        label="Short description of the page shown in search results of search engines. Should be engaging and informative."
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfTextarea
        v-model="metaDescription"
        data-testid="seo-description"
        class="w-full"
        placeholder="Enter description"
        rows="3"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfTextarea, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('metaDescription');

const metaDescription = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>
