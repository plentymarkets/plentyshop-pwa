/* eslint-disable max-nested-callbacks */
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useFooter } from '../useFooter';
import type { FooterSettings } from '~/components/blocks/Footer/types';
import type { Block } from '@plentymarkets/shop-api';

const mockFooterBlock: Block = {
  name: 'Footer',
  type: 'content',
  meta: {
    uuid: 'test-uuid',
    isGlobalTemplate: true,
  },
  content: {
    column1: { title: 'Legal' },
    column2: { title: 'Services', description: 'Get in touch', showContactLink: true, showRegisterLink: false },
    column3: { title: 'About', description: 'Learn more' },
    column4: { title: 'Help', description: 'Support' },
    footnote: '© Test Company 2024',
    footnoteAlign: 'center',
    colors: {
      background: '#ffffff',
      text: '#000000',
      footnoteBackground: '#f5f5f5',
      footnoteText: '#666666',
    },
  } as FooterSettings,
};

const { useSdk } = vi.hoisted(() => {
  return {
    useSdk: vi.fn().mockReturnValue({
      plentysystems: {
        getBlocks: vi.fn(),
      },
    }),
  };
});

const { useAsyncData } = vi.hoisted(() => {
  return {
    useAsyncData: vi.fn(),
  };
});

const { useState } = vi.hoisted(() => {
  return {
    useState: vi.fn(),
  };
});

const { useI18n } = vi.hoisted(() => {
  return {
    useI18n: vi.fn().mockReturnValue({
      t: vi.fn((key: string) => {
        const translations: Record<string, string> = {
          'categories.legal.label': 'Legal',
          'categories.services.label': 'Services',
        };
        return translations[key] || key;
      }),
    }),
  };
});

mockNuxtImport('useSdk', () => useSdk);
mockNuxtImport('useAsyncData', () => useAsyncData);
mockNuxtImport('useState', () => useState);
mockNuxtImport('useI18n', () => useI18n);

const setupApiResponse = (responseData: unknown) => {
  useAsyncData.mockImplementation((_key, _fetcher) => ({
    data: { value: responseData },
  }));
};

const setupApiCall = () => {
  useAsyncData.mockImplementation((_key, fetcher) => {
    fetcher();
    return { data: { value: null } };
  });
};

const setupApiError = () => {
  useAsyncData.mockImplementation(() => {
    throw new Error('API Error');
  });
};

const setupConsoleSpy = () => {
  return vi.spyOn(console, 'warn').mockImplementation(() => {});
};

