import { createCategory } from '~/utils/blockTemplates/category/factory';
import type { Block } from '@plentymarkets/shop-api';

describe('createCategory', () => {
  it('should create an array of blocks', () => {
    const blocks = createCategory();
    expect(Array.isArray(blocks)).toBe(true);
    expect(blocks.length).toBeGreaterThan(0);
  });

  it('should include required block types', () => {
    const blocks = createCategory();
    const blockNames = blocks.map((block) => block.name);
    expect(blockNames).toContain('CategoryData');
    expect(blockNames).toContain('MultiGrid');
    expect(blockNames).toContain('Footer');
  });

  it('should create blocks with valid structure', () => {
    const blocks = createCategory();
    blocks.forEach((block) => {
      expect(block).toHaveProperty('name');
      expect(block).toHaveProperty('type');
      expect(block).toHaveProperty('meta');
      expect(block.meta).toHaveProperty('uuid');
      expect(block).toHaveProperty('content');
    });
  });

  it('should create MultiGrid with SortFilter and ItemGrid children', () => {
    const blocks = createCategory();
    const multiGridBlock = blocks.find((block) => block.name === 'MultiGrid');
    expect(multiGridBlock).toBeDefined();
    expect(Array.isArray(multiGridBlock?.content)).toBe(true);
    const children = multiGridBlock?.content as Block[];
    expect(children.some((child) => child.name === 'SortFilter')).toBe(true);
    expect(children.some((child) => child.name === 'ItemGrid')).toBe(true);
  });

  it('should set correct parent_slot for child blocks', () => {
    const blocks = createCategory();
    const multiGridBlock = blocks.find((block) => block.name === 'MultiGrid');
    const children = multiGridBlock?.content as Array<Block & { parent_slot?: number }>;
    const sortFilter = children.find((child) => child.name === 'SortFilter');
    const itemGrid = children.find((child) => child.name === 'ItemGrid');
    expect(sortFilter?.parent_slot).toBe(0);
    expect(itemGrid?.parent_slot).toBe(1);
  });

  it('should have valid Footer block structure', () => {
    const blocks = createCategory();
    const footerBlock = blocks.find((block) => block.name === 'Footer');
    expect(footerBlock).toBeDefined();
    expect(footerBlock?.type).toBe('content');
    expect(footerBlock?.meta).toBeDefined();
    expect(footerBlock?.content).toBeDefined();
  });
});
