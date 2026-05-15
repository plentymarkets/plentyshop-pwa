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
        <EditorFormPanel v-model="headerOpen" :title="getEditorTranslation('header-section-label')" content-class="p-0" data-testid="toc-section-header">
          <div class="px-2 mt-2 mb-4">
            <draggable
              v-if="headerBlocks.length"
              v-model="draggableHeaderBlocks"
              item-key="meta.uuid"
              handle=".toc-drag-handle"
              ghost-class="toc-drag-ghost"
              tag="div"
              @change="handleHeaderDragChange"
            >
              <template #item="{ element: block }">
                <div>
                  <TableOfContentsItem :item="blockToFlatBlock(block)" />
                </div>
              </template>
            </draggable>
          </div>
          <div class="px-4 mb-4">
            <button
              type="button"
              class="border border-editor-button w-full py-1 rounded-md flex items-center justify-center gap-1 text-editor-button"
              data-testid="toc-add-header-block"
              @click="addHeaderBlock"
            >
              <SfIconAdd />
              {{ getEditorTranslation('add-element-label') }}
            </button>
          </div>
        </EditorFormPanel>
      </div>

      <div>
        <EditorFormPanel v-model="contentOpen" :title="getEditorTranslation('content-section-label')" content-class="p-0" data-testid="toc-section-content">
          <div class="px-2">
            <draggable
              v-if="pageBlocks.length"
              v-model="draggablePageBlocks"
              item-key="meta.uuid"
              handle=".toc-drag-handle"
              ghost-class="toc-drag-ghost"
              tag="div"
              class="mt-2 mb-4"
              @change="handleDragChange"
            >
              <template #item="{ element: block }">
                <div>
                  <TableOfContentsItem :item="blockToFlatBlock(block)" />
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
              @click="handleAddBlockAtBottom"
            >
              <SfIconAdd />
              {{ getEditorTranslation('add-element-label') }}
            </button>
          </div>
        </EditorFormPanel>
      </div>

      <div v-if="footer">
        <EditorFormPanel v-model="footerOpen" :title="getEditorTranslation('footer-section-label')" content-class="p-0" data-testid="toc-section-footer">
          <div class="px-2 mt-2 mb-4">
            <TableOfContentsItem :item="blockToFlatBlock(footer!)" />
          </div>
        </EditorFormPanel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconAdd } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import { useTableOfContents } from '~/composables/useTableOfContents/useTableOfContents';
import type { Block } from '@plentymarkets/shop-api';
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { DragEvent } from '~/components/EditableBlocks/types';

const { closeSiteConfigurationDrawer } = useSiteConfiguration();
const { addBlockAtBottom, blockToFlatBlock, headerOpen, contentOpen, footerOpen } = useTableOfContents();
const { headerContainer, pageBlocks, footer, updateBlocks, reorderHeaderBlocks } = useBlocks();
const { scrollIntoBlockView } = useBlockManager();
const { openAddBlockPopover } = useAddBlockPopover();
const { logToCCreateBlock } = useLogEvent();

const headerBlocks = computed(() => ((headerContainer.value as HeaderContainerBlock)?.content ?? []) as Block[]);

const draggableHeaderBlocks = computed({
  get: () => headerBlocks.value,
  set: (newValue: Block[]) => reorderHeaderBlocks(newValue),
});

const handleHeaderDragChange = (evt: DragEvent) => {
  if (evt.moved && evt.moved.oldIndex !== evt.moved.newIndex) {
    const draggedBlock = headerBlocks.value[evt.moved.newIndex];
    if (draggedBlock) {
      scrollIntoBlockView(draggedBlock);
    }
  }
};

const handleAddBlockAtBottom = (event: MouseEvent) => {
  addBlockAtBottom(event);
  logToCCreateBlock();
};

const addHeaderBlock = (event: MouseEvent) => {
  const lastChild = headerBlocks.value[headerBlocks.value.length - 1];
  if (!lastChild) return;
  if (useRuntimeConfig().public.enableAddBlockPopover) {
    openAddBlockPopover({
      anchorEl: event.currentTarget as HTMLElement,
      targetUuid: lastChild.meta.uuid,
      position: 'bottom',
    });
  } else {
    const { openDrawerWithView } = useSiteConfiguration();
    const { togglePlaceholder } = useBlockManager();
    const { clearInsertColumnUuid } = useBlocksMutations();
    togglePlaceholder(lastChild.meta.uuid, 'bottom');
    openDrawerWithView('blocksList');
    clearInsertColumnUuid();
  }

  logToCCreateBlock();
};

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
