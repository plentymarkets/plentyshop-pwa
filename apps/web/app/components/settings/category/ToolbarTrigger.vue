<template>
  <SfTooltip :label="getEditorTranslation('tooltip')" placement="right" class="inline-grid" :show-arrow="true">
    <button
      type="button"
      class="editor-button relative py-2 flex justify-center"
      :class="{ 'bg-editor-button text-white rounded-md': active }"
      aria-label="Open general settings drawer"
      data-testid="open-category-drawer"
    >
      <NuxtImg v-if="active" width="24" height="24px" :src="whiteIcon" />
      <NuxtImg v-else width="24" height="24px" :src="blackIcon" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';

import whiteIcon from '~/assets/icons/paths/category-white.svg';
import blackIcon from '~/assets/icons/paths/category-black.svg';

defineProps({
  active: Boolean,
});
</script>

<i18n lang="json">
{
  "en": {
    "tooltip": "Category: Manage settings that affect the user experience on category pages."
  },
  "de": {
    "tooltip": "Category: Manage settings that affect the user experience on category pages."
  }
}
</i18n>
