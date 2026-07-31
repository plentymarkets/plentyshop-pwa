<template>
  <div class="px-5 pt-4 pb-3.5 border-b border-editor-border">
    <div
      class="flex justify-between items-center px-0.5 pb-2 text-2xs font-semibold tracking-wider uppercase text-editor-text-muted"
      aria-label="Filter"
    >
      <span>
        {{
          filters.size === 0
            ? getEditorTranslation('filter-showing-all')
            : getEditorTranslation('filter-active', { count: filters.size })
        }}
      </span>
      <button
        v-if="filters.size > 0"
        type="button"
        class="bg-transparent border-0 text-editor-text-strong normal-case tracking-normal underline underline-offset-2 p-0 hover:text-editor-accent"
        data-testid="toc-filter-clear"
        @click="clearFilters"
      >
        {{ getEditorTranslation('filter-clear') }}
      </button>
    </div>
    <div class="flex flex-col gap-1 rounded-xl">
      <div
        v-for="section in sections"
        :key="section.id"
        class="relative flex items-center justify-between h-8 rounded-md cursor-pointer text-xs font-semibold transition-colors border"
        :class="
          filters.has(section.id)
            ? 'bg-editor-button text-white border-editor-button'
            : 'bg-white text-editor-text-default border-editor-border hover:border-editor-text-default'
        "
      >
        <button
          type="button"
          class="flex-1 min-w-0 h-full flex items-center gap-2 px-2.5 bg-transparent border-0 text-left"
          :data-testid="`toc-filter-${section.id}`"
          :aria-pressed="filters.has(section.id)"
          @click="toggleFilter(section.id)"
        >
          <span
            class="w-3.5 h-3.5 flex-none flex items-center justify-center border rounded-sm transition-colors"
            :class="
              filters.has(section.id)
                ? 'bg-white border-white text-editor-button'
                : 'border-editor-border bg-white text-transparent'
            "
            aria-hidden="true"
          >
            <SfIconCheck v-if="filters.has(section.id)" class="!w-2.5 !h-2.5" />
          </span>
          <span>{{ section.label }}</span>
        </button>
        <button
          v-if="section.container"
          type="button"
          class="my-1 mr-1 w-6 h-6 flex items-center justify-center flex-none rounded"
          :class="
            filters.has(section.id)
              ? 'bg-white/20 text-white hover:bg-white hover:!text-editor-button'
              : 'bg-black/5 text-editor-text-default hover:bg-editor-button hover:text-white'
          "
          :data-testid="`toc-section-${section.id}-settings`"
          :title="getEditorTranslation('container-settings-label')"
          :aria-label="getEditorTranslation('container-settings-label')"
          @click.stop="openContainerSettings(section.container)"
        >
          <CogIcon class="!w-3.5 !h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconCheck } from '@storefront-ui/vue';
import type { Block } from '@plentymarkets/shop-api';
import type { TocSectionId, TocSection } from './types';
import CogIcon from './icons/CogIcon.vue';

defineProps<{ sections: TocSection[] }>();

const { filters } = useTableOfContents();
const { openDrawerWithView } = useSiteConfiguration();

const toggleFilter = (id: TocSectionId) => {
  const next = new Set(filters.value);

  next.has(id) ? next.delete(id) : next.add(id);

  filters.value = next;
};

const clearFilters = () => {
  filters.value = new Set();
};

const openContainerSettings = (block: Block | undefined | null) => {
  if (!block) {
    return;
  }

  openDrawerWithView('blocksSettings', block);
};
</script>

<i18n lang="json">
{
  "en": {
    "filter-showing-all": "Showing all",
    "filter-active": "Filter · {count} active",
    "filter-clear": "Clear",
    "container-settings-label": "Open container settings"
  },
  "de": {
    "filter-showing-all": "Showing all",
    "filter-active": "Filter · {count} active",
    "filter-clear": "Clear",
    "container-settings-label": "Open container settings"
  }
}
</i18n>
