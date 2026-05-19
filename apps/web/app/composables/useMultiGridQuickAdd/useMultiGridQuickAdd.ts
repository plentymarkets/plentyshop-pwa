import type { Block } from '@plentymarkets/shop-api';
import type { QuickAddOption } from '~/components/editor/QuickAdd/types';

export const useMultiGridQuickAdd = () => {
  const { addNewBlock } = useBlockManager();

  const addBlockToGrid = async (block: Block, option: QuickAddOption) => {
    const configuration = block.configuration as unknown as { columnWidths: number[] };
    if (!configuration.columnWidths) configuration.columnWidths = [];

    configuration.columnWidths.push(12);

    const newEmptyBlock: Block = createEmptyGridBlock(configuration.columnWidths.length - 1) as Block;
    if (!block.content) block.content = [];
    (block.content as Block[]).push(newEmptyBlock);

    await addNewBlock(option.category, option.variationIndex, newEmptyBlock.meta.uuid, 'inside');
  };

  const addRowToGrid = (block: Block) => {
    const configuration = block.configuration as unknown as { columnWidths: number[] };
    if (!configuration.columnWidths) configuration.columnWidths = [];

    configuration.columnWidths.push(12);

    const newEmptyBlock: Block = createEmptyGridBlock(configuration.columnWidths.length - 1) as Block;
    if (!block.content) block.content = [];
    (block.content as Block[]).push(newEmptyBlock);
  };

  return { addBlockToGrid, addRowToGrid };
};
