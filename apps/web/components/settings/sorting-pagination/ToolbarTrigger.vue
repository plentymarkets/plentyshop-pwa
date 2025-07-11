<template>
  <button
    type="button"
    class="editor-button relative py-2 flex justify-center"
    :class="{ 'bg-editor-button text-white rounded-md': active }"
    aria-label="Open design drawer"
    data-testid="open-sorting-pagination-drawer"
  >
    <SfIconCompareArrows class="rotate-90" />
  </button>
</template>

<script setup lang="ts">
import { SfIconCompareArrows } from '@storefront-ui/vue';

defineProps({
  active: Boolean,
});
</script>
