<template>
  <SfTooltip :label="categoryLabel" placement="right" class="inline-grid" :show-arrow="true">
    <button
      type="button"
      class="editor-button relative py-2 flex justify-center"
      :class="{ 'bg-editor-button text-white rounded-md': active }"
      aria-label="Open general settings drawer"
      data-testid="open-general-settings-drawer"
    >
      <NuxtImg v-if="active" width="24" height="24px" :src="whiteIcon" />
      <NuxtImg v-else width="24" height="24px" :src="blackIcon" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';

import whiteIcon from 'assets/icons/paths/category-white.svg';
import blackIcon from 'assets/icons/paths/category-black.svg';

const categoryLabel = 'Category display settings: Define sorting options for product lists.';

defineProps({
  active: Boolean,
});
</script>
