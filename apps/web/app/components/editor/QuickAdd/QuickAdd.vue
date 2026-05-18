<template>
  <div v-if="isEnabled && options.length" class="flex flex-wrap justify-center gap-1.5 px-4 pt-3">
    <button
      v-for="option in options"
      :key="option.blockName"
      :data-testid="`quick-add-${option.blockName}`"
      type="button"
      class="px-2 py-1 rounded-full border border-editor-border bg-white cursor-pointer flex items-center gap-1.5 hover:bg-editor-toc-hover hover:border-editor-accent-border-hover transition-all duration-150"
      @click="handleAdd(option)"
    >
      <div class="shrink-0 w-3.5 h-3.5">
        <span
          v-if="getBlockIconSvg(option.blockName)"
          class="block w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full"
          v-html="getBlockIconSvg(option.blockName)"
        />
        <NuxtImg v-else :src="defaultBlockIcon" class="w-3.5 h-3.5" />
      </div>
      <span class="text-3xs text-editor-text-subtle whitespace-nowrap">{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import defaultBlockIcon from '~/assets/icons/paths/block-default-icon.svg';
import type { QuickAddOption, QuickAddProps } from './types';
import type { Block } from '@plentymarkets/shop-api';

const isEnabled = useRuntimeConfig().public.enableQuickAdd;

defineProps<QuickAddProps>();

const { blockUuid } = useSiteConfiguration();
const { allBlocks } = useBlocks();
const { findOrDeleteBlockByUuid, addNewBlock } = useBlockManager();

const getBlock = () => {
  const uuid = blockUuid.value;
  if (!uuid) return undefined;
  return findOrDeleteBlockByUuid(allBlocks.value, uuid) ?? undefined;
};

const isMultiGrid = (block: Block) => block.name === 'MultiGrid';

const getMaxColumnsPerRow = (columnWidths: number[]): number => {
  let maxCols = 0;
  let count = 0;
  let used = 0;
  for (const span of columnWidths) {
    if (used + span > 12) {
      if (used === 12) maxCols = Math.max(maxCols, count);
      count = 0;
      used = 0;
    }
    count++;
    used += span;
  }
  if (used === 12) maxCols = Math.max(maxCols, count);
  return maxCols > 1 ? maxCols : 2;
};

const getLastRow = (columnWidths: number[]): { startIndex: number; count: number } => {
  let startIndex = 0;
  let used = 0;
  for (let i = 0; i < columnWidths.length; i++) {
    if (used + columnWidths[i]! > 12) {
      startIndex = i;
      used = 0;
    }
    used += columnWidths[i]!;
  }
  return { startIndex, count: columnWidths.length - startIndex };
};

const handleMultiGridAdd = async (block: Block, option: QuickAddOption) => {
  const content = block.content as Block[] | undefined;
  const configuration = block.configuration as unknown as { columnWidths: number[] };
  const columnWidths = configuration.columnWidths ?? [];

  const emptyBlock = content?.find((b) => b.name === 'EmptyGridBlock');
  if (emptyBlock) {
    await addNewBlock(option.category, option.variationIndex, emptyBlock.meta.uuid, 'inside');
    return;
  }

  const maxColumnsPerRow = getMaxColumnsPerRow(columnWidths);
  const lastRow = getLastRow(columnWidths);

  if (lastRow.count < maxColumnsPerRow) {
    const newColCount = lastRow.count + 1;
    const equalWidth = Math.floor(12 / newColCount);
    for (let i = lastRow.startIndex; i < columnWidths.length; i++) {
      columnWidths[i] = equalWidth;
    }
    columnWidths.push(equalWidth);
  } else {
    columnWidths.push(12);
  }

  const newEmptyBlock = createEmptyGridBlock(columnWidths.length - 1);
  if (!block.content) block.content = [];
  (block.content as Block[]).push(newEmptyBlock as unknown as Block);

  await addNewBlock(option.category, option.variationIndex, newEmptyBlock.meta.uuid, 'inside');
};

const handleDefaultAdd = async (block: Block, option: QuickAddOption) => {
  const content = block.content as Block[] | undefined;
  if (!content || content.length === 0) return;
  const lastChild = content[content.length - 1];
  if (!lastChild) return;
  await addNewBlock(option.category, option.variationIndex, lastChild.meta.uuid, 'bottom');
};

const handleAdd = async (option: QuickAddOption) => {
  const block = getBlock();
  if (!block) return;

  if (isMultiGrid(block)) {
    await handleMultiGridAdd(block, option);
  } else {
    await handleDefaultAdd(block, option);
  }
};
</script>
