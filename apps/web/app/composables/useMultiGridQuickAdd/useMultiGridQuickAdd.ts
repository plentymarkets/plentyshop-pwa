import type { Block } from '@plentymarkets/shop-api';
import type { QuickAddOption } from '~/components/editor/QuickAdd/types';
import type { RowInfo } from './types';

const calculateMaxColumnsPerRow = (columnWidths: number[]): number => {
  let maxCols = 0;
  let count = 0;
  let used = 0;

  for (const span of columnWidths) {
    if (used + span > 12) {
      if (used === 12) maxCols = Math.max(maxCols, count);
      count = 0;
      used = 0;
    }
    count++;
    used += span;
  }

  if (used === 12) maxCols = Math.max(maxCols, count);
  return maxCols > 1 ? maxCols : 2;
};

const findLastRow = (columnWidths: number[]): RowInfo => {
  let startIndex = 0;
  let used = 0;

  for (let i = 0; i < columnWidths.length; i++) {
    if (used + columnWidths[i]! > 12) {
      startIndex = i;
      used = 0;
    }
    used += columnWidths[i]!;
  }

  return { startIndex, count: columnWidths.length - startIndex };
};

const isLastRowFull = (columnWidths: number[]): boolean => {
  const maxColumns = calculateMaxColumnsPerRow(columnWidths);
  const lastRow = findLastRow(columnWidths);
  return lastRow.count >= maxColumns;
};

const growLastRow = (columnWidths: number[]): void => {
  const lastRow = findLastRow(columnWidths);
  const newColCount = lastRow.count + 1;
  const equalWidth = Math.floor(12 / newColCount);

  for (let i = lastRow.startIndex; i < columnWidths.length; i++) {
    columnWidths[i] = equalWidth;
  }
  columnWidths.push(equalWidth);
};

const addNewFullWidthRow = (columnWidths: number[]): void => {
  columnWidths.push(12);
};

const findFirstEmptySlot = (content: Block[] | undefined): Block | undefined => {
  return content?.find((b) => b.name === 'EmptyGridBlock');
};

export const useMultiGridQuickAdd = () => {
  const { addNewBlock } = useBlockManager();

  const insertIntoEmptySlot = async (emptyBlock: Block, option: QuickAddOption) => {
    await addNewBlock(option.category, option.variationIndex, emptyBlock.meta.uuid, 'inside');
  };

  const addBlockToGrid = async (block: Block, option: QuickAddOption) => {
    const content = block.content as Block[] | undefined;
    const configuration = block.configuration as unknown as { columnWidths: number[] };
    const columnWidths = configuration.columnWidths ?? [];

    const emptySlot = findFirstEmptySlot(content);
    if (emptySlot) {
      await insertIntoEmptySlot(emptySlot, option);
      return;
    }

    if (isLastRowFull(columnWidths)) {
      addNewFullWidthRow(columnWidths);
    } else {
      growLastRow(columnWidths);
    }

    const newEmptyBlock = createEmptyGridBlock(columnWidths.length - 1);
    if (!block.content) block.content = [];
    (block.content as Block[]).push(newEmptyBlock as unknown as Block);

    await addNewBlock(option.category, option.variationIndex, newEmptyBlock.meta.uuid, 'inside');
  };

  /**
   * Adds a structural row to the grid without inserting a content block.
   * Grows the last row if possible, otherwise adds a new full-width row.
   */
  const addRowToGrid = (block: Block) => {
    const configuration = block.configuration as unknown as { columnWidths: number[] };
    const columnWidths = configuration.columnWidths ?? [];

    if (isLastRowFull(columnWidths)) {
      addNewFullWidthRow(columnWidths);
    } else {
      growLastRow(columnWidths);
    }

    const newEmptyBlock = createEmptyGridBlock(columnWidths.length - 1);
    if (!block.content) block.content = [];
    (block.content as Block[]).push(newEmptyBlock as unknown as Block);
  };

  return { addBlockToGrid, addRowToGrid };
};
