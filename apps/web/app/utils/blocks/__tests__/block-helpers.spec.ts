import { describe, it, expect, vi } from 'vitest';
import type { Block, GetBlocksResponse } from '@plentymarkets/shop-api';
import { isHeaderBlock, isGlobalBlock, assembleBlocks } from '../block-helpers';

vi.mock('~/utils/migrate-blocks', () => ({
  migrateAllBlocks: vi.fn(),
}));

const makeBlock = (name: string, content: unknown = {}): Block => ({
  name,
  type: 'content',
  meta: { uuid: `${name}-uuid` },
  content,
});

const makeStructureBlock = (name: string, content: Block[] = []): Block => ({
  name,
  type: 'structure',
  meta: { uuid: `${name}-uuid` },
  content,
});

describe('utils/block-helpers', () => {
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
    it('should return true for FooterContainer blocks', () => {
      expect(isGlobalBlock(makeStructureBlock('FooterContainer'))).toBe(true);
    });

    it('should return true for HeaderContainer blocks', () => {
      expect(isGlobalBlock(makeStructureBlock('HeaderContainer', [makeBlock('Navigation')]))).toBe(true);
    });

    it('should return false for blocks with other names', () => {
      expect(isGlobalBlock(makeBlock('TextCard'))).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isGlobalBlock(null)).toBe(false);
      expect(isGlobalBlock(undefined)).toBe(false);
    });
  });

  describe('assembleBlocks', () => {
    it('should use provided HeaderContainer and FooterContainer when present', () => {
      const header = makeStructureBlock('HeaderContainer', [makeBlock('Navigation')]);
      const footer = makeStructureBlock('FooterContainer', [makeBlock('MultiGrid')]);
      const pageBlocks = [makeBlock('TextCard')];

      const raw = { HeaderContainer: header, Footer: footer, blocks: pageBlocks } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'immutable', 'index');

      expect(result.HeaderContainer).toBe(header);
      expect(result.blocks).toBe(pageBlocks);
      expect(result.Footer).toBeDefined();
      expect(result.Footer?.name).toBe('FooterContainer');
    });

    it('should create default HeaderContainer when raw has none', () => {
      const raw = { blocks: [makeBlock('TextCard')] } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'immutable', 'index');

      expect(result.HeaderContainer).toBeDefined();
    });

    it('should create default FooterContainer when raw has none', () => {
      const raw = { blocks: [makeBlock('TextCard')] } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'immutable', 'index');

      expect(result.Footer).toBeDefined();
      expect(result.Footer?.name).toBe('FooterContainer');
    });

    it('should create default FooterContainer when raw Footer is old-style content block', () => {
      const oldFooter = makeBlock('Footer', {
        column1: { title: 'Legal' },
        column2: {},
        column3: {},
        column4: {},
        colors: {},
      });
      const raw = { Footer: oldFooter, blocks: [makeBlock('TextCard')] } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'immutable', 'index');

      expect(result.Footer?.name).toBe('FooterContainer');
      expect(result.Footer?.type).toBe('structure');
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

    it('should return empty blocks when hasSnapshot is true and raw blocks are empty', () => {
      const raw = { blocks: [] } as unknown as GetBlocksResponse;
      const result = assembleBlocks(raw, 'immutable', 'index', true);

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
