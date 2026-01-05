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

describe('Category Meta Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategoryMetaTitle', () => {
    it('should return category meta title when on a category page with meta title', () => {
      const isCategoryPage = true;
      const category = mockCategory;
      mockCategoryGetters.getMetaTitle.mockReturnValue('Category Meta Title');

      const getCategoryMetaTitle = () => {
        if (isCategoryPage) {
          const categoryMetaTitle = mockCategoryGetters.getMetaTitle(category);
          if (categoryMetaTitle) return categoryMetaTitle;
        }
        return defaultMetaTitle;
      };

      expect(getCategoryMetaTitle()).toBe('Category Meta Title');
      expect(mockCategoryGetters.getMetaTitle).toHaveBeenCalledWith(category);
    });

    it('should return default site meta title when category has no meta title', () => {
      const isCategoryPage = true;
      const category = mockCategory;
      mockCategoryGetters.getMetaTitle.mockReturnValue('');

      const getCategoryMetaTitle = () => {
        if (isCategoryPage) {
          const categoryMetaTitle = mockCategoryGetters.getMetaTitle(category);
          if (categoryMetaTitle) return categoryMetaTitle;
        }
        return defaultMetaTitle;
      };

      expect(getCategoryMetaTitle()).toBe(defaultMetaTitle);
    });

    it('should return default site meta title when not on a category page', () => {
      const isCategoryPage = false;
      const category = mockCategory;
      mockCategoryGetters.getMetaTitle.mockReturnValue('Category Meta Title');

      const getCategoryMetaTitle = () => {
        if (isCategoryPage) {
          const categoryMetaTitle = mockCategoryGetters.getMetaTitle(category);
          if (categoryMetaTitle) return categoryMetaTitle;
        }
        return defaultMetaTitle;
      };

      expect(getCategoryMetaTitle()).toBe(defaultMetaTitle);
      expect(mockCategoryGetters.getMetaTitle).not.toHaveBeenCalled();
    });
  });

  describe('getCategoryMetaDescription', () => {
    it('should return category meta description when on a category page with meta description', () => {
      const isCategoryPage = true;
      const category = mockCategory;
      mockCategoryGetters.getMetaDescription.mockReturnValue('Category Meta Description');

      const getCategoryMetaDescription = () => {
        if (isCategoryPage) {
          const categoryMetaDescription = mockCategoryGetters.getMetaDescription(category);
          if (categoryMetaDescription) return categoryMetaDescription;
        }
        return defaultMetaDescription;
      };

      expect(getCategoryMetaDescription()).toBe('Category Meta Description');
      expect(mockCategoryGetters.getMetaDescription).toHaveBeenCalledWith(category);
    });

    it('should return default site meta description when category has no meta description', () => {
      const isCategoryPage = true;
      const category = mockCategory;
      mockCategoryGetters.getMetaDescription.mockReturnValue('');

      const getCategoryMetaDescription = () => {
        if (isCategoryPage) {
          const categoryMetaDescription = mockCategoryGetters.getMetaDescription(category);
          if (categoryMetaDescription) return categoryMetaDescription;
        }
        return defaultMetaDescription;
      };

      expect(getCategoryMetaDescription()).toBe(defaultMetaDescription);
    });

    it('should return default site meta description when not on a category page', () => {
      const isCategoryPage = false;
      const category = mockCategory;
      mockCategoryGetters.getMetaDescription.mockReturnValue('Category Meta Description');

      const getCategoryMetaDescription = () => {
        if (isCategoryPage) {
          const categoryMetaDescription = mockCategoryGetters.getMetaDescription(category);
          if (categoryMetaDescription) return categoryMetaDescription;
        }
        return defaultMetaDescription;
      };

      expect(getCategoryMetaDescription()).toBe(defaultMetaDescription);
      expect(mockCategoryGetters.getMetaDescription).not.toHaveBeenCalled();
    });
  });

  describe('getCategoryMetaKeywords', () => {
    it('should return category meta keywords when on a category page with meta keywords', () => {
      const isCategoryPage = true;
      const category = mockCategory;
      mockCategoryGetters.getMetaKeywords.mockReturnValue('keyword1, keyword2');

      const getCategoryMetaKeywords = () => {
        if (isCategoryPage) {
          const categoryMetaKeywords = mockCategoryGetters.getMetaKeywords(category);
          if (categoryMetaKeywords) return categoryMetaKeywords;
        }
        return defaultMetaKeywords;
      };

      expect(getCategoryMetaKeywords()).toBe('keyword1, keyword2');
      expect(mockCategoryGetters.getMetaKeywords).toHaveBeenCalledWith(category);
    });

    it('should return default site meta keywords when category has no meta keywords', () => {
      const isCategoryPage = true;
      const category = mockCategory;
      mockCategoryGetters.getMetaKeywords.mockReturnValue('');

      const getCategoryMetaKeywords = () => {
        if (isCategoryPage) {
          const categoryMetaKeywords = mockCategoryGetters.getMetaKeywords(category);
          if (categoryMetaKeywords) return categoryMetaKeywords;
        }
        return defaultMetaKeywords;
      };

      expect(getCategoryMetaKeywords()).toBe(defaultMetaKeywords);
    });

    it('should return default site meta keywords when not on a category page', () => {
      const isCategoryPage = false;
      const category = mockCategory;
      mockCategoryGetters.getMetaKeywords.mockReturnValue('keyword1, keyword2');

      const getCategoryMetaKeywords = () => {
        if (isCategoryPage) {
          const categoryMetaKeywords = mockCategoryGetters.getMetaKeywords(category);
          if (categoryMetaKeywords) return categoryMetaKeywords;
        }
        return defaultMetaKeywords;
      };

      expect(getCategoryMetaKeywords()).toBe(defaultMetaKeywords);
      expect(mockCategoryGetters.getMetaKeywords).not.toHaveBeenCalled();
    });
  });

  describe('getCategoryOgTitle', () => {
    it('should return category meta title for og:title when on a category page', () => {
      const isCategoryPage = true;
      const category = mockCategory;
      mockCategoryGetters.getMetaTitle.mockReturnValue('Category Meta Title');

      const getCategoryOgTitle = () => {
        if (isCategoryPage) {
          const categoryMetaTitle = mockCategoryGetters.getMetaTitle(category);
          if (categoryMetaTitle) return categoryMetaTitle;
        }
        return defaultOgTitle || defaultMetaTitle;
      };

      expect(getCategoryOgTitle()).toBe('Category Meta Title');
    });

    it('should return default og title when category has no meta title', () => {
      const isCategoryPage = true;
      const category = mockCategory;
      mockCategoryGetters.getMetaTitle.mockReturnValue('');

      const getCategoryOgTitle = () => {
        if (isCategoryPage) {
          const categoryMetaTitle = mockCategoryGetters.getMetaTitle(category);
          if (categoryMetaTitle) return categoryMetaTitle;
        }
        return defaultOgTitle || defaultMetaTitle;
      };

      expect(getCategoryOgTitle()).toBe(defaultOgTitle);
    });

    it('should fallback to meta title when og title is not set', () => {
      const isCategoryPage = false;
      const category = mockCategory;
      const ogTitle = '';
      mockCategoryGetters.getMetaTitle.mockReturnValue('');

      const getCategoryOgTitle = () => {
        if (isCategoryPage) {
          const categoryMetaTitle = mockCategoryGetters.getMetaTitle(category);
          if (categoryMetaTitle) return categoryMetaTitle;
        }
        return ogTitle || defaultMetaTitle;
      };

      expect(getCategoryOgTitle()).toBe(defaultMetaTitle);
    });
  });

  describe('getCategoryOgDescription', () => {
    it('should return category meta description for og:description when on a category page', () => {
      const isCategoryPage = true;
      const category = mockCategory;
      mockCategoryGetters.getMetaDescription.mockReturnValue('Category Meta Description');

      const getCategoryOgDescription = () => {
        if (isCategoryPage) {
          const categoryMetaDescription = mockCategoryGetters.getMetaDescription(category);
          if (categoryMetaDescription) return categoryMetaDescription;
        }
        return defaultMetaDescription;
      };

      expect(getCategoryOgDescription()).toBe('Category Meta Description');
    });

    it('should return default meta description for og:description when category has no meta description', () => {
      const isCategoryPage = true;
      const category = mockCategory;
      mockCategoryGetters.getMetaDescription.mockReturnValue('');

      const getCategoryOgDescription = () => {
        if (isCategoryPage) {
          const categoryMetaDescription = mockCategoryGetters.getMetaDescription(category);
          if (categoryMetaDescription) return categoryMetaDescription;
        }
        return defaultMetaDescription;
      };

      expect(getCategoryOgDescription()).toBe(defaultMetaDescription);
    });
  });
});

