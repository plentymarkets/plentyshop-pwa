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

      <div class="px-2">
        <draggable
          v-if="data.length"
          v-model="draggableData"
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
              <TableOfContentsInsertBlockLine v-if="index < data.length - 1" :block="block" class="toc-insert-line" />
            </div>
          </template>
        </draggable>

        <div v-else class="mx-2 mt-8 text-center text-sm text-neutral-400">
          {{ getEditorTranslation('empty') }}
        </div>

        <div v-if="data.length" class="px-2 mb-4">
          <button
            class="border border-editor-button w-full py-1 rounded-md flex items-center justify-center gap-1 text-editor-button"
            data-testid="toc-add-block"
            @click="addBlockAtBottom"
          >
            <SfIconAdd />
            {{ getEditorTranslation('add-element-label') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconAdd } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import { useTableOfContents } from '~/composables/useTableOfContents/useTableOfContents';
import type { Block } from '@plentymarkets/shop-api';
import type { DragEvent } from '~/components/EditableBlocks/types';

const { closeSiteConfigurationDrawer } = useSiteConfiguration();
const { data, addBlockAtBottom, blockToFlatBlock } = useTableOfContents();
const { scrollIntoBlockView } = useBlockManager();

const draggableData = computed({
  get: () => data.value,
  set: (newValue: Block[]) => {
    data.value.splice(0, data.value.length, ...newValue);
  },
});

const enforceFooterAtBottom = () => {
  const footerIndex = data.value.findIndex((block) => isFooterBlock(block));
  const lastIndex = data.value.length - 1;
  if (footerIndex !== -1 && footerIndex !== lastIndex) {
    const footerBlock = data.value.splice(footerIndex, 1)[0];
    if (footerBlock) {
      data.value.push(footerBlock);
    }
  }
};

const handleDragChange = (evt: DragEvent) => {
  enforceFooterAtBottom();
  scrollToDraggedBlock(evt);
};

const scrollToDraggedBlock = (evt: DragEvent) => {
  if (evt.moved && evt.moved.oldIndex !== evt.moved.newIndex) {
    const draggedBlock = data.value[evt.moved.newIndex];
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
    "add-element-label": "Add element"
  },
  "de": {
    "label": "Table of Contents",
    "description": "Click on a block to scroll to its position on the page.",
    "empty": "No blocks found on this page.",
    "add-element-label": "Add element"
  }
}
</i18n>

<style>
.toc-drag-ghost .toc-insert-line,
.sortable-drag .toc-insert-line {
  display: none !important;
}
</style>
