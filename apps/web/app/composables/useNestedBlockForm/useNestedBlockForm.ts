import type { Block } from '@plentymarkets/shop-api';

export const useNestedBlockForm = () => {
  const editingBlock = ref<Block | null>(null);

  const blockForm = computed(() => {
    if (!editingBlock.value) return null;
    const loader = getBlockFormLoader(editingBlock.value.name);
    return loader ? defineAsyncComponent(loader) : null;
  });

  return { editingBlock, blockForm };
};
