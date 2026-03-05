import { createHomepage } from '~/utils/blockTemplates/homepage/factory';
import type { Block } from '@plentymarkets/shop-api';

describe('createHomepage', () => {
  it('should create an array of blocks', () => {
    const blocks = createHomepage();
    expect(Array.isArray(blocks)).toBe(true);
    expect(blocks.length).toBeGreaterThan(0);
  });

  it('should include required block types', () => {
    const blocks = createHomepage();
    const blockNames = blocks.map((block) => block.name);
    expect(blockNames).toContain('Carousel');
    expect(blockNames).toContain('TextCard');
    expect(blockNames).toContain('MultiGrid');
    expect(blockNames).toContain('ProductRecommendedProducts');
    expect(blockNames).toContain('NewsletterSubscribe');
    expect(blockNames).toContain('Footer');
  });

  it('should create blocks with valid structure', () => {
    const blocks = createHomepage();
    blocks.forEach((block) => {
      expect(block).toHaveProperty('name');
      expect(block).toHaveProperty('type');
      expect(block).toHaveProperty('meta');
      expect(block.meta).toHaveProperty('uuid');
      expect(block).toHaveProperty('content');
    });
  });

  it('should create Carousel block with 2 banners', () => {
    const blocks = createHomepage();
    const carouselBlock = blocks.find((block) => block.name === 'Carousel');
    expect(carouselBlock).toBeDefined();
    expect(Array.isArray(carouselBlock?.content)).toBe(true);
    expect((carouselBlock?.content as Block[]).length).toBe(2);
  });

  it('should create MultiGrid with Image and TextCard children', () => {
    const blocks = createHomepage();
    const multiGridBlock = blocks.find((block) => block.name === 'MultiGrid');
    expect(multiGridBlock).toBeDefined();
    expect(Array.isArray(multiGridBlock?.content)).toBe(true);
    const children = multiGridBlock?.content as Block[];
    expect(children.some((child) => child.name === 'Image')).toBe(true);
    expect(children.some((child) => child.name === 'TextCard')).toBe(true);
  });

  it('should use translations for text content', () => {
    const blocks = createHomepage();
    const textCardBlock = blocks.find((block) => block.name === 'TextCard');
    expect(textCardBlock).toBeDefined();
    const content = textCardBlock?.content as { text?: { title?: string } };
    expect(content?.text?.title).toBeDefined();
    expect(typeof content?.text?.title).toBe('string');
  });

  it('should have valid Footer block structure', () => {
    const blocks = createHomepage();
    const footerBlock = blocks.find((block) => block.name === 'Footer');
    expect(footerBlock).toBeDefined();
    expect(footerBlock?.type).toBe('content');
    expect(footerBlock?.meta).toBeDefined();
    expect(footerBlock?.content).toBeDefined();
  });
});
