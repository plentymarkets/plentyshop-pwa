<template>
  <div class="flex-shrink-0 bg-white px-3 pt-3">
    <div class="flex items-center justify-between mb-4">
      <span class="text-2xs font-semibold text-editor-text-strong">
        {{ getEditorTranslation('title') }}
      </span>
      <div class="flex items-center gap-1.5 bg-editor-surface rounded-md px-2 py-1 max-w-[120px]">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" class="flex-shrink-0 text-editor-text-placeholder">
          <circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.4" />
          <path d="M7.8 7.8L10 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="getEditorTranslation('search-placeholder')"
          class="text-3xs text-editor-text-default placeholder:text-editor-text-ghost bg-transparent border-none outline-none w-full min-w-0"
        />
      </div>
    </div>

    <div class="flex flex-wrap gap-1 mb-2.5">
      <button
        v-for="filter in availableFilters"
        :key="filter.id"
        class="px-2 py-1 rounded-full text-3xs font-medium transition-colors duration-100"
        :class="
          activeFilters.includes(filter.id)
            ? 'bg-editor-toc-selected text-white'
            : 'bg-editor-body-bg text-editor-text-subtle hover:bg-editor-surface-cool-hover'
        "
        @click="toggleFilter(filter.id)"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="h-px bg-editor-surface-muted -mx-3" />
  </div>
</template>

<script setup lang="ts">
import type { BlockListCategory } from '~/composables/useBlocksList/types';
import type { FilterId } from '~/composables/useAddBlockPopover/types';

const { searchQuery, activeFilters, toggleFilter } = useAddBlockPopover();
const { blocksLists, pageHasAccessToCategory } = useBlocksList();

const isProductOnlyBlock = (category: BlockListCategory) =>
  !!category.accessControl && category.accessControl.length === 1 && category.accessControl[0] === 'product';
const isCategoryOnlyBlock = (category: BlockListCategory) =>
  !!category.accessControl && category.accessControl.length === 1 && category.accessControl[0] === 'productCategory';

const hasProductBlocks = computed(() =>
  Object.values(blocksLists.value).some(
    (category) => pageHasAccessToCategory(category) && isProductOnlyBlock(category),
  ),
);
const hasCategoryBlocks = computed(() =>
  Object.values(blocksLists.value).some(
    (category) => pageHasAccessToCategory(category) && isCategoryOnlyBlock(category),
  ),
);

const availableFilters = computed(() => {
  const filters: { id: FilterId; label: string }[] = [
    { id: 'layout', label: getEditorTranslation('filter-layout') },
    { id: 'content', label: getEditorTranslation('filter-content') },
  ];
  if (hasProductBlocks.value) filters.push({ id: 'product', label: getEditorTranslation('filter-product') });
  if (hasCategoryBlocks.value) filters.push({ id: 'category', label: getEditorTranslation('filter-category') });
  return filters;
});
</script>

<i18n lang="json">
{
  "en": {
    "title": "Add block",
    "search-placeholder": "Search...",
    "filter-layout": "Layout",
    "filter-content": "Content",
    "filter-product": "Product",
    "filter-category": "Category"
  },
  "de": {
    "title": "Block hinzufügen",
    "search-placeholder": "Suchen...",
    "filter-layout": "Layout",
    "filter-content": "Content",
    "filter-product": "Product",
    "filter-category": "Category"
  }
}
</i18n>
