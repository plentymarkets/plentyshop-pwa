import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useFooterSettings } from '../useFooterSettings';
import type { FooterSettings } from '~/components/blocks/Footer/types';

const mockFooterData: FooterSettings = {
  meta: {
    uuid: 'test-uuid',
    isGlobalTemplate: true,
  },
  column1: { title: 'Legal' },
  column2: { title: 'Contact', description: 'Get in touch', showContactLink: true },
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
          'categories.contact.label': 'Contact',
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

// Helper functions to reduce nesting
const setupApiResponse = (responseData: unknown) => {
  useAsyncData.mockImplementation((_key, _fetcher) => ({
    data: { value: responseData },
  }));
};

const setupApiCall = () => {
  useAsyncData.mockImplementation((_key, fetcher) => {
    // Call the fetcher to test SDK call
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

describe('useFooterSettings', () => {
  let mockStateRef: { value: FooterSettings | null };
  let mockGetBlocks: ReturnType<typeof vi.fn>;
  let mockAsyncData: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset state for each test
    mockStateRef = { value: null };

    // Setup useState mock
    useState.mockReturnValue(mockStateRef);

    // Setup SDK mock
    mockGetBlocks = vi.fn();
    useSdk.mockReturnValue({
      plentysystems: {
        getBlocks: mockGetBlocks,
      },
    });

    // Setup useAsyncData mock
    mockAsyncData = vi.fn();
    useAsyncData.mockImplementation((_key, _fetcher) => {
      const result = { data: { value: null } };
      mockAsyncData.mockResolvedValue(result);
      return result;
    });
  });

  describe('extractFooterFromBlocks', () => {
    it('should extract footer content from valid JSON blocks array', () => {
      const blocksJson = JSON.stringify([
        { name: 'Header', content: { title: 'Header' } },
        { name: 'Footer', content: mockFooterData },
        { name: 'Content', content: { body: 'Content' } },
      ]);

      const result = extractFooterFromBlocks(blocksJson);

      expect(result).toEqual(mockFooterData);
    });

    it('should return null if no footer block is found', () => {
      const blocksJson = JSON.stringify([
        { name: 'Header', content: { title: 'Header' } },
        { name: 'Content', content: { body: 'Content' } },
      ]);

      const result = extractFooterFromBlocks(blocksJson);

      expect(result).toBeNull();
    });

    it('should return null if blocks is not an array', () => {
      const blocksJson = JSON.stringify({ name: 'Footer', content: mockFooterData });

      const result = extractFooterFromBlocks(blocksJson);

      expect(result).toBeNull();
    });

    it('should return null and log warning for invalid JSON', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const invalidJson = 'invalid json string';

      const result = extractFooterFromBlocks(invalidJson);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to extract footer from blocks:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should return null if footer block has no content', () => {
      const blocksJson = JSON.stringify([{ name: 'Footer' }]);

      const result = extractFooterFromBlocks(blocksJson);

      expect(result).toBeNull();
    });
  });

  describe('useFooterSettings composable', () => {
    describe('fetchFooterSettings', () => {
      it('should return cached settings if available', async () => {
        mockStateRef.value = mockFooterData;
        const { fetchFooterSettings } = useFooterSettings();

        const result = await fetchFooterSettings();

        expect(result).toBe(mockFooterData);
        expect(useAsyncData).not.toHaveBeenCalled();
      });

      it('should fetch from API and cache successful response', async () => {
        const apiResponse = {
          data: [
            { name: 'Header', content: { title: 'Header' } },
            { name: 'Footer', content: mockFooterData },
          ],
        };

        setupApiResponse(apiResponse);

        const { fetchFooterSettings } = useFooterSettings();

        const result = await fetchFooterSettings();

        expect(useAsyncData).toHaveBeenCalledWith('footer-settings', expect.any(Function));
        expect(result).toEqual(mockFooterData);
        expect(mockStateRef.value).toBe(mockFooterData);
      });

      it('should call SDK getBlocks with correct parameters', async () => {
        setupApiCall();

        const { fetchFooterSettings } = useFooterSettings();

        await fetchFooterSettings();

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

        const { fetchFooterSettings } = useFooterSettings();

        const result = await fetchFooterSettings();

        expect(result.column1.title).toBe('Legal');
        expect(result.column2.title).toBe('Contact');
        expect(mockStateRef.value).toEqual(result);
      });

      it('should return defaults if API response is null', async () => {
        setupApiResponse(null);

        const { fetchFooterSettings } = useFooterSettings();

        const result = await fetchFooterSettings();

        expect(result.column1.title).toBe('Legal');
        expect(result.column2.title).toBe('Contact');
        expect(mockStateRef.value).toEqual(result);
      });

      it('should handle API errors gracefully and return defaults', async () => {
        const consoleSpy = setupConsoleSpy();

        setupApiError();

        const { fetchFooterSettings } = useFooterSettings();

        const result = await fetchFooterSettings();

        expect(result.column1.title).toBe('Legal');
        expect(result.column2.title).toBe('Contact');
        expect(mockStateRef.value).toEqual(result);
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch footer settings, using defaults:', expect.any(Error));

        consoleSpy.mockRestore();
      });
    });

    describe('getFooterSettings', () => {
      it('should return cached settings if available', () => {
        mockStateRef.value = mockFooterData;
        const { getFooterSettings } = useFooterSettings();

        const result = getFooterSettings();

        expect(result).toBe(mockFooterData);
      });

      it('should return default settings if cache is empty', () => {
        mockStateRef.value = null;
        const { getFooterSettings } = useFooterSettings();

        const result = getFooterSettings();

        expect(result.column1.title).toBe('Legal');
        expect(result.column2.title).toBe('Contact');
      });
    });

    describe('clearFooterCache', () => {
      it('should clear the cached footer settings', () => {
        mockStateRef.value = mockFooterData;
        const { clearFooterCache } = useFooterSettings();

        clearFooterCache();

        expect(mockStateRef.value).toBeNull();
      });
    });

    describe('updateFooterCache', () => {
      it('should update the cached footer settings', () => {
        const newSettings: FooterSettings = {
          ...mockFooterData,
          footnote: '© Updated Company 2024',
        };

        const { updateFooterCache } = useFooterSettings();

        updateFooterCache(newSettings);

        expect(mockStateRef.value).toBe(newSettings);
      });
    });

    describe('footerCache readonly access', () => {
      it('should expose readonly cache', () => {
        mockStateRef.value = mockFooterData;
        const { footerCache } = useFooterSettings();

        expect(footerCache.value).toEqual(mockFooterData);
      });
    });
  });
});
