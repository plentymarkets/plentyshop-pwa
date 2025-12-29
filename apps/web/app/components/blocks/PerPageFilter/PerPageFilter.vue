<template>
  <section data-testid="category-per-page" aria-label="Show products per page" :style="layoutStyle">
    <CategoryItemsPerPage
      :key="useSelectionModeCompact ? 'ph' : 'no-ph'"
      class="mb-6"
      :selection-mode-compact="useSelectionModeCompact"
      :total-products="productsCatalog.pagination?.totals ?? 0"
    />
  </section>
</template>
<script setup lang="ts">
import type { PerPageContent } from '~/components/blocks/PerPageFilter/types';

const { data: productsCatalog } = useProducts();
const props = defineProps<{ content: PerPageContent }>();
const useSelectionModeCompact = computed(() => props.content.settings?.selectionModeCompact ?? false);
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
