<template>
  <div class="pages-view sticky" data-testid="blocks-overview-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        {{ getEditorTranslation('label') }}
      </div>
      <div class="flex items-center gap-2">
        <button data-testid="blocks-overview-close" class="!p-0" @click="closeSiteConfigurationDrawer">
          <SfIconClose />
        </button>
      </div>
    </header>

    <div class="h-[80vh] overflow-y-auto">
      <p class="mx-4 mt-4 mb-2 text-sm text-neutral-500">
        {{ getEditorTranslation('description') }}
      </p>

      <div v-if="headerContainer" class="mt-2">
        <button
          type="button"
          class="flex items-center justify-between w-full px-4 py-2 bg-neutral-100 text-sm font-semibold text-neutral-700"
          data-testid="toc-section-header"
          @click="headerCollapsed = !headerCollapsed"
        >
          <span>{{ getEditorTranslation('header-section-label') }}</span>
          <SfIconChevronRight class="!w-4 !h-4 transition-transform" :class="{ 'rotate-90': !headerCollapsed }" />
        </button>
        <ul v-if="!headerCollapsed" class="px-2 mt-2 mb-4">
          <TableOfContentsItem :item="blockToFlatBlock(headerContainer!)" />
        </ul>
      </div>

      <div>
        <button
          type="button"
          class="flex items-center justify-between w-full px-4 py-2 bg-neutral-100 text-sm font-semibold text-neutral-700"
          data-testid="toc-section-content"
          @click="contentCollapsed = !contentCollapsed"
        >
          <span>{{ getEditorTranslation('content-section-label') }}</span>
          <SfIconChevronRight class="!w-4 !h-4 transition-transform" :class="{ 'rotate-90': !contentCollapsed }" />
        </button>
        <template v-if="!contentCollapsed">
          <div class="px-2">
            <draggable
              v-if="pageBlocks.length"
              v-model="draggablePageBlocks"
              item-key="meta.uuid"
              handle=".toc-drag-handle"
              ghost-class="toc-drag-ghost"
              tag="ul"
              class="mt-2 mb-4"
              @change="handleDragChange"
            >
              <template #item="{ element: block, index }">
                <div>
                  <TableOfContentsInsertBlockLine v-if="index === 0" :block="block" is-top class="toc-insert-line" />
                  <TableOfContentsItem :item="blockToFlatBlock(block)" />
                  <TableOfContentsInsertBlockLine
                    v-if="index < pageBlocks.length - 1"
                    :block="block"
                    class="toc-insert-line"
                  />
                </div>
              </template>
            </draggable>
            <div v-else class="mx-2 mt-8 mb-4 text-center text-sm text-neutral-400">
              {{ getEditorTranslation('empty') }}
            </div>
          </div>
          <div class="px-4 mb-4">
            <button
              type="button"
              class="border border-editor-button w-full py-1 rounded-md flex items-center justify-center gap-1 text-editor-button"
              data-testid="toc-add-block"
              @click="addBlockAtBottom"
            >
              <SfIconAdd />
              {{ getEditorTranslation('add-element-label') }}
            </button>
          </div>
        </template>
      </div>

      <div v-if="footer">
        <button
          type="button"
          class="flex items-center justify-between w-full px-4 py-2 bg-neutral-100 text-sm font-semibold text-neutral-700"
          data-testid="toc-section-footer"
          @click="footerCollapsed = !footerCollapsed"
        >
          <span>{{ getEditorTranslation('footer-section-label') }}</span>
          <SfIconChevronRight class="!w-4 !h-4 transition-transform" :class="{ 'rotate-90': !footerCollapsed }" />
        </button>
        <ul v-if="!footerCollapsed" class="px-2 mt-2 mb-4">
          <TableOfContentsItem :item="blockToFlatBlock(footer!)" />
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconAdd, SfIconChevronRight } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import { useTableOfContents } from '~/composables/useTableOfContents/useTableOfContents';
import type { Block } from '@plentymarkets/shop-api';
import type { DragEvent } from '~/components/EditableBlocks/types';

const { closeSiteConfigurationDrawer } = useSiteConfiguration();
const { addBlockAtBottom, blockToFlatBlock } = useTableOfContents();
const { headerContainer, pageBlocks, footer, updateBlocks } = useBlocks();
const { scrollIntoBlockView } = useBlockManager();

const headerCollapsed = ref(false);
const contentCollapsed = ref(false);
const footerCollapsed = ref(false);

const draggablePageBlocks = computed({
  get: () => pageBlocks.value,
  set: (newValue: Block[]) => updateBlocks(newValue),
});

const handleDragChange = (evt: DragEvent) => {
  if (evt.moved && evt.moved.oldIndex !== evt.moved.newIndex) {
    const draggedBlock = pageBlocks.value[evt.moved.newIndex];
    if (draggedBlock) {
      scrollIntoBlockView(draggedBlock);
    }
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "label": "Table of Contents",
    "description": "Click on a block to scroll to its position on the page.",
    "empty": "No blocks found on this page.",
    "add-element-label": "Add element",
    "header-section-label": "Header",
    "content-section-label": "Content",
    "footer-section-label": "Footer"
  },
  "de": {
    "label": "Table of Contents",
    "description": "Click on a block to scroll to its position on the page.",
    "add-element-label": "Add element",
    "empty": "No blocks found on this page.",
    "header-section-label": "Header",
    "content-section-label": "Content",
    "footer-section-label": "Footer"
  }
}
</i18n>

<style>
.toc-drag-ghost .toc-insert-line,
.sortable-drag .toc-insert-line {
  display: none !important;
}
</style>
