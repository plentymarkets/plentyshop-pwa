import type { Product, Review } from '@plentymarkets/shop-api';

export const buildProduct = (): Product =>
  ({
    item: { id: 1, feedbackDecimal: 0, feedbackCount: 0 },
    variation: { id: 101, lengthMM: 0, widthMM: 0, heightMM: 0, weightG: 0 },
    texts: { name1: 'Test Product', description: 'desc', urlPath: 'test-product' },
    images: { all: [], variation: [] },
    prices: { default: { unitPrice: { value: 10, currency: 'EUR', formatted: '10 €' } } },
    defaultCategories: [{ id: 1, name: 'Cat' }],
  }) as unknown as Product;

export const buildProductWithItemId = (id: number): Product => {
  const product = buildProduct();
  return {
    ...product,
    item: {
      ...product.item,
      id,
    },
  };
};

export const buildProductWithVariationId = (id: number): Product => {
  const product = buildProduct();
  return {
    ...product,
    variation: {
      ...product.variation,
      id,
    },
  };
};

export const buildProductWithUrlPath = (path: string): Product => {
  const product = buildProduct();
  return {
    ...product,
    texts: {
      ...product.texts,
      urlPath: path,
    },
  };
};

export const buildReviewWithCounts = (total: number, average: string): Review =>
  ({
    feedbacks: [],
    pagination: { page: '1', lastPage: 1, isLastPage: true, totalCount: total },
    counts: {
      ratingsCountOf1: 0,
      ratingsCountOf2: 0,
      ratingsCountOf3: 0,
      ratingsCountOf4: 0,
      ratingsCountOf5: total,
      ratingsCountTotal: total,
      averageValue: average,
      highestCount: total,
    },
  }) as unknown as Review;
