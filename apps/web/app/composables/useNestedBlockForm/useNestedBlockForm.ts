export const useNestedBlockForm = (uuid?: MaybeRefOrGetter<string | undefined>) => {
  const { nextEditBlock } = useBlockEditStack();
  const editingBlock = nextEditBlock(uuid ?? ref(undefined));

  const blockForm = computed(() => {
    if (!editingBlock.value) return null;
    const loader = getBlockFormLoader(editingBlock.value.name);
    return loader ? defineAsyncComponent(loader) : null;
  });

  return { editingBlock, blockForm };
};
