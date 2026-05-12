<template>
  <div class="flex-1 overflow-y-scroll px-3 py-3 scroll-area min-h-0">
    <template v-if="isLoading">
      <div class="text-[12px] text-[#aaa] text-center py-4">
        {{ getEditorTranslation('loading') }}
      </div>
    </template>

    <template v-else-if="hasNoResults">
      <div class="text-[11px] text-[#888] text-center py-4 leading-relaxed px-2">
        No blocks found.
        <template v-if="hasActiveFilters || hasActiveSearch">
          <br />
          Try clearing
          <button
            v-if="hasActiveFilters"
            class="underline text-editor-toc-selected hover:opacity-80 transition-opacity"
            @click="activeFilters = []"
          >
            your filters
          </button>
          <template v-if="hasActiveFilters && hasActiveSearch"> or </template>
          <button
            v-if="hasActiveSearch"
            class="underline text-editor-toc-selected hover:opacity-80 transition-opacity"
            @click="searchQuery = ''"
          >
            your search</button
          >.
        </template>
      </div>
    </template>

    <template v-else>
      <template v-if="showLayout && filteredPresets.length > 0">
        <div class="text-[9px] text-[#bbb] font-bold tracking-[0.1em] mb-2 pl-0.5 uppercase">
          {{ getEditorTranslation('layout-preset') }}
        </div>
        <div class="grid grid-cols-3 gap-[5px]">
          <button
            v-for="preset in filteredPresets"
            :key="preset.label"
            class="px-1 pt-2 pb-[7px] rounded-[7px] border border-[#e8e8e8] bg-white cursor-pointer flex flex-col items-center gap-[5px] hover:bg-[#f4f8ff] hover:border-[#b8ccf8] transition-all duration-[120ms]"
            @click="onPickPreset(preset.spans)"
          >
            <div class="flex gap-[2px] w-full h-[10px]">
              <div
                v-for="(s, i) in preset.spans"
                :key="i"
                class="h-full rounded-[2px]"
                :style="{ flex: s, background: 'rgba(29,94,199,0.18)', border: '1px dashed rgba(29,94,199,0.5)' }"
              />
            </div>
            <span class="text-[10px] text-[#666]">{{ preset.label }}</span>
          </button>
        </div>
      </template>

      <div v-if="showLayoutSeparator" class="h-px bg-[#f0f0f0] -mx-3 my-3" />

      <template v-if="showProduct && filteredProductVariations.length > 0">
        <div class="text-[9px] text-[#bbb] font-bold tracking-[0.1em] mb-2 pl-0.5 uppercase">
          {{ getEditorTranslation('section-product') }}
        </div>
        <AddBlockPopoverVariationGrid
          :variations="filteredProductVariations"
          :is-variation-disabled="isVariationDisabled"
          @select="(category, idx) => selectVariation(category, idx)"
        />
      </template>

      <div v-if="showProductSeparator" class="h-px bg-[#f0f0f0] -mx-3 my-3" />

      <template v-if="showCategory && filteredCategoryVariations.length > 0">
        <div class="text-[9px] text-[#bbb] font-bold tracking-[0.1em] mb-2 pl-0.5 uppercase">
          {{ getEditorTranslation('section-category') }}
        </div>
        <AddBlockPopoverVariationGrid
          :variations="filteredCategoryVariations"
          :is-variation-disabled="isVariationDisabled"
          @select="(category, idx) => selectVariation(category, idx)"
        />
      </template>

      <div v-if="showCategorySeparator" class="h-px bg-[#f0f0f0] -mx-3 my-3" />

      <template v-if="showContent && filteredContentVariations.length > 0">
        <div class="text-[9px] text-[#bbb] font-bold tracking-[0.1em] mb-2 pl-0.5 uppercase">
          {{ getEditorTranslation('section-content') }}
        </div>
        <AddBlockPopoverVariationGrid
          :variations="filteredContentVariations"
          :is-variation-disabled="isVariationDisabled"
          @select="(category, idx) => selectVariation(category, idx)"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BlockListCategory, BlockTemplateVariation } from '~/composables/useBlocksList/types';
import type { FlatVariation } from './types';

defineProps<{ isLoading: boolean }>();

const { searchQuery, activeFilters, popoverState, closeAddBlockPopover } = useAddBlockPopover();
const { blocksLists, pageHasAccessToCategory } = useBlocksList();
const { addNewBlock, insertCustomBlock, getBlockDepth, blockExistsOnPage } = useBlockManager();

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

const contentCategoryList = computed(() =>
  Object.values(accessibleCategories.value).filter(
    (category) => !isLayoutBlock(category) && !isProductOnlyBlock(category) && !isCategoryOnlyBlock(category),
  ),
);
const productCategoryList = computed(() => Object.values(accessibleCategories.value).filter(isProductOnlyBlock));
const pageCategoryList = computed(() => Object.values(accessibleCategories.value).filter(isCategoryOnlyBlock));

const hasProductBlocks = computed(() => productCategoryList.value.length > 0);
const hasCategoryBlocks = computed(() => pageCategoryList.value.length > 0);

