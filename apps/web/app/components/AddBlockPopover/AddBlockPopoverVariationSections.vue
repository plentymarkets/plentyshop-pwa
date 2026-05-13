<template>
  <template v-for="(section, i) in visibleSections" :key="section.id">
    <div v-if="i > 0" class="h-px bg-editor-surface-muted -mx-3 my-3" />
    <div class="section-label">{{ getEditorTranslation(section.labelKey) }}</div>
    <AddBlockPopoverVariationGrid :variations="section.items" />
  </template>
</template>

<script setup lang="ts">
import type { BlockListCategory } from '~/composables/useBlocksList/types';
import type { VariationSection, FlatVariation } from './types';

const { activeFilters, searchQuery } = useAddBlockPopover();
const { blocksLists, pageHasAccessToCategory } = useBlocksList();

const isLayoutBlock = (category: BlockListCategory) => category.blockName === 'MultiGrid';
const isProductOnlyBlock = (category: BlockListCategory) =>
  !!category.accessControl && category.accessControl.length === 1 && category.accessControl[0] === 'product';
const isCategoryOnlyBlock = (category: BlockListCategory) =>
  !!category.accessControl && category.accessControl.length === 1 && category.accessControl[0] === 'productCategory';

const accessibleCategories = computed(() => {
  const result: Record<string, BlockListCategory> = {};
  for (const [key, category] of Object.entries(blocksLists.value)) {
    if (pageHasAccessToCategory(category)) result[key] = category;
  }
  return result;
});

const toFlatVariations = (categories: BlockListCategory[]): FlatVariation[] =>
  categories.flatMap((category) => category.variations.map((variation, idx) => ({ category, variation, idx })));

const matchesSearch = (title: string) =>
  !searchQuery.value || title.toLowerCase().includes(searchQuery.value.toLowerCase());

const noFilter = computed(() => activeFilters.value.length === 0);

const productList = computed(() => Object.values(accessibleCategories.value).filter(isProductOnlyBlock));
const categoryList = computed(() => Object.values(accessibleCategories.value).filter(isCategoryOnlyBlock));
const contentList = computed(() =>
  Object.values(accessibleCategories.value).filter(
    (category) => !isLayoutBlock(category) && !isProductOnlyBlock(category) && !isCategoryOnlyBlock(category),
  ),
);

const showProduct = computed(
  () => productList.value.length > 0 && (noFilter.value || activeFilters.value.includes('product')),
);
const showCategory = computed(
  () => categoryList.value.length > 0 && (noFilter.value || activeFilters.value.includes('category')),
);
const showContent = computed(() => noFilter.value || activeFilters.value.includes('content'));

const visibleSections = computed((): VariationSection[] => {
  const candidates: VariationSection[] = [
    {
      id: 'product',
      labelKey: 'section-product',
      items: toFlatVariations(productList.value).filter((i) => matchesSearch(i.variation.title)),
    },
    {
      id: 'category',
      labelKey: 'section-category',
      items: toFlatVariations(categoryList.value).filter((i) => matchesSearch(i.variation.title)),
    },
    {
      id: 'content',
      labelKey: 'section-content',
      items: toFlatVariations(contentList.value).filter((i) => matchesSearch(i.variation.title)),
    },
  ];
  const visibility: Record<VariationSection['id'], boolean> = {
    product: showProduct.value,
    category: showCategory.value,
    content: showContent.value,
  };
  return candidates.filter((candidate) => visibility[candidate.id] && candidate.items.length > 0);
});
</script>

<style scoped>
.section-label {
  @apply text-4xs text-editor-text-ghost font-bold tracking-widest mb-2 pl-0.5 uppercase;
}
</style>

<i18n lang="json">
{
  "en": {
    "section-product": "Product",
    "section-category": "Category",
    "section-content": "Content Blocks"
  },
  "de": {
    "section-product": "Product",
    "section-category": "Category",
    "section-content": "Content Blocks"
  }
}
</i18n>
