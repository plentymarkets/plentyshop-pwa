<template>
  <div class="text-2xs text-editor-text-faint text-center py-4 leading-relaxed px-2">
    {{ getEditorTranslation('no-blocks-found') }}
    <template v-if="hasActiveFilters || hasActiveSearch">
      <br />
      {{ getEditorTranslation('try-clearing') }}
      <button
        v-if="hasActiveFilters"
        class="underline text-editor-toc-selected hover:opacity-80 transition-opacity"
        @click="activeFilters = []"
      >
        {{ getEditorTranslation('your-filters') }}
      </button>
      <template v-if="hasActiveFilters && hasActiveSearch"> {{ getEditorTranslation('or') }} </template>
      <button
        v-if="hasActiveSearch"
        class="underline text-editor-toc-selected hover:opacity-80 transition-opacity"
        @click="searchQuery = ''"
      >
        {{ getEditorTranslation('your-search') }}</button
      >.
    </template>
  </div>
</template>

<script setup lang="ts">
const { activeFilters, searchQuery } = useAddBlockPopover();

const hasActiveFilters = computed(() => activeFilters.value.length > 0);
const hasActiveSearch = computed(() => searchQuery.value.length > 0);
</script>

<i18n lang="json">
{
  "en": {
    "no-blocks-found": "No blocks found.",
    "try-clearing": "Try clearing",
    "your-filters": "your filters",
    "or": "or",
    "your-search": "your search"
  },
  "de": {
    "no-blocks-found": "No blocks found.",
    "try-clearing": "Try clearing",
    "your-filters": "your filters",
    "or": "or",
    "your-search": "your search"
  }
}
</i18n>
