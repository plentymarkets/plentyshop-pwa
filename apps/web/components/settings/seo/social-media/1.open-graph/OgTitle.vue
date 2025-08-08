<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>Title for OpenGraph</UiFormLabel>
      <SfTooltip
        label="The Open Graph title appears as the headline when your page is shared on social media."
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput v-model="ogTitle" type="text" placeholder="Enter URL of the image" data-testid="og-field" />

      <span class="typography-text-xs text-neutral-700"
        >Optimal length: 40–60 characters (max. ~80) to ensure full visibility in previews.
      </span>
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('ogTitle');

const ogTitle = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>
