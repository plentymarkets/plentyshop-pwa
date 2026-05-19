import type { Block } from '@plentymarkets/shop-api';
import type { GridCell, GridRow } from './types';

export function computeGridRows(columnWidths: number[], blocks?: Block[]): GridRow[] {
  const slotBlockName: Map<number | undefined, string> | undefined = blocks
    ? new Map(blocks.filter((b) => b.name !== 'EmptyGridBlock').map((b) => [b.parent_slot, b.name]))
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
    const blockName = slotBlockName?.get(colIndex);
    cells.push({ colIndex, span, hasContent: !!blockName, blockName });
    used += span;
  });

  if (cells.length > 0) result.push({ cells, free: 12 - used });
  return result;
}
