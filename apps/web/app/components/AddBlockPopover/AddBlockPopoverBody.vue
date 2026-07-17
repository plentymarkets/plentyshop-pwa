<template>
  <div class="flex-1 overflow-y-scroll px-3 py-3 scroll-area min-h-0">
    <div v-if="isLoading" class="text-xs text-editor-text-placeholder text-center py-4">
      {{ getEditorTranslation('loading') }}
    </div>

    <AddBlockPopoverEmptyState v-else-if="hasNoResults" />

    <template v-else>
      <AddBlockPopoverLayoutPresets />
      <div v-if="hasLayoutContent && hasVariationContent" class="h-px bg-editor-surface-muted -mx-3 my-3" />
      <AddBlockPopoverVariationSections />
    </template>
  </div>
</template>

<script setup lang="ts">
import { LAYOUT_PRESETS } from './constants';
import type { BlockListCategory } from '~/composables/useBlocksList/types';

defineProps<{ isLoading: boolean }>();

const { activeFilters, searchQuery } = useAddBlockPopover();
const { blocksLists, pageHasAccessToCategory } = useBlocksList();

const noFilter = computed(() => activeFilters.value.length === 0);

const matchesSearch = (title: string) =>
  !searchQuery.value || title.toLowerCase().includes(searchQuery.value.toLowerCase());

const hasLayoutContent = computed(
  () =>
    (noFilter.value || activeFilters.value.includes('layout')) && LAYOUT_PRESETS.some((p) => matchesSearch(p.label)),
);

const isLayoutBlock = (c: BlockListCategory) => c.blockName === 'MultiGrid';
const isProductOnly = (c: BlockListCategory) =>
  !!c.accessControl && c.accessControl.length === 1 && c.accessControl[0] === 'product';
const isCategoryOnly = (c: BlockListCategory) =>
  !!c.accessControl && c.accessControl.length === 1 && c.accessControl[0] === 'productCategory';

const hasVariationContent = computed(() => {
  const filters = activeFilters.value;
  return Object.values(blocksLists.value).some((block) => {
    if (!pageHasAccessToCategory(block) || isLayoutBlock(block)) return false;
    const filter = isProductOnly(block) ? 'product' : isCategoryOnly(block) ? 'category' : 'content';
    if (!noFilter.value && !filters.includes(filter)) return false;
    return block.variations.some((variation) => matchesSearch(variation.title));
  });
});

const hasNoResults = computed(() => !hasLayoutContent.value && !hasVariationContent.value);
</script>

<style scoped>
.scroll-area {
  scrollbar-width: thin;
  scrollbar-color: #d0d0d0 transparent;
}
.scroll-area::-webkit-scrollbar {
  width: 4px;
}
.scroll-area::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-area::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 2px;
}
.scroll-area::-webkit-scrollbar-thumb:hover {
  background: #b8b8b8;
}
</style>

<i18n lang="json">
{
  "en": { "loading": "Loading blocks..." },
  "de": { "loading": "Loading blocks..." }
}
</i18n>
