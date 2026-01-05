import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { Category } from '@plentymarkets/shop-api';

const mockCategoryGetters = {
  getMetaTitle: vi.fn(),
  getMetaDescription: vi.fn(),
  getMetaKeywords: vi.fn(),
};

vi.mock('@plentymarkets/shop-api', () => ({
  categoryGetters: mockCategoryGetters,
}));

const mockCategory: Partial<Category> = {
  id: 17,
  parentCategoryId: 16,
  level: 2,
  type: 'item',
  details: [
    {
      categoryId: '17',
      lang: 'de',
      name: 'Test Category',
      metaTitle: 'Category Meta Title',
      metaDescription: 'Category Meta Description',
      metaKeywords: 'keyword1, keyword2',
      description: '',
      description2: '',
      shortDescription: '',
      nameUrl: 'test-category',
      position: '1',
      metaRobots: 'ALL',
      canonicalLink: '',
      fulltext: 'N',
      image: null,
      image2: null,
      imagePath: null,
      image2Path: null,
      itemListView: 'ItemViewCategoriesList',
      singleItemView: 'ItemViewSingleItem',
      pageView: 'PageDesignContent',
      plentyId: 60796,
      plenty_category_details_image_path: '',
      plenty_category_details_image2_path: '',
      updatedAt: '2021-11-16T08:28:25+01:00',
      updatedBy: 'Test User',
    },
  ],
};

const defaultMetaTitle = 'Default Site Meta Title';
const defaultMetaDescription = 'Default Site Meta Description';
const defaultMetaKeywords = 'default, keywords';
const defaultOgTitle = 'Default OG Title';

const getDefaultMetaTitle = () => defaultMetaTitle;
const getDefaultMetaDescription = () => defaultMetaDescription;
const getDefaultMetaKeywords = () => defaultMetaKeywords;
const getDefaultOgTitleWithFallback = () => defaultOgTitle || defaultMetaTitle;

const getEmptyOgTitleWithFallback = () => defaultMetaTitle;

const createMetaWithCategoryFallback = (
  categoryGetter: (category: Partial<Category>) => string,
  defaultGetter: () => string,
  isCategoryPage: boolean,
  category: Partial<Category>,
) => {
  return () => {
    if (isCategoryPage) {
      const categoryValue = categoryGetter(category);
      if (categoryValue) return categoryValue;
    }
    return defaultGetter();
  };
};

