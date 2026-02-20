<template>
  <EditableBlocks :blocks="footerBlocks" />
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';

const { globalBlocksCache, updateGlobalBlocks } = useGlobalBlocks();
const { footerCache } = useFooter();

const footerBlocks = computed({
  get: () => {
    return [footerCache.value as Block];
  },
  set: (newFooterBlocks: Block[]) => {
    if (!globalBlocksCache.value) return;

    const otherBlocks = globalBlocksCache.value.filter((b: Block) => b.name !== 'Footer');
    updateGlobalBlocks([...otherBlocks, ...newFooterBlocks]);
  },
});
</script>
