import type { Block } from '@plentymarkets/shop-api';
import type { VisibleGridState } from './types';

export function computeVisibleGrid(blocks: Block[], columnWidths: number[]): VisibleGridState {
  const invisibleSlots = new Set<number>();
  blocks.forEach((block) => {
    if ((block.configuration as Record<string, unknown>)?.visible === false && block.parent_slot !== undefined) {
      invisibleSlots.add(block.parent_slot);
    }
  });

  const filteredToOriginal: number[] = [];
  for (let slotIndex = 0; slotIndex < columnWidths.length; slotIndex++) {
    if (!invisibleSlots.has(slotIndex)) filteredToOriginal.push(slotIndex);
  }

  const originalToFiltered: Record<number, number> = {};
  filteredToOriginal.forEach((originalIndex, filteredIndex) => {
    originalToFiltered[originalIndex] = filteredIndex;
  });

  const visibleColumnWidths = filteredToOriginal.map((originalIndex) => columnWidths[originalIndex] ?? 0);

  const visibleBlocks = blocks
    .filter((block) => block.parent_slot === undefined || !invisibleSlots.has(block.parent_slot))
    .map((block) =>
      block.parent_slot !== undefined
        ? { ...block, parent_slot: originalToFiltered[block.parent_slot] ?? block.parent_slot }
        : { ...block },
    ) as Block[];

  return { filteredToOriginal, originalToFiltered, columnWidths: visibleColumnWidths, blocks: visibleBlocks };
}
