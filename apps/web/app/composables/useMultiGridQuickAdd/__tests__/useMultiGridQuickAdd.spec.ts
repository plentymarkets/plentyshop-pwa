import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useMultiGridQuickAdd } from '../useMultiGridQuickAdd';
import type { Block } from '@plentymarkets/shop-api';

let emptyGridBlockCounter = 0;
mockNuxtImport('createEmptyGridBlock', () => (parentSlot: number) => ({
  name: 'EmptyGridBlock',
  type: 'content',
  content: [],
  meta: { uuid: `empty-grid-${emptyGridBlockCounter++}` },
  parent_slot: parentSlot,
}));

const mockAddNewBlock = vi.fn();
mockNuxtImport('useBlockManager', () => () => ({
  addNewBlock: mockAddNewBlock,
}));

describe('useMultiGridQuickAdd', () => {
  const option = { blockName: 'Image', label: 'Image', category: 'image', variationIndex: 0 };

  beforeEach(() => {
    mockAddNewBlock.mockReset();
    emptyGridBlockCounter = 0;
  });

  describe('addBlockToGrid', () => {
    it('should always add a new col-12 row and insert the block', async () => {
      const { addBlockToGrid } = useMultiGridQuickAdd();
      const block = {
        name: 'MultiGrid',
        type: 'structure',
        meta: { uuid: 'grid-uuid' },
        configuration: { columnWidths: [6, 6] },
        content: [
          { name: 'ImageBlock', meta: { uuid: 'block-1' }, parent_slot: 0 },
          { name: 'TextCard', meta: { uuid: 'block-2' }, parent_slot: 1 },
        ],
      } as unknown as Block;

      await addBlockToGrid(block, option);

      const config = block.configuration as unknown as { columnWidths: number[] };
      const content = block.content as Block[];
      expect(config.columnWidths).toEqual([6, 6, 12]);
      expect(content).toHaveLength(3);
      expect(content[2]!.name).toBe('EmptyGridBlock');
      expect(content[2]!.parent_slot).toBe(2);
      expect(mockAddNewBlock).toHaveBeenCalledWith('image', 0, content[2]!.meta.uuid, 'inside');
    });

    it('should handle block with no content array', async () => {
      const { addBlockToGrid } = useMultiGridQuickAdd();
      const block = {
        name: 'MultiGrid',
        type: 'structure',
        meta: { uuid: 'grid-uuid' },
        configuration: { columnWidths: [6, 6] },
        content: undefined,
      } as unknown as Block;

      await addBlockToGrid(block, option);

      const config = block.configuration as unknown as { columnWidths: number[] };
      const content = block.content as Block[];
      expect(config.columnWidths).toEqual([6, 6, 12]);
      expect(content).toHaveLength(1);
      expect(mockAddNewBlock).toHaveBeenCalled();
    });

    it('should handle block with no columnWidths', async () => {
      const { addBlockToGrid } = useMultiGridQuickAdd();
      const block = {
        name: 'MultiGrid',
        type: 'structure',
        meta: { uuid: 'grid-uuid' },
        configuration: {},
        content: [],
      } as unknown as Block;

      await addBlockToGrid(block, option);

      const config = block.configuration as unknown as { columnWidths: number[] };
      const content = block.content as Block[];
      expect(config.columnWidths).toEqual([12]);
      expect(content).toHaveLength(1);
      expect(content[0]!.name).toBe('EmptyGridBlock');
      expect(mockAddNewBlock).toHaveBeenCalledWith('image', 0, content[0]!.meta.uuid, 'inside');
    });
  });

  describe('addRowToGrid', () => {
    it('should add a new col-12 row with an EmptyGridBlock', () => {
      const { addRowToGrid } = useMultiGridQuickAdd();
      const block = {
        name: 'MultiGrid',
        type: 'structure',
        meta: { uuid: 'grid-uuid' },
        configuration: { columnWidths: [6, 6] },
        content: [
          { name: 'ImageBlock', meta: { uuid: 'block-1' }, parent_slot: 0 },
          { name: 'TextCard', meta: { uuid: 'block-2' }, parent_slot: 1 },
        ],
      } as unknown as Block;

      addRowToGrid(block);

      const config = block.configuration as unknown as { columnWidths: number[] };
      const content = block.content as Block[];
      expect(config.columnWidths).toEqual([6, 6, 12]);
      expect(content).toHaveLength(3);
      expect(content[2]!.name).toBe('EmptyGridBlock');
      expect(content[2]!.parent_slot).toBe(2);
    });

    it('should not call addNewBlock (structural only)', () => {
      const { addRowToGrid } = useMultiGridQuickAdd();
      const block = {
        name: 'MultiGrid',
        type: 'structure',
        meta: { uuid: 'grid-uuid' },
        configuration: { columnWidths: [6, 6] },
        content: [
          { name: 'ImageBlock', meta: { uuid: 'block-1' }, parent_slot: 0 },
          { name: 'TextCard', meta: { uuid: 'block-2' }, parent_slot: 1 },
        ],
      } as unknown as Block;

      addRowToGrid(block);

      expect(mockAddNewBlock).not.toHaveBeenCalled();
    });
  });
});
