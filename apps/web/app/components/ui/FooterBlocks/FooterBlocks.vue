<template>
  <EditableBlocks :blocks="footerBlocks" />
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';
import type { FooterSettings } from '~/components/blocks/Footer/types';

const { globalBlocksCache, updateGlobalBlocks } = useGlobalBlocks();
const { updateFooterCache } = useFooter();

const footerBlocks = computed({
  get: () => {
    const filtered = globalBlocksCache.value?.filter((block: Block) => block.name === 'Footer') ?? [];
    return filtered;
  },
  set: (newFooterBlocks: Block[]) => {
    if (newFooterBlocks.length > 0 && newFooterBlocks[0]) {
      updateFooterCache(newFooterBlocks[0].content as FooterSettings);
    }

    if (globalBlocksCache.value !== null) {
      const otherBlocks = globalBlocksCache.value.filter((b: Block) => b.name !== 'Footer');
      updateGlobalBlocks([...otherBlocks, ...newFooterBlocks]);
    }
  },
});
</script>
