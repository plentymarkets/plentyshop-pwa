import type { Block } from '@plentymarkets/shop-api';

/**
 * Returns the 0-based column index with the fewest blocks.
 * Useful for distributing new blocks evenly across MultiGrid columns.
 */
export const getLeastPopulatedColumn = (content: Block[], numColumns: number): number => {
  const columnCounts = new Array(numColumns).fill(0) as number[];
  if (numColumns <= 0) {
    return 0;
  }

  for (const block of content) {
    const slot = block.parent_slot ?? 0;
    if (slot < numColumns && columnCounts[slot] !== undefined) {
      columnCounts[slot]++;
    }
  }

  return columnCounts.indexOf(Math.min(...columnCounts));
};
