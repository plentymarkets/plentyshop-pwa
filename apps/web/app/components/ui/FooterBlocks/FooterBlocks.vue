<template>
  <EditableBlocks :blocks="footerBlocks" />
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';

const { globalBlocksCache, updateGlobalBlocks } = useGlobalBlocks();

const footerBlocks = computed({
  get: () => {
    const filtered = globalBlocksCache.value?.filter((block: Block) => block.name === 'Footer') ?? [];
    return filtered;
  },
  set: (newFooterBlocks: Block[]) => {
    if (!globalBlocksCache.value) return;

    const otherBlocks = globalBlocksCache.value.filter((b: Block) => b.name !== 'Footer');
    updateGlobalBlocks([...otherBlocks, ...newFooterBlocks]);
  },
});
</script>
