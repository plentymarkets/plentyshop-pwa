import { describe, it, expect, vi } from 'vitest';
import type { Block, GetBlocksResponse } from '@plentymarkets/shop-api';
import { isFooterBlock, isHeaderBlock, isGlobalBlock, normalizeFooter, assembleBlocks } from '../block-helpers';

vi.mock('~/utils/migrate-blocks', () => ({
  migrateAllBlocks: vi.fn(),
}));

const makeBlock = (name: string, content: unknown = {}): Block =>
  ({ name, type: 'content', meta: { uuid: `${name}-uuid` }, content }) as unknown as Block;

describe('utils/block-helpers', () => {
  describe('isFooterBlock', () => {
    it('should return true for a block named Footer', () => {
      expect(isFooterBlock(makeBlock('Footer'))).toBe(true);
    });

    it('should return false for other block names', () => {
      expect(isFooterBlock(makeBlock('Header'))).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isFooterBlock(null)).toBe(false);
      expect(isFooterBlock(undefined)).toBe(false);
    });
  });

  describe('isHeaderBlock', () => {
    it('should return true for a block named Header', () => {
      expect(isHeaderBlock(makeBlock('Header'))).toBe(true);
    });

    it('should return false for other block names', () => {
      expect(isHeaderBlock(makeBlock('Footer'))).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isHeaderBlock(null)).toBe(false);
      expect(isHeaderBlock(undefined)).toBe(false);
    });
  });

  describe('isGlobalBlock', () => {
    it('should return true for Footer blocks', () => {
      expect(isGlobalBlock(makeBlock('Footer'))).toBe(true);
    });

    it('should return true for HeaderContainer blocks', () => {
      const block = makeBlock('HeaderContainer');
      block.type = 'structure';
      expect(isGlobalBlock(block)).toBe(true);
    });

    it('should return false for blocks with other names', () => {
      expect(isGlobalBlock(makeBlock('TextCard'))).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isGlobalBlock(null)).toBe(false);
      expect(isGlobalBlock(undefined)).toBe(false);
    });
  });

  describe('normalizeFooter', () => {
    it('should merge custom content with defaults', () => {
      const input = makeBlock('Footer', {
        column1: { title: 'Custom Legal' },
      });
      const result = normalizeFooter(input);
      const content = result.content as Record<string, Record<string, unknown>>;

      expect(content.column1?.title).toBe('Custom Legal');
      expect(content.column2).toBeDefined();
      expect(content.column3).toBeDefined();
      expect(content.column4).toBeDefined();
      expect(content.colors).toBeDefined();
    });

    it('should preserve custom meta and merge with defaults', () => {
      const input = makeBlock('Footer', {});
      input.meta = { uuid: 'custom-uuid', isGlobalTemplate: true };
      const result = normalizeFooter(input);

      expect(result.meta.uuid).toBe('custom-uuid');
      expect(result.meta.isGlobalTemplate).toBe(true);
    });

    it('should handle block with no content', () => {
      const input = { name: 'Footer', type: 'content', meta: { uuid: 'f' } } as unknown as Block;
      const result = normalizeFooter(input);
      const content = result.content as Record<string, unknown>;

      expect(content.column1).toBeDefined();
      expect(content.colors).toBeDefined();
    });
  });

  describe('assembleBlocks', () => {
    it('should use provided HeaderContainer and Footer when present', () => {
      const header = makeBlock('HeaderContainer');
      header.type = 'structure';
      header.content = [makeBlock('Navigation')];
      const footer = makeBlock('Footer', {
        column1: { title: 'Legal' },
        column2: { title: 'Services' },
        column3: { title: 'About' },
        column4: { title: 'Help' },
        colors: {},
      });
      const pageBlocks = [makeBlock('TextCard')];

      const raw = { HeaderContainer: header, Footer: footer, blocks: pageBlocks } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'immutable', 'index');

      expect(result.HeaderContainer).toBe(header);
      expect(result.blocks).toBe(pageBlocks);
      expect(result.Footer).toBeDefined();
      expect(result.Footer?.name).toBe('Footer');
    });

    it('should create default HeaderContainer when raw has none', () => {
      const raw = { blocks: [makeBlock('TextCard')] } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'immutable', 'index');

      expect(result.HeaderContainer).toBeDefined();
    });

    it('should create default Footer when raw has none', () => {
      const raw = { blocks: [makeBlock('TextCard')] } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'immutable', 'index');

      expect(result.Footer).toBeDefined();
      expect(result.Footer?.name).toBe('Footer');
    });

    it('should use homepage factory blocks when raw blocks are empty for immutable type', () => {
      const raw = { blocks: [] } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'immutable', 'index');

      expect(result.blocks.length).toBeGreaterThan(0);
      expect(result.blocks[0]?.name).toBe('Carousel');
    });

    it('should use category factory blocks when identifier is not a positive number', () => {
      const raw = { blocks: [] } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'category', 'slug');

      expect(result.blocks.length).toBeGreaterThan(0);
      expect(result.blocks[0]?.name).toBe('CategoryData');
    });

    it('should return empty blocks for category with positive numeric identifier', () => {
      const raw = { blocks: [] } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'category', 5);

      expect(result.blocks).toEqual([]);
    });

    it('should use product factory blocks when raw blocks are empty', () => {
      const raw = { blocks: [] } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'product', 'test');

      expect(result.blocks.length).toBeGreaterThan(0);
      expect(result.blocks[0]?.name).toBe('MultiGrid');
    });

    it('should return empty blocks for unknown type with no raw blocks', () => {
      const raw = { blocks: [] } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'unknown', 'x');

      expect(result.blocks).toEqual([]);
    });

    it('should handle completely empty raw response', () => {
      const raw = {} as GetBlocksResponse;
      const result = assembleBlocks(raw, 'immutable', 'index');

      expect(result.HeaderContainer).toBeDefined();
      expect(result.Footer).toBeDefined();
      expect(result.blocks.length).toBeGreaterThan(0);
      expect(result.blocks[0]?.name).toBe('Carousel');
    });
  });
});
