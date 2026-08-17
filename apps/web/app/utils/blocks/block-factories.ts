import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuidv4 } from 'uuid';

export const createMultiGridBlock = (columnWidths: readonly number[]): Block => ({
  name: 'MultiGrid',
  type: 'structure',
  meta: { uuid: '' },
  configuration: {
    visible: true,
    columnWidths: [...columnWidths],
    layout: { fullWidth: false },
  },
  content: columnWidths.map(
    (_, i): Block => ({
      name: 'EmptyGridBlock',
      type: 'content',
      meta: { uuid: '' },
      parent_slot: i,
      content: [],
    }),
  ),
});

export const createEmptyGridBlock = (parentSlot: number) => ({
  name: 'EmptyGridBlock' as const,
  type: 'content' as const,
  content: [] as never[],
  meta: { uuid: uuidv4() },
  parent_slot: parentSlot,
});
