import { createProduct } from '~/utils/blockTemplates/product/factory';
import type { Block } from '@plentymarkets/shop-api';

describe('createProduct', () => {
  it('should create an array of blocks', () => {
    const blocks = createProduct();
    expect(Array.isArray(blocks)).toBe(true);
    expect(blocks.length).toBeGreaterThan(0);
  });

  it('should include required block types', () => {
    const blocks = createProduct();
    const blockNames = blocks.map((block) => block.name);
    expect(blockNames).toContain('MultiGrid');
    expect(blockNames).toContain('ItemText');
    expect(blockNames).toContain('TechnicalData');
    expect(blockNames).toContain('CustomerReview');
    expect(blockNames).toContain('ProductLegalInformation');
    expect(blockNames).toContain('ProductRecommendedProducts');
    expect(blockNames).toContain('Footer');
  });

  it('should create blocks with valid structure', () => {
    const blocks = createProduct();
    blocks.forEach((block) => {
      expect(block).toHaveProperty('name');
      expect(block).toHaveProperty('type');
      expect(block).toHaveProperty('meta');
      expect(block.meta).toHaveProperty('uuid');
      expect(block).toHaveProperty('content');
    });
  });

  it('should create MultiGrid with ImageGallery and PriceCard children', () => {
    const blocks = createProduct();
    const multiGridBlock = blocks.find((block) => block.name === 'MultiGrid');
    expect(multiGridBlock).toBeDefined();
    expect(Array.isArray(multiGridBlock?.content)).toBe(true);
    const children = multiGridBlock?.content as Block[];
    expect(children.some((child) => child.name === 'ImageGallery')).toBe(true);
    expect(children.some((child) => child.name === 'PriceCard')).toBe(true);
  });

  it('should use translations for block titles', () => {
    const blocks = createProduct();
    const itemTextBlock = blocks.find((block) => block.name === 'ItemText');
    expect(itemTextBlock).toBeDefined();
    const content = itemTextBlock?.content as { text?: { title?: string } };
    expect(content?.text?.title).toBeDefined();
    expect(typeof content?.text?.title).toBe('string');
  });

  it('should have valid Footer block structure', () => {
    const blocks = createProduct();
    const footerBlock = blocks.find((block) => block.name === 'Footer');
    expect(footerBlock).toBeDefined();
    expect(footerBlock?.type).toBe('content');
    expect(footerBlock?.meta).toBeDefined();
    expect(footerBlock?.content).toBeDefined();
  });
});
