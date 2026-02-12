<template>
  <EditableBlocks :blocks="footerBlocks" />
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';
import type { Ref } from 'vue';

// Footer blocks are global, fetched from homepage and cached
const { globalBlocksCache, updateGlobalBlocks } = useGlobalBlocks();

// Create a writable computed that filters footer blocks and syncs back to cache
const footerBlocks: Ref<Block[]> = computed({
  get: () => globalBlocksCache.value?.filter((block: Block) => block.name === 'Footer') ?? [],
  set: (newFooterBlocks: Block[]) => {
    if (!globalBlocksCache.value) return;

    // Preserve non-footer blocks and merge with new footer blocks
    const otherBlocks = globalBlocksCache.value.filter((b: Block) => b.name !== 'Footer');
    updateGlobalBlocks([...otherBlocks, ...newFooterBlocks]);
  },
});
</script>
