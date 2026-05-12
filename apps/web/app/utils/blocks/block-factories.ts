import type { Block } from '@plentymarkets/shop-api';

export const createMultiGridBlock = (columnWidths: readonly number[]): Block => ({
  name: 'MultiGrid',
  type: 'structure',
  meta: { uuid: '' },
  configuration: {
    visible: true,
    columnWidths: [...columnWidths],
    layout: { fullWidth: false },
  },
  content: columnWidths.map((_, i): Block => ({
    name: 'EmptyGridBlock',
    type: 'content',
    meta: { uuid: '' },
    parent_slot: i,
    content: [],
  })),
});
