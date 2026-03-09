<template>
  <li
    role="button"
    tabindex="0"
    class="flex items-center justify-between py-1 my-1 cursor-pointer transition-colors gap-2 group"
    :data-testid="`toc-item-${item.uuid}`"
    @click="onItemClick"
    @keydown.enter="onItemClick"
    @keydown.space.prevent="onItemClick"
  >
    <div v-if="item.depth > 0 && !isStructureBlock(item.block)" class="shrink-0 w-4" />

    <TableOfContentsItemContent
      :uuid="item.uuid"
      :block-name="item.block.name"
      :label="item.label"
      :is-selected="isItemSelected"
      :block="item.block"
      @update-visibility="onUpdateVisibility"
    >
      <template v-if="isStructureBlock(item.block)" #arrow>
        <button
          class="shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-editor-icon-hover transition-colors p-0.5 -ml-0.5"
          @click.stop="toggleBlockExpansion(item.uuid)"
        >
          <SfIconChevronRight
            class="!w-4 !h-4 transition-transform"
            :class="{ 'rotate-90': expandedBlocks.has(item.uuid) }"
          />
        </button>
      </template>
    </TableOfContentsItemContent>
  </li>

  <template v-if="(expandedBlocks.has(item.uuid) || !isStructureBlock(item.block)) && getChildren(item).length">
    <TableOfContentsItem
      v-for="child in getChildren(item)"
      :key="child.uuid"
      :item="child"
    />
  </template>
</template>

<script setup lang="ts">
import { SfIconChevronRight } from '@storefront-ui/vue';
import type { FlatBlock } from './types';
import { useTableOfContents } from '~/composables/useTableOfContents/useTableOfContents';

interface Props {
  item: FlatBlock;
}

const props = defineProps<Props>();

const { selectedUuid, expandedBlocks, isStructureBlock, toggleBlockExpansion, getChildren, editBlock } =
  useTableOfContents();

const isItemSelected = computed(() => selectedUuid.value === props.item.uuid);

const onItemClick = async () => {
  editBlock(props.item.block);
};

const onUpdateVisibility = (visible: boolean) => {
  const block = props.item.block as unknown as Record<string, unknown>;
  if (!block.configuration) {
    block.configuration = {};
  }
  (block.configuration as Record<string, unknown>).visible = visible;
};
</script>
