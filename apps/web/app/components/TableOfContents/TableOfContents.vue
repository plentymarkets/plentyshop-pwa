<template>
  <div class="pages-view sticky top-[52px] z-[2]" data-testid="blocks-overview-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        {{ getEditorTranslation('label') }}
      </div>
      <div class="flex items-center gap-2">
        <button data-testid="blocks-overview-close" class="!p-0" @click="closeDrawer">
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
          tag="ul"
          class="mt-2 mb-4"
        >
          <template #item="{ element: block }">
            <div>
              <TableOfContentsItem
                :item="blockToFlatBlock(block)"
              />
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
import type { FlatBlock } from './types';

const { closeDrawer } = useSiteConfiguration();
const { data, addBlockAtBottom } = useTableOfContents();

const draggableData = computed({
  get: () => data.value,
  set: (newValue: Block[]) => {
    data.value.splice(0, data.value.length, ...newValue);
  },
});

const formatBlockName = (name: string): string => {
  if (!name) return 'Unknown Block';
  return name.replace(/([A-Z])/g, ' $1').trim();
};

const blockToFlatBlock = (block: Block): FlatBlock => ({
  uuid: block.meta.uuid,
  label: formatBlockName(block.name),
  depth: 0,
  block,
});
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
