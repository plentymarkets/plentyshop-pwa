import { describe, it, expect } from 'vitest';
import type { Block } from '@plentymarkets/shop-api';
import type { BlocksList } from '~/composables/useBlocksList/types';
import { filterBlocksForContext, getBlockAccessMap } from '../block-access';

const block = (name: string, content: unknown = [], parentSlot?: number): Block =>
  ({ name, type: 'content', meta: { uuid: name }, content, parent_slot: parentSlot }) as unknown as Block;

const list = (blockName: string, accessControl: string[], names: string[]) => ({
  title: blockName,
  category: blockName,
  blockName,
  accessControl,
  variations: names.map((name) => ({ title: name, template: { en: { name }, de: { name } } })),
});

const blocksLists = {
  'item-page': list('ItemPage', ['product'], ['PriceCard']),
  image: list('Image', ['content', 'productCategory', 'product'], ['MultiGrid', 'Image']),
} as unknown as BlocksList;

const accessMap = getBlockAccessMap(blocksLists);
const supported = (name: string) => name !== 'Unknown';

describe('block-access', () => {
  it('should key access by variation template name instead of the category blockName', () => {
    expect(accessMap.get('PriceCard')).toEqual(['product']);
    expect(accessMap.has('ItemPage')).toBe(false);
  });

  it('should skip blocks the target context has no access to', () => {
    const result = filterBlocksForContext(
      [block('PriceCard'), block('Image')],
      'productCategory',
      accessMap,
      supported,
    );
    expect(result.blocks.map((b) => b.name)).toEqual(['Image']);
    expect(result.entries.flatMap((entry) => entry.skipped)).toEqual(['PriceCard']);
  });

  it('should keep blocks that are allowed in the target context', () => {
    const result = filterBlocksForContext([block('PriceCard')], 'product', accessMap, supported);
    expect(result.blocks).toHaveLength(1);
    expect(result.entries.flatMap((entry) => entry.skipped)).toEqual([]);
  });

  it('should skip blocks without a loader', () => {
    const result = filterBlocksForContext([block('Unknown')], 'content', accessMap, supported);
    expect(result.blocks).toEqual([]);
    expect(result.entries.flatMap((entry) => entry.skipped)).toEqual(['Unknown']);
  });

  it('should keep blocks that are in no block list but have a loader', () => {
    const result = filterBlocksForContext([block('Carousel')], 'content', accessMap, supported);
    expect(result.blocks).toHaveLength(1);
  });

  it('should replace a removed nested block with an empty grid slot', () => {
    const grid = block('MultiGrid', [block('PriceCard', [], 1), block('EmptyGridBlock', [], 0)]);

    const result = filterBlocksForContext([grid], 'content', accessMap, supported);

    const children = result.blocks[0]?.content as Block[];
    expect(children.map((b) => [b.name, b.parent_slot])).toEqual([
      ['EmptyGridBlock', 1],
      ['EmptyGridBlock', 0],
    ]);
    expect(result.entries.flatMap((entry) => entry.skipped)).toEqual(['PriceCard']);
  });

  it('should not check access when the context is unknown', () => {
    const result = filterBlocksForContext([block('PriceCard')], '', accessMap, supported);
    expect(result.blocks).toHaveLength(1);
  });

  it('should report compatible, partial and incompatible top-level blocks', () => {
    const grid = block('MultiGrid', [block('PriceCard', [], 0), block('Image', [], 1)]);

    const result = filterBlocksForContext([block('Image'), grid, block('PriceCard')], 'content', accessMap, supported);

    expect(result.entries).toEqual([
      { name: 'Image', status: 'compatible', skipped: [] },
      { name: 'MultiGrid', status: 'partial', skipped: ['PriceCard'] },
      { name: 'PriceCard', status: 'incompatible', skipped: ['PriceCard'] },
    ]);
  });
});
