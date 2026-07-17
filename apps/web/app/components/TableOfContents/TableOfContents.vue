<template>
  <div
    class="pages-view sticky w-full h-full flex flex-col bg-white text-editor-text-strong"
    data-testid="blocks-overview-drawer"
  >
    <header class="flex justify-between items-start px-5 pt-4 pb-4 border-b border-editor-border">
      <div>
        <div class="text-2xs font-semibold tracking-widest uppercase text-editor-text-muted mb-1">
          {{ getEditorTranslation('page-editor') }}
        </div>
        <div class="text-xl font-bold tracking-tight">{{ getEditorTranslation('label') }}</div>
      </div>
      <button
        type="button"
        class="bg-transparent border-0 text-editor-text-default p-1 rounded-lg flex items-center justify-center hover:bg-editor-surface"
        data-testid="blocks-overview-close"
        :aria-label="getEditorTranslation('close-label')"
        @click="closeSiteConfigurationDrawer"
      >
        <SfIconClose />
      </button>
    </header>

    <TableOfContentsFilters :sections="sections.map((s) => ({ ...s, label: getEditorTranslation(s.label) }))" />

    <div class="flex-1 overflow-auto px-3 pt-3 pb-4 flex flex-col gap-3.5">
      <TableOfContentsSection
        v-for="(section, idx) in visibleSections"
        :key="section.id"
        :section="{ ...section, label: getEditorTranslation(section.label) }"
        :is-first="idx === 0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';
import type { Block } from '@plentymarkets/shop-api';
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { TocSection } from './types';

const { closeSiteConfigurationDrawer } = useSiteConfiguration();
const { filters } = useTableOfContents();
const { headerContainer, pageBlocks, footer, updateBlocks, reorderHeaderBlocks, reorderFooterBlocks } = useBlocks();

const headerBlocks = computed(() => ((headerContainer.value as HeaderContainerBlock)?.content ?? []) as Block[]);
const footerBlocks = computed(() => (footer.value?.content ?? []) as Block[]);

const guardHeaderMove = (evt: BlockMoveEvent) => canMoveHeaderBlock(headerBlocks.value, evt);

const sections = computed<TocSection[]>(() => {
  const result: TocSection[] = [];
  if (headerContainer.value) {
    result.push({
      id: 'header',
      label: 'header-section-label',
      elements: headerBlocks.value,
      container: headerContainer.value,
      addTestId: 'toc-add-header-block',
      setOrder: reorderHeaderBlocks,
      canMove: guardHeaderMove,
    });
  }
  result.push({
    id: 'content',
    label: 'content-section-label',
    elements: pageBlocks.value,
    addTestId: 'toc-add-block',
    setOrder: updateBlocks,
  });
  if (footer.value) {
    result.push({
      id: 'footer',
      label: 'footer-section-label',
      elements: footerBlocks.value,
      container: footer.value,
      addTestId: 'toc-add-footer-block',
      setOrder: reorderFooterBlocks,
    });
  }
  return result;
});

const visibleSections = computed(() =>
  filters.value.size === 0 ? sections.value : sections.value.filter((section) => filters.value.has(section.id)),
);
</script>

<i18n lang="json">
{
  "en": {
    "label": "Table of Contents",
    "page-editor": "Page editor",
    "close-label": "Close",
    "description": "Click on a block to scroll to its position on the page.",
    "header-section-label": "Header",
    "content-section-label": "Content",
    "footer-section-label": "Footer",
    "filter-label": "Page sections"
  },
  "de": {
    "label": "Table of Contents",
    "page-editor": "Page editor",
    "close-label": "Close",
    "description": "Click on a block to scroll to its position on the page.",
    "header-section-label": "Header",
    "content-section-label": "Content",
    "footer-section-label": "Footer",
    "filter-label": "Page sections"
  }
}
</i18n>

<style>
.toc-drag-ghost .toc-insert-line,
.sortable-drag .toc-insert-line {
  display: none !important;
}
</style>