describe('use Footer', () => {
  let mockStateRef: { value: Block | null };
  let mockGetBlocks: ReturnType<typeof vi.fn>;
  let mockAsyncData: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStateRef = { value: null };

    useState.mockReturnValue(mockStateRef);

    mockGetBlocks = vi.fn();
    useSdk.mockReturnValue({
      plentysystems: {
        getBlocks: mockGetBlocks,
      },
    });

    mockAsyncData = vi.fn();
    useAsyncData.mockImplementation((_key, _fetcher) => {
      const result = { data: { value: null } };
      mockAsyncData.mockResolvedValue(result);
      return result;
    });
  });

  describe('extractFooterContentFromBlocks', () => {
    it('should extract footer content from valid JSON blocks array', () => {
      const { extractFooterContentFromBlocks } = useFooter();
      const blocksJson = JSON.stringify([
        { name: 'Header', content: { title: 'Header' } },
        { name: 'Footer', content: mockFooterBlock },
        { name: 'Content', content: { body: 'Content' } },
      ]);

      const result = extractFooterContentFromBlocks(blocksJson);

      expect(result).toEqual(mockFooterBlock);
    });

    it('should return null if no footer block is found', () => {
      const { extractFooterContentFromBlocks } = useFooter();
      const blocksJson = JSON.stringify([
        { name: 'Header', content: { title: 'Header' } },
        { name: 'Content', content: { body: 'Content' } },
      ]);

      const result = extractFooterContentFromBlocks(blocksJson);

      expect(result).toBeNull();
    });

    it('should return null if blocks is not an array', () => {
      const { extractFooterContentFromBlocks } = useFooter();
      const blocksJson = JSON.stringify({ name: 'Footer', content: mockFooterBlock });

      const result = extractFooterContentFromBlocks(blocksJson);

      expect(result).toBeNull();
    });

    it('should return null and log warning for invalid JSON', () => {
      const { extractFooterContentFromBlocks } = useFooter();
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const invalidJson = 'invalid json string';

      const result = extractFooterContentFromBlocks(invalidJson);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to extract footer from blocks:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should return null if footer block has no content', () => {
      const { extractFooterContentFromBlocks } = useFooter();
      const blocksJson = JSON.stringify([{ name: 'Footer' }]);

      const result = extractFooterContentFromBlocks(blocksJson);

      expect(result).toBeNull();
    });
  });

  describe('useFooter composable', () => {
    describe('fetchFooterBlock', () => {
      it('should return cached settings if available', async () => {
        mockStateRef.value = mockFooterBlock;
        const { fetchFooterBlock } = useFooter();

        const result = await fetchFooterBlock();

        expect(result).toBe(mockFooterBlock);
        expect(useAsyncData).not.toHaveBeenCalled();
      });

      it('should fetch from API and cache successful response', async () => {
        const apiResponse = {
          data: [{ name: 'Header', content: { title: 'Header' } }, mockFooterBlock],
        };

        setupApiResponse(apiResponse);

        const { fetchFooterBlock } = useFooter();
        const { $i18n } = useNuxtApp();

        const result = await fetchFooterBlock();

        expect(useAsyncData).toHaveBeenCalledWith(`footer-block-${$i18n.locale}`, expect.any(Function));
        expect(result).toEqual(mockFooterBlock);
        expect(mockStateRef.value).toBe(mockFooterBlock);
      });

      it('should call SDK getBlocks with correct parameters', async () => {
        setupApiCall();

        const { fetchFooterBlock } = useFooter();

        await fetchFooterBlock();

        expect(mockGetBlocks).toHaveBeenCalledWith({
          identifier: 'index',
          type: 'immutable',
          blocks: 'Footer',
        });
      });

      it('should return defaults if no footer block found in API response', async () => {
        const apiResponse = {
          data: [
            { name: 'Header', content: { title: 'Header' } },
            { name: 'Content', content: { body: 'Content' } },
          ],
        };

        setupApiResponse(apiResponse);

        const { fetchFooterBlock } = useFooter();

        const result = await fetchFooterBlock();

        const content = result.content as FooterSettings;
        expect(content.column1.title).toBe('Legal');
        expect(content.column2.title).toBe('Services');
        expect(mockStateRef.value).toEqual(result);
      });

      it('should return defaults if API response is null', async () => {
        setupApiResponse(null);

        const { fetchFooterBlock } = useFooter();

        const result = await fetchFooterBlock();

        const content = result.content as FooterSettings;
        expect(content.column1.title).toBe('Legal');
        expect(content.column2.title).toBe('Services');
        expect(mockStateRef.value).toEqual(result);
      });

      it('should handle API errors gracefully and return defaults', async () => {
        const consoleSpy = setupConsoleSpy();

        setupApiError();

        const { fetchFooterBlock } = useFooter();

        const result = await fetchFooterBlock();

        const content = result.content as FooterSettings;
        expect(content.column1.title).toBe('Legal');
        expect(content.column2.title).toBe('Services');
        expect(mockStateRef.value).toEqual(result);
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch footer block, using defaults:', expect.any(Error));

        consoleSpy.mockRestore();
      });
    });

    describe('getFooterBlock', () => {
      it('should return cached settings if available', () => {
        mockStateRef.value = mockFooterBlock;
        const { getFooterBlock } = useFooter();

        const result = getFooterBlock();

        expect(result).toBe(mockFooterBlock);
      });

      it('should return default block if cache is empty', () => {
        mockStateRef.value = null;
        const { getFooterBlock } = useFooter();

        const result = getFooterBlock();

        const content = result.content as FooterSettings;
        expect(content.column1.title).toBe('Legal');
        expect(content.column2.title).toBe('Services');
      });
    });

    describe('clearFooterCache', () => {
      it('should clear the cached footer settings', () => {
        mockStateRef.value = mockFooterBlock;
        const { clearFooterCache } = useFooter();

        clearFooterCache();

        expect(mockStateRef.value).toBeNull();
      });
    });

    describe('updateFooterCache', () => {
      it('should update the cached footer block', () => {
        const newBlock: Block = {
          ...mockFooterBlock,
          content: {
            ...(mockFooterBlock.content as FooterSettings),
            footnote: '© Updated Company 2024',
          },
        };

        const { updateFooterCache } = useFooter();

        updateFooterCache(newBlock);

        expect(mockStateRef.value).toBe(newBlock);
      });
    });

    describe('footerCache readonly access', () => {
      it('should expose readonly cache', () => {
        mockStateRef.value = mockFooterBlock;
        const { footerCache } = useFooter();

        expect(footerCache.value).toEqual(mockFooterBlock);
      });
    });
  });
});
