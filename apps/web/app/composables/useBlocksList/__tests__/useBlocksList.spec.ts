import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Block } from '@plentymarkets/shop-api';
import { useBlocksList } from '~/composables/useBlocksList/useBlocksList';
import {
  getMockBlocksList,
  mockBlockCategories,
  mockCategory,
  mockCategoryTemplateBlocks,
  mockExpectedEnglishTemplate,
  mockExpectedGermanTemplate,
  setupNuxtMocks,
} from './useBlocksList.mocks';

// Isolate tests from real module contributions and built-in defaults discovered
// via Vite globs. Tests that need either can re-mock these modules locally.
vi.mock('~/utils/blocks/block-contributions', () => ({
  blocksListContributions: [],
}));
vi.mock('~/utils/blocks/block-defaults', () => ({
  blocksListDefaults: {},
}));

setupNuxtMocks();
mockNuxtImport('useBlockTemplates', () => () => ({
  data: ref<Block[]>(mockCategoryTemplateBlocks),
}));

describe('useBlocksList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const { blocksLists, setBlocksListContext } = useBlocksList();
    blocksLists.value = {};
    setBlocksListContext('');
  });

  describe('initialization', () => {
    it('should initialize with empty blocksLists when no contributions are registered', () => {
      const { blocksLists } = useBlocksList();

      expect(blocksLists.value).toEqual({});
    });
  });

  describe('setBlocksListContext', () => {
    it('should set the blocks list context', () => {
      const { setBlocksListContext, pageHasAccessToCategory } = useBlocksList();

      setBlocksListContext('content');

      expect(pageHasAccessToCategory(mockCategory)).toBe(true);
    });

    it('should handle empty context', () => {
      const { setBlocksListContext, pageHasAccessToCategory } = useBlocksList();

      setBlocksListContext('');

      expect(pageHasAccessToCategory(mockCategory)).toBe(false);
    });
  });

  describe('getBlockTemplateByLanguage', () => {
    const seedBlocksLists = () => {
      const { blocksLists } = useBlocksList();
      blocksLists.value = getMockBlocksList();
    };

    it('should return English template when lang is "en"', async () => {
      seedBlocksLists();

      const { getBlockTemplateByLanguage } = useBlocksList();

      const template = await getBlockTemplateByLanguage('banners', 0, 'en');

      expect(template).toEqual(mockExpectedEnglishTemplate);
    });

    it('should return German template when lang is "de"', async () => {
      seedBlocksLists();

      const { getBlockTemplateByLanguage } = useBlocksList();

      const template = await getBlockTemplateByLanguage('banners', 0, 'de');

      expect(template).toEqual(mockExpectedGermanTemplate);
    });

    it('should return a deep clone to prevent mutations', async () => {
      seedBlocksLists();

      const { getBlockTemplateByLanguage } = useBlocksList();

      const template1 = await getBlockTemplateByLanguage('banners', 0, 'en');
      const template2 = await getBlockTemplateByLanguage('banners', 0, 'en');

      expect(template1).not.toBe(template2);
      expect(template1).toEqual(template2);
    });

    it('should throw error if category not found', async () => {
      seedBlocksLists();

      const { getBlockTemplateByLanguage } = useBlocksList();

      await expect(getBlockTemplateByLanguage('nonexistent', 0, 'en')).rejects.toThrow();
    });

    it('should throw error if variation not found', async () => {
      seedBlocksLists();

      const { getBlockTemplateByLanguage } = useBlocksList();

      await expect(getBlockTemplateByLanguage('banners', 99, 'en')).rejects.toThrow();
    });
  });

  describe('pageHasAccessToCategory', () => {
    it('should return true when context matches accessControl', () => {
      const { setBlocksListContext, pageHasAccessToCategory } = useBlocksList();

      setBlocksListContext('content');

      expect(pageHasAccessToCategory(mockBlockCategories.contentBlocks)).toBe(true);
    });

    it('should return false when context does not match accessControl', () => {
      const { setBlocksListContext, pageHasAccessToCategory } = useBlocksList();

      setBlocksListContext('content');

      expect(pageHasAccessToCategory(mockBlockCategories.productBlocks)).toBe(false);
    });

    it('should return false when context is empty', () => {
      const { setBlocksListContext, pageHasAccessToCategory } = useBlocksList();

      setBlocksListContext('');

      expect(pageHasAccessToCategory(mockBlockCategories.contentBlocks)).toBe(false);
    });

    it('should return false when accessControl is not defined', () => {
      const { setBlocksListContext, pageHasAccessToCategory } = useBlocksList();

      setBlocksListContext('content');

      expect(pageHasAccessToCategory(mockBlockCategories.universalBlocks)).toBe(false);
    });
  });
});
