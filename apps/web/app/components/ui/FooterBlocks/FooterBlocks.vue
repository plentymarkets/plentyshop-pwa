<template>
  <EditableBlocks :blocks="footerBlocks" />
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';
import type { FooterSettings } from '~/components/blocks/Footer/types';

const { globalBlocksCache, updateGlobalBlocks } = useGlobalBlocks();
const { footerCache, updateFooterCache } = useFooter();

const footerBlocks = computed({
  get: () => {
    const filtered = globalBlocksCache.value?.filter((block: Block) => block.name === 'Footer') ?? [];

    if (filtered.length === 0 && globalBlocksCache.value !== null) {
      const defaultFooterBlock: Block = {
        name: 'Footer',
        type: 'content',
        meta: { uuid: uuid(), isGlobalTemplate: true },
        content: footerCache.value as FooterSettings,
      };
      return [defaultFooterBlock];
    }

    return filtered;
  },
  set: (newFooterBlocks: Block[]) => {
    if (!globalBlocksCache.value) return;

    const otherBlocks = globalBlocksCache.value.filter((b: Block) => b.name !== 'Footer');
    updateGlobalBlocks([...otherBlocks, ...newFooterBlocks]);

    const firstFooter = newFooterBlocks[0];
    if (firstFooter?.content) updateFooterCache(firstFooter.content as FooterSettings);
  },
});
</script>
