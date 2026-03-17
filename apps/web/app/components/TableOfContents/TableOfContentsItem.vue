<template>
  <li
    role="button"
    tabindex="0"
    class="flex items-center justify-between cursor-pointer transition-colors gap-1 group"
    :data-testid="`toc-item-${item.uuid}`"
    @click="editBlock(item.block)"
    @keydown.enter="editBlock(item.block)"
    @keydown.space.prevent="editBlock(item.block)"
    @mouseenter="hoveredUuid = item.uuid"
    @mouseleave="hoveredUuid = ''"
  >
    <div v-if="item.depth > 0 && !isStructureBlock(item.block)" class="shrink-0 w-4" />

    <TableOfContentsItemContent
      :uuid="item.uuid"
      :block-name="item.block.name"
      :label="item.label"
      :is-selected="isItemSelected"
      :block="item.block"
      :is-root="item.depth === 0"
    >
      <template v-if="isStructureBlock(item.block)" #arrow>
        <button
          class="shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-editor-icon-hover transition-colors p-0.5 -ml-0.5"
          :data-testid="`toc-expand-${item.uuid}`"
          @click.stop="toggleBlockExpansion(item.uuid)"
        >
          <SfIconChevronRight
            class="!w-6 !h-6 transition-transform"
            :class="{ 'rotate-90': expandedBlocks.has(item.uuid) }"
          />
        </button>
      </template>
    </TableOfContentsItemContent>
  </li>

  <template v-if="(expandedBlocks.has(item.uuid) || !isStructureBlock(item.block)) && getChildren(item).length">
    <TableOfContentsItem v-for="child in getChildren(item)" :key="child.uuid" :item="child" />
  </template>
</template>

<script setup lang="ts">
import { SfIconChevronRight } from '@storefront-ui/vue';
import type { TableOfContentsItemProps } from './types';
import { useTableOfContents } from '~/composables/useTableOfContents/useTableOfContents';

const props = defineProps<TableOfContentsItemProps>();

const { selectedUuid, hoveredUuid, expandedBlocks, isStructureBlock, toggleBlockExpansion, getChildren, editBlock } =
  useTableOfContents();

const isItemSelected = computed(() => selectedUuid.value === props.item.uuid);
</script>
