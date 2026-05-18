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

  it('should insert into the first EmptyGridBlock when one exists', async () => {
    const { addBlockToGrid } = useMultiGridQuickAdd();
    const block = {
      name: 'MultiGrid',
      type: 'structure',
      meta: { uuid: 'grid-uuid' },
      configuration: { columnWidths: [6, 6] },
      content: [
        { name: 'ImageBlock', meta: { uuid: 'block-1' }, parent_slot: 0 },
        { name: 'EmptyGridBlock', meta: { uuid: 'empty-1' }, parent_slot: 1 },
      ],
    } as unknown as Block;

    await addBlockToGrid(block, option);

    expect(mockAddNewBlock).toHaveBeenCalledWith('image', 0, 'empty-1', 'inside');
  });

  it('should fill the first empty slot when multiple exist', async () => {
    const { addBlockToGrid } = useMultiGridQuickAdd();
    const block = {
      name: 'MultiGrid',
      type: 'structure',
      meta: { uuid: 'grid-uuid' },
      configuration: { columnWidths: [4, 4, 4] },
      content: [
        { name: 'EmptyGridBlock', meta: { uuid: 'empty-1' }, parent_slot: 0 },
        { name: 'EmptyGridBlock', meta: { uuid: 'empty-2' }, parent_slot: 1 },
        { name: 'EmptyGridBlock', meta: { uuid: 'empty-3' }, parent_slot: 2 },
      ],
    } as unknown as Block;

    await addBlockToGrid(block, option);

    expect(mockAddNewBlock).toHaveBeenCalledWith('image', 0, 'empty-1', 'inside');
  });

  it('should add a new full-width row for a 2-column grid at max capacity', async () => {
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

  it('should add a new full-width row for a 3-column grid at max capacity', async () => {
    const { addBlockToGrid } = useMultiGridQuickAdd();
    const block = {
      name: 'MultiGrid',
      type: 'structure',
      meta: { uuid: 'grid-uuid' },
      configuration: { columnWidths: [4, 4, 4] },
      content: [
        { name: 'ImageBlock', meta: { uuid: 'block-1' }, parent_slot: 0 },
        { name: 'TextCard', meta: { uuid: 'block-2' }, parent_slot: 1 },
        { name: 'ImageBlock', meta: { uuid: 'block-3' }, parent_slot: 2 },
      ],
    } as unknown as Block;

    await addBlockToGrid(block, option);

    const config = block.configuration as unknown as { columnWidths: number[] };
    const content = block.content as Block[];
    expect(config.columnWidths).toEqual([4, 4, 4, 12]);
    expect(content).toHaveLength(4);
    expect(content[3]!.parent_slot).toBe(3);
    expect(mockAddNewBlock).toHaveBeenCalledWith('image', 0, content[3]!.meta.uuid, 'inside');
  });

  it('should grow a single colspan-12 row to colspan-6+6', async () => {
    const { addBlockToGrid } = useMultiGridQuickAdd();
    const block = {
      name: 'MultiGrid',
      type: 'structure',
      meta: { uuid: 'grid-uuid' },
      configuration: { columnWidths: [6, 6, 12] },
      content: [
        { name: 'ImageBlock', meta: { uuid: 'block-1' }, parent_slot: 0 },
        { name: 'TextCard', meta: { uuid: 'block-2' }, parent_slot: 1 },
        { name: 'ImageBlock', meta: { uuid: 'block-3' }, parent_slot: 2 },
      ],
    } as unknown as Block;

    await addBlockToGrid(block, option);

    const config = block.configuration as unknown as { columnWidths: number[] };
    const content = block.content as Block[];
    expect(config.columnWidths).toEqual([6, 6, 6, 6]);
    expect(content).toHaveLength(4);
    expect(content[3]!.name).toBe('EmptyGridBlock');
    expect(content[3]!.parent_slot).toBe(3);
    expect(mockAddNewBlock).toHaveBeenCalledWith('image', 0, content[3]!.meta.uuid, 'inside');
  });

  it('should grow a 3-column grid last row from colspan-12 toward max in steps', async () => {
    const { addBlockToGrid } = useMultiGridQuickAdd();
    const block = {
      name: 'MultiGrid',
      type: 'structure',
      meta: { uuid: 'grid-uuid' },
      configuration: { columnWidths: [4, 4, 4, 12] },
      content: [
        { name: 'ImageBlock', meta: { uuid: 'block-1' }, parent_slot: 0 },
        { name: 'TextCard', meta: { uuid: 'block-2' }, parent_slot: 1 },
        { name: 'ImageBlock', meta: { uuid: 'block-3' }, parent_slot: 2 },
        { name: 'ImageBlock', meta: { uuid: 'block-4' }, parent_slot: 3 },
      ],
    } as unknown as Block;

    await addBlockToGrid(block, option);

    const config = block.configuration as unknown as { columnWidths: number[] };
    expect(config.columnWidths).toEqual([4, 4, 4, 6, 6]);
  });

  it('should grow last row from 2 cols to 3 cols for a 3-column grid', async () => {
    const { addBlockToGrid } = useMultiGridQuickAdd();
    const block = {
      name: 'MultiGrid',
      type: 'structure',
      meta: { uuid: 'grid-uuid' },
      configuration: { columnWidths: [4, 4, 4, 6, 6] },
      content: [
        { name: 'ImageBlock', meta: { uuid: 'block-1' }, parent_slot: 0 },
        { name: 'TextCard', meta: { uuid: 'block-2' }, parent_slot: 1 },
        { name: 'ImageBlock', meta: { uuid: 'block-3' }, parent_slot: 2 },
        { name: 'ImageBlock', meta: { uuid: 'block-4' }, parent_slot: 3 },
        { name: 'TextCard', meta: { uuid: 'block-5' }, parent_slot: 4 },
      ],
    } as unknown as Block;

    await addBlockToGrid(block, option);

    const config = block.configuration as unknown as { columnWidths: number[] };
    const content = block.content as Block[];
    expect(config.columnWidths).toEqual([4, 4, 4, 4, 4, 4]);
    expect(content).toHaveLength(6);
    expect(content[5]!.parent_slot).toBe(5);
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
});
