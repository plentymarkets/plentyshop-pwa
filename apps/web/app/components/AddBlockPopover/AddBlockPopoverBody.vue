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
          >your filters</button>
          <template v-if="hasActiveFilters && hasActiveSearch"> or </template>
          <button
            v-if="hasActiveSearch"
            class="underline text-editor-toc-selected hover:opacity-80 transition-opacity"
            @click="searchQuery = ''"
          >your search</button>.
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
          {{ getEditorTranslation('filter-product') }}
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
          {{ getEditorTranslation('filter-category') }}
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
const {
  isLoading,
  searchQuery,
  activeFilters,
  hasActiveFilters,
  hasActiveSearch,
  showLayout,
  showContent,
  showProduct,
  showCategory,
  filteredPresets,
  filteredContentVariations,
  filteredProductVariations,
  filteredCategoryVariations,
  showLayoutSeparator,
  showProductSeparator,
  showCategorySeparator,
  hasNoResults,
  isVariationDisabled,
  selectVariation,
  onPickPreset,
} = useAddBlockPopoverPanel();
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
    "layout-preset": "Layout Presets",
    "section-content": "Content Blocks",
    "loading": "Loading blocks...",
    "filter-product": "Product",
    "filter-category": "Category"
  },
  "de": {
    "layout-preset": "Layout-Vorlagen",
    "section-content": "Content Blocks",
    "loading": "Blöcke werden geladen...",
    "filter-product": "Product",
    "filter-category": "Category"
  }
}
</i18n>
