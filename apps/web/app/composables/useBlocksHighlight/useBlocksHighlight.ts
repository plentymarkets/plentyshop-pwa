import type { Block } from '@plentymarkets/shop-api';
import type { ComputedRef } from 'vue';

export const useBlocksHighlight = (blocks: ComputedRef<Block[]>) => {
  const { scrollToBlock, highlightedUuid } = useTableOfContents();

  const currentActiveBlockIndex = ref<number>(-1);
  const previousBlocksLength = ref(blocks.value.length);

  const hasValidActiveBlock = computed(
    () => currentActiveBlockIndex.value >= 0 && currentActiveBlockIndex.value < blocks.value.length,
  );

  const selectBlock = (index: number) => {
    currentActiveBlockIndex.value = index;
    const block = blocks.value[index];
    if (block) {
      scrollToBlock(block.meta.uuid);
    }
  };

  const highlightActiveBlock = () => {
    if (hasValidActiveBlock.value) {
      const activeBlock = blocks.value[currentActiveBlockIndex.value];
      if (activeBlock) {
        scrollToBlock(activeBlock.meta.uuid);
      }
    }
  };

  const clearSelection = () => {
    highlightedUuid.value = '';
    currentActiveBlockIndex.value = -1;
  };

  watch(
    () => blocks.value.map((block) => block.meta.uuid),
    (newUuids, oldUuids) => {
      if (newUuids.length > previousBlocksLength.value) {
        const oldSet = new Set(oldUuids ?? []);
        const addedUuid = newUuids.find((id) => !oldSet.has(id));
        const addedIndex = addedUuid
          ? blocks.value.findIndex((block) => block.meta.uuid === addedUuid)
          : blocks.value.length - 1;
        selectBlock(addedIndex);
      }

      previousBlocksLength.value = newUuids.length;
    },
  );

  onBeforeUnmount(() => {
    clearSelection();
  });

  return {
    currentActiveBlockIndex,
    hasValidActiveBlock,
    selectBlock,
    highlightActiveBlock,
    clearSelection,
  };
};
