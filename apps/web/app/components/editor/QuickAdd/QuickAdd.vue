<template>
  <div v-if="isEnabled && options.length" class="flex flex-wrap justify-center gap-1.5 px-4">
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

const props = defineProps<QuickAddProps>();

const { blockUuid } = useSiteConfiguration();
const { allBlocks } = useBlocks();
const { findOrDeleteBlockByUuid, addNewBlock } = useBlockManager();
const { addBlockToGrid, addRowToGrid } = useMultiGridQuickAdd();

const getBlock = () => {
  const uuid = props.blockUuid || blockUuid.value;
  if (!uuid) return undefined;
  return findOrDeleteBlockByUuid(allBlocks.value, uuid) ?? undefined;
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

  if (block.name === 'MultiGrid') {
    if (option.type === 'row') {
      addRowToGrid(block);
    } else {
      await addBlockToGrid(block, option);
    }
  } else {
    await handleDefaultAdd(block, option);
  }
};
</script>
