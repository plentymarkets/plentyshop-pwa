import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';
import type { UseColumnStickyReturn } from './types';

export const useColumnSticky: UseColumnStickyReturn = (parentUuid) => {
  const { allBlocks } = useBlocks();
  const { findOrDeleteBlockByUuid } = useBlockManager();

  const structure = computed(() => {
    const uuid = toValue(parentUuid);
    if (!uuid) return undefined;
    return findOrDeleteBlockByUuid(allBlocks.value, uuid) as ColumnBlock | undefined;
  });

  const isSticky = (columnIndex: number): boolean => {
    const sticky = structure.value?.configuration?.sticky;
    return Array.isArray(sticky) && sticky.includes(columnIndex);
  };

  const toggleSticky = (columnIndex: number) => {
    const target = structure.value;
    if (!target) {
      return;
    }
    if (!Array.isArray(target.configuration.sticky)) {
      target.configuration.sticky = [];
    }
    const position = target.configuration.sticky.indexOf(columnIndex);
    if (position === -1) {
      target.configuration.sticky.push(columnIndex);
    } else {
      target.configuration.sticky.splice(position, 1);
    }
  };

  return { isSticky, toggleSticky };
};
