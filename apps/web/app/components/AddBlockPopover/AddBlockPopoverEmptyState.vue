<template>
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

<script setup lang="ts">
const { activeFilters, searchQuery } = useAddBlockPopover();

const hasActiveFilters = computed(() => activeFilters.value.length > 0);
const hasActiveSearch = computed(() => searchQuery.value.length > 0);
</script>
