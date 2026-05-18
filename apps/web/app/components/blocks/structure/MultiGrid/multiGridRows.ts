import type { Block } from '@plentymarkets/shop-api';
import type { GridCell, GridRow } from './types';

export function computeGridRows(columnWidths: number[], blocks?: Block[]): GridRow[] {
  const filledSlots = blocks
    ? new Set(blocks.filter((b) => b.name !== 'EmptyGridBlock').map((b) => b.parent_slot))
    : undefined;

  const result: GridRow[] = [];
  let cells: GridCell[] = [];
  let used = 0;

  columnWidths.forEach((span, colIndex) => {
    if (used + span > 12) {
      result.push({ cells, free: 12 - used });
      cells = [];
      used = 0;
    }
    cells.push({ colIndex, span, hasContent: filledSlots?.has(colIndex) ?? false });
    used += span;
  });

  if (cells.length > 0) result.push({ cells, free: 12 - used });
  return result;
}
