import type { Block } from '@plentymarkets/shop-api';

export const useBlockEditStack = () => {
  const stack = useState<Block[]>('block-edit-stack', () => []);
  const { setEditTitle, clearEditTitle } = useBlockEditTitle();

  const syncTitle = () => {
    const topBlock = stack.value[stack.value.length - 1];

    if (topBlock) {
      setEditTitle(getBlockDisplayName(topBlock.name), topBlock.meta.uuid);
    } else {
      clearEditTitle();
    }
  };

  const pushEdit = (block: Block) => {
    stack.value = [...stack.value, block];
    syncTitle();
  };

  const popEdit = (): boolean => {
    if (stack.value.length === 0) {
      return false;
    }

    stack.value = stack.value.slice(0, -1);
    syncTitle();

    return true;
  };

  const clearStack = () => {
    if (stack.value.length === 0) {
      return;
    }

    stack.value = [];
    clearEditTitle();
  };

  const nextEditBlock = (parentUuid: MaybeRefOrGetter<string | undefined>) =>
    computed<Block | null>(() => {
      const value = toValue(parentUuid);
      const idx = value ? stack.value.findIndex((b) => b.meta.uuid === value) : -1;
      return stack.value[idx + 1] ?? null;
    });

  return { stack, pushEdit, popEdit, clearStack, nextEditBlock };
};