const noFilter = computed(() => activeFilters.value.length === 0);
const hasActiveFilters = computed(() => activeFilters.value.length > 0);
const hasActiveSearch = computed(() => searchQuery.value.length > 0);

const showLayout = computed(() => noFilter.value || activeFilters.value.includes('layout'));
const showContent = computed(() => noFilter.value || activeFilters.value.includes('content'));
const showProduct = computed(
  () => hasProductBlocks.value && (noFilter.value || activeFilters.value.includes('product')),
);
const showCategory = computed(
  () => hasCategoryBlocks.value && (noFilter.value || activeFilters.value.includes('category')),
);

const LAYOUT_PRESETS = [
  { label: '1 Col', spans: [12] },
  { label: '2 Equal', spans: [6, 6] },
  { label: 'Sidebar L', spans: [3, 9] },
  { label: 'Sidebar R', spans: [9, 3] },
  { label: '3 Equal', spans: [4, 4, 4] },
  { label: '4 Equal', spans: [3, 3, 3, 3] },
] as const;

const matchesSearch = (title: string) =>
  !searchQuery.value || title.toLowerCase().includes(searchQuery.value.toLowerCase());

const filteredPresets = computed(() => LAYOUT_PRESETS.filter((p) => matchesSearch(p.label)));

const toFlatVariations = (categories: BlockListCategory[]): FlatVariation[] =>
  categories.flatMap((category) => category.variations.map((variation, idx) => ({ category, variation, idx })));

const filteredContentVariations = computed(() =>
  toFlatVariations(contentCategoryList.value).filter((item) => matchesSearch(item.variation.title)),
);
const filteredProductVariations = computed(() =>
  toFlatVariations(productCategoryList.value).filter((item) => matchesSearch(item.variation.title)),
);
const filteredCategoryVariations = computed(() =>
  toFlatVariations(pageCategoryList.value).filter((item) => matchesSearch(item.variation.title)),
);

const showLayoutSeparator = computed(
  () =>
    showLayout.value &&
    filteredPresets.value.length > 0 &&
    ((showProduct.value && filteredProductVariations.value.length > 0) ||
      (showCategory.value && filteredCategoryVariations.value.length > 0) ||
      (showContent.value && filteredContentVariations.value.length > 0)),
);
const showProductSeparator = computed(
  () =>
    showProduct.value &&
    filteredProductVariations.value.length > 0 &&
    ((showCategory.value && filteredCategoryVariations.value.length > 0) ||
      (showContent.value && filteredContentVariations.value.length > 0)),
);
const showCategorySeparator = computed(
  () =>
    showCategory.value &&
    filteredCategoryVariations.value.length > 0 &&
    showContent.value &&
    filteredContentVariations.value.length > 0,
);

const hasNoResults = computed(
  () =>
    ![
      showLayout.value && filteredPresets.value.length > 0,
      showProduct.value && filteredProductVariations.value.length > 0,
      showCategory.value && filteredCategoryVariations.value.length > 0,
      showContent.value && filteredContentVariations.value.length > 0,
    ].some(Boolean),
);

const targetUuid = computed(() => popoverState.value?.targetUuid ?? '');

const isNestedMultigridDisabled = (category: BlockListCategory) =>
  category.blockName === 'MultiGrid' && getBlockDepth(targetUuid.value) > 0;
const isForbiddenBlockDisabled = (category: BlockListCategory) =>
  ['BannerCarousel', 'ImageText'].includes(category.blockName) && getBlockDepth(targetUuid.value) > 0;

const isVariationDisabled = (category: BlockListCategory, variation: BlockTemplateVariation) => {
  const blockName = variation.template.en.name;
  return (
    isNestedMultigridDisabled(category) ||
    isForbiddenBlockDisabled(category) ||
    (['SortFilter', 'ItemGrid', 'Navigation'].includes(blockName) && blockExistsOnPage(blockName))
  );
};

const selectVariation = async (category: BlockListCategory, variationIndex: number) => {
  if (!popoverState.value) return;
  const { targetUuid: uuid, position } = popoverState.value;
  closeAddBlockPopover();
  await addNewBlock(category.category, variationIndex, uuid, position);
};

const onPickPreset = (spans: readonly number[]) => {
  if (!popoverState.value) return;
  const { targetUuid: uuid, position } = popoverState.value;
  const multiGridBlock = {
    name: 'MultiGrid',
    type: 'structure',
    meta: { uuid: '' },
    configuration: { columnWidths: spans, fullWidth: false, visible: true },
    content: spans.map((_, i) => ({
      name: 'EmptyGridBlock',
      type: 'content',
      meta: { uuid: '' },
      parent_slot: i,
      content: [],
    })),
  };
  closeAddBlockPopover();
  insertCustomBlock(multiGridBlock as never, uuid, position);
};
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
  "en": {
    "loading": "Loading blocks...",
    "layout-preset": "Layout Presets",
    "section-product": "Product",
    "section-category": "Category",
    "section-content": "Content Blocks"
  },
  "de": {
    "loading": "Blöcke werden geladen...",
    "layout-preset": "Layout-Vorlagen",
    "section-product": "Product",
    "section-category": "Category",
    "section-content": "Content Blocks"
  }
}
</i18n>
