<template>
  <li
    role="button"
    tabindex="0"
    class="flex items-center justify-between py-1 px-3 cursor-pointer transition-colors hover:bg-editor-toc-highlight gap-2 group"
    :class="{ 'bg-editor-toc-highlight': selectedUuid === item.uuid }"
    :style="{ paddingLeft: `${16 + item.depth * 16}px` }"
    :data-testid="testId"
    @click="onItemClick"
    @keydown.enter="onItemClick"
    @keydown.space.prevent="onItemClick"
  >
    <div class="flex items-center gap-2 min-w-0 flex-1">
      <button
        v-if="isStructureBlock(item.block)"
        class="shrink-0 w-4 h-4 flex items-center justify-center"
        @click.stop="toggleBlockExpansion(item.uuid)"
      >
        <svg
          class="w-3 h-3 transition-transform"
          :class="{ 'rotate-90': expandedBlocks.has(item.uuid) }"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <div v-else class="shrink-0 w-4" />

      <span
        v-if="getBlockIconSvg(item.block.name)"
        class="shrink-0 w-5 h-5 [&>svg]:w-full [&>svg]:h-full"
        v-html="getBlockIconSvg(item.block.name)"
      />

      <span class="truncate text-sm">{{ item.label }}</span>
    </div>

    <button
      class="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      :data-testid="deleteTestId"
      @click.stop
    >
      <SfIconBase size="xs" viewBox="0 0 24 24" class="fill-red-600">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" fill="currentColor" />
        </svg>
      </SfIconBase>
    </button>
  </li>

  <template v-if="(expandedBlocks.has(item.uuid) || !isStructureBlock(item.block)) && getChildren(item).length">
    <TableOfContentsItem
      v-for="child in getChildren(item)"
      :key="child.uuid"
      :item="child"
      :test-id="`blocks-overview-item-${child.uuid}`"
      :delete-test-id="`blocks-overview-delete-${child.uuid}`"
    />
  </template>
</template>

<script setup lang="ts">
import { SfIconBase } from '@storefront-ui/vue';
import { getBlockIconSvg } from '~/utils/block-icons';
import type { FlatBlock } from './types';
import { useTableOfContents } from '~/composables/useTableOfContents/useTableOfContents';

interface Props {
  item: FlatBlock;
  testId: string;
  deleteTestId: string;
}

const props = defineProps<Props>();

const { selectedUuid, expandedBlocks, isStructureBlock, toggleBlockExpansion, getChildren, editBlock } =
  useTableOfContents();

const onItemClick = () => {
  editBlock(props.item.block);
};
</script>