describe('Category Meta Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategoryMetaTitle', () => {
    it('should return category meta title when on a category page with meta title', () => {
      mockCategoryGetters.getMetaTitle.mockReturnValue('Category Meta Title');
      const getCategoryMetaTitle = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaTitle,
        getDefaultMetaTitle,
        true,
        mockCategory,
      );

      expect(getCategoryMetaTitle()).toBe('Category Meta Title');
      expect(mockCategoryGetters.getMetaTitle).toHaveBeenCalledWith(mockCategory);
    });

    it('should return default site meta title when category has no meta title', () => {
      mockCategoryGetters.getMetaTitle.mockReturnValue('');
      const getCategoryMetaTitle = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaTitle,
        getDefaultMetaTitle,
        true,
        mockCategory,
      );

      expect(getCategoryMetaTitle()).toBe(defaultMetaTitle);
    });

    it('should return default site meta title when not on a category page', () => {
      mockCategoryGetters.getMetaTitle.mockReturnValue('Category Meta Title');
      const getCategoryMetaTitle = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaTitle,
        getDefaultMetaTitle,
        false,
        mockCategory,
      );

      expect(getCategoryMetaTitle()).toBe(defaultMetaTitle);
      expect(mockCategoryGetters.getMetaTitle).not.toHaveBeenCalled();
    });
  });

  describe('getCategoryMetaDescription', () => {
    it('should return category meta description when on a category page with meta description', () => {
      mockCategoryGetters.getMetaDescription.mockReturnValue('Category Meta Description');
      const getCategoryMetaDescription = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaDescription,
        getDefaultMetaDescription,
        true,
        mockCategory,
      );

      expect(getCategoryMetaDescription()).toBe('Category Meta Description');
      expect(mockCategoryGetters.getMetaDescription).toHaveBeenCalledWith(mockCategory);
    });

    it('should return default site meta description when category has no meta description', () => {
      mockCategoryGetters.getMetaDescription.mockReturnValue('');
      const getCategoryMetaDescription = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaDescription,
        getDefaultMetaDescription,
        true,
        mockCategory,
      );

      expect(getCategoryMetaDescription()).toBe(defaultMetaDescription);
    });

    it('should return default site meta description when not on a category page', () => {
      mockCategoryGetters.getMetaDescription.mockReturnValue('Category Meta Description');
      const getCategoryMetaDescription = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaDescription,
        getDefaultMetaDescription,
        false,
        mockCategory,
      );

      expect(getCategoryMetaDescription()).toBe(defaultMetaDescription);
      expect(mockCategoryGetters.getMetaDescription).not.toHaveBeenCalled();
    });
  });

  describe('getCategoryMetaKeywords', () => {
    it('should return category meta keywords when on a category page with meta keywords', () => {
      mockCategoryGetters.getMetaKeywords.mockReturnValue('keyword1, keyword2');
      const getCategoryMetaKeywords = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaKeywords,
        getDefaultMetaKeywords,
        true,
        mockCategory,
      );

      expect(getCategoryMetaKeywords()).toBe('keyword1, keyword2');
      expect(mockCategoryGetters.getMetaKeywords).toHaveBeenCalledWith(mockCategory);
    });

    it('should return default site meta keywords when category has no meta keywords', () => {
      mockCategoryGetters.getMetaKeywords.mockReturnValue('');
      const getCategoryMetaKeywords = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaKeywords,
        getDefaultMetaKeywords,
        true,
        mockCategory,
      );

      expect(getCategoryMetaKeywords()).toBe(defaultMetaKeywords);
    });

    it('should return default site meta keywords when not on a category page', () => {
      mockCategoryGetters.getMetaKeywords.mockReturnValue('keyword1, keyword2');
      const getCategoryMetaKeywords = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaKeywords,
        getDefaultMetaKeywords,
        false,
        mockCategory,
      );

      expect(getCategoryMetaKeywords()).toBe(defaultMetaKeywords);
      expect(mockCategoryGetters.getMetaKeywords).not.toHaveBeenCalled();
    });
  });

  describe('getCategoryOgTitle', () => {
    it('should return category meta title for og:title when on a category page', () => {
      mockCategoryGetters.getMetaTitle.mockReturnValue('Category Meta Title');
      const getCategoryOgTitle = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaTitle,
        getDefaultOgTitleWithFallback,
        true,
        mockCategory,
      );

      expect(getCategoryOgTitle()).toBe('Category Meta Title');
    });

    it('should return default og title when category has no meta title', () => {
      mockCategoryGetters.getMetaTitle.mockReturnValue('');
      const getCategoryOgTitle = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaTitle,
        getDefaultOgTitleWithFallback,
        true,
        mockCategory,
      );

      expect(getCategoryOgTitle()).toBe(defaultOgTitle);
    });

    it('should fallback to meta title when og title is not set', () => {
      mockCategoryGetters.getMetaTitle.mockReturnValue('');
      const getCategoryOgTitle = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaTitle,
        getEmptyOgTitleWithFallback,
        false,
        mockCategory,
      );

      expect(getCategoryOgTitle()).toBe(defaultMetaTitle);
    });
  });

  describe('getCategoryOgDescription', () => {
    it('should return category meta description for og:description when on a category page', () => {
      mockCategoryGetters.getMetaDescription.mockReturnValue('Category Meta Description');
      const getCategoryOgDescription = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaDescription,
        getDefaultMetaDescription,
        true,
        mockCategory,
      );

      expect(getCategoryOgDescription()).toBe('Category Meta Description');
    });

    it('should return default meta description for og:description when category has no meta description', () => {
      mockCategoryGetters.getMetaDescription.mockReturnValue('');
      const getCategoryOgDescription = createMetaWithCategoryFallback(
        mockCategoryGetters.getMetaDescription,
        getDefaultMetaDescription,
        true,
        mockCategory,
      );

      expect(getCategoryOgDescription()).toBe(defaultMetaDescription);
    });
  });
});
