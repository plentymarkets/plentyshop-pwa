import { withRecommendedCategoryId, hasSource } from '../withRecommendedCategoryId';
import type { Block, Product } from '@plentymarkets/shop-api';

vi.mock('@plentymarkets/shop-api', () => ({
  productGetters: {
    getCategoryIds: (product: Product & { categories?: string[] }) => product?.categories ?? [],
  },
}));

const DEFAULT_PRODUCT_RECOMMENDED_PRODUCTS_UUID = 'g7a6b5c4-d3e2-4f1a-9b8c-7d6e5f4a3b2c';

type ProductWithCategories = Product & { categories: string[] };

describe('withRecommendedCategoryId', () => {
  it('should inject categoryId when block matches and product has categories', () => {
    const block: Block = {
      name: 'ProductRecommendedProducts',
      type: 'content',
      meta: { uuid: DEFAULT_PRODUCT_RECOMMENDED_PRODUCTS_UUID },
      content: {
        source: {
          categoryId: '',
        },
      },
    };
    const product = { categories: ['123', '456'] } as ProductWithCategories;

    const result = withRecommendedCategoryId(block, product);

    expect(hasSource(result.content)).toBe(true);
    if (hasSource(result.content)) {
      expect(result.content.source.categoryId).toBe('123');
    }
  });

  it('should return block unchanged if uuid does not match', () => {
    const block: Block = {
      name: 'OtherBlock',
      type: 'content',
      meta: { uuid: 'other-uuid' },
      content: {
        source: {
          categoryId: '',
        },
      },
    };
    const product = { categories: ['123', '456'] } as ProductWithCategories;

    const result = withRecommendedCategoryId(block, product);

    expect(result).toEqual(block);
  });

  it('should return block unchanged if content has no source', () => {
    const block: Block = {
      name: 'ProductRecommendedProducts',
      type: 'content',
      meta: { uuid: DEFAULT_PRODUCT_RECOMMENDED_PRODUCTS_UUID },
      content: {},
    };
    const product = { categories: ['123', '456'] } as ProductWithCategories;

    const result = withRecommendedCategoryId(block, product);

    expect(result).toEqual(block);
  });

  it('should set categoryId to empty string if product has no categories', () => {
    const block: Block = {
      name: 'ProductRecommendedProducts',
      type: 'content',
      meta: { uuid: DEFAULT_PRODUCT_RECOMMENDED_PRODUCTS_UUID },
      content: {
        source: {
          categoryId: '',
        },
      },
    };
    const product = { categories: [] } as unknown as ProductWithCategories;

    const result = withRecommendedCategoryId(block, product);

    expect(hasSource(result.content)).toBe(true);
    if (hasSource(result.content)) {
      expect(result.content.source.categoryId).toBe('');
    }
  });
});
