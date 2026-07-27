import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Block } from '@plentymarkets/shop-api';
import { useBlocksList } from '~/composables/useBlocksList/useBlocksList';
import {
  getMockBlocksList,
  mockBlockCategories,
  mockBuildBlocksListError,
  mockBuildBlocksListSuccess,
  mockCategory,
  mockCategoryTemplateBlocks,
  mockExpectedEnglishTemplate,
  mockExpectedGermanTemplate,
  mockSimpleBlocksList,
  setupNuxtMocks,
} from './useBlocksList.mocks';

const buildBlocksListMock = vi.hoisted(() => vi.fn());
mockNuxtImport('resolveBlocksList', () => buildBlocksListMock);
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
    it('should initialize with empty blocksLists', () => {
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

  describe('getBlocksLists', () => {
    it('should load blocks lists from local defaults modules', async () => {
      mockBuildBlocksListSuccess(buildBlocksListMock, mockSimpleBlocksList);

      const { getBlocksLists, blocksLists } = useBlocksList();

      await getBlocksLists();

      expect(blocksLists.value).toEqual(mockSimpleBlocksList);
    });

    it('should throw error if loading fails', async () => {
      mockBuildBlocksListError(buildBlocksListMock, 'Module load error');

      const { getBlocksLists } = useBlocksList();

      await expect(getBlocksLists()).rejects.toThrow();
    });
  });

  describe('getBlockTemplateByLanguage', () => {
    beforeEach(() => {
      const { blocksLists } = useBlocksList();
      blocksLists.value = getMockBlocksList();
    });

    it('should load blocks list if not already loaded', async () => {
      const { blocksLists, getBlockTemplateByLanguage } = useBlocksList();
      blocksLists.value = {};
      mockBuildBlocksListSuccess(buildBlocksListMock, getMockBlocksList());

      const template = await getBlockTemplateByLanguage('banners', 0, 'en');

      expect(template).toEqual(mockExpectedEnglishTemplate);
    });

    it('should return English template when lang is "en"', async () => {
      const { getBlockTemplateByLanguage } = useBlocksList();

      const template = await getBlockTemplateByLanguage('banners', 0, 'en');

      expect(template).toEqual(mockExpectedEnglishTemplate);
    });

    it('should return German template when lang is "de"', async () => {
      const { getBlockTemplateByLanguage } = useBlocksList();

      const template = await getBlockTemplateByLanguage('banners', 0, 'de');

      expect(template).toEqual(mockExpectedGermanTemplate);
    });

    it('should return a deep clone to prevent mutations', async () => {
      const { getBlockTemplateByLanguage } = useBlocksList();

      const template1 = await getBlockTemplateByLanguage('banners', 0, 'en');
      const template2 = await getBlockTemplateByLanguage('banners', 0, 'en');

      expect(template1).not.toBe(template2);
      expect(template1).toEqual(template2);
    });

    it('should throw error if category not found', async () => {
      const { getBlockTemplateByLanguage } = useBlocksList();

      await expect(getBlockTemplateByLanguage('nonexistent', 0, 'en')).rejects.toThrow();
    });

    it('should throw error if variation not found', async () => {
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
