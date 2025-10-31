<template>
  <section data-testid="category-sort" aria-label="Sort products" :style="layoutStyle">
    <CategorySortingSingleBlock
      :key="useSelectionModeAlways ? 'ph' : 'no-ph'"
      :selection-mode-always="useSelectionModeAlways"
      class="mb-4"
    />
  </section>
</template>

<script setup lang="ts">
import type { SortContent } from '~/components/blocks/Sort/types';

const props = defineProps<{ content: SortContent }>();
const useSelectionModeAlways = computed(() => props.content.settings?.selectionModeAlways ?? false);
const layoutStyle = computed(() => {
  const layout = props.content.layout ?? {};
  return {
    paddingTop: `${layout.paddingTop ?? 0}px`,
    paddingBottom: `${layout.paddingBottom ?? 0}px`,
    paddingLeft: `${layout.paddingLeft ?? 0}px`,
    paddingRight: `${layout.paddingRight ?? 0}px`,
  };
});
</script>
