import { describe, expect, it } from 'vitest';
import type { Block } from '@plentymarkets/shop-api';
import { getLeastPopulatedColumn } from '../blocks/get-least-populated-column';

const createBlock = (parentSlot: number): Block => ({ parent_slot: parentSlot }) as unknown as Block;

describe('getLeastPopulatedColumn', () => {
  it('should return 0 when content is empty', () => {
    expect(getLeastPopulatedColumn([], 3)).toBe(0);
  });

  it('should return the column with the fewest blocks', () => {
    const content = [createBlock(0), createBlock(0), createBlock(1)];
    expect(getLeastPopulatedColumn(content, 3)).toBe(2);
  });

  it('should return the first least populated column when there is a tie', () => {
    const content = [createBlock(0), createBlock(1)];
    expect(getLeastPopulatedColumn(content, 3)).toBe(2);
  });

  it('should handle all blocks in one column', () => {
    const content = [createBlock(0), createBlock(0), createBlock(0)];
    expect(getLeastPopulatedColumn(content, 2)).toBe(1);
  });

  it('should ignore blocks with parent_slot >= numColumns', () => {
    const content = [createBlock(5), createBlock(0)];
    expect(getLeastPopulatedColumn(content, 2)).toBe(1);
  });

  it('should treat undefined parent_slot as 0', () => {
    const content = [{ parent_slot: undefined } as unknown as Block];
    expect(getLeastPopulatedColumn(content, 2)).toBe(1);
  });

  it('should work with a single column', () => {
    const content = [createBlock(0), createBlock(0)];
    expect(getLeastPopulatedColumn(content, 1)).toBe(0);
  });

  it('should distribute evenly and return first empty column', () => {
    const content = [createBlock(0), createBlock(1), createBlock(2)];
    expect(getLeastPopulatedColumn(content, 4)).toBe(3);
  });
});
