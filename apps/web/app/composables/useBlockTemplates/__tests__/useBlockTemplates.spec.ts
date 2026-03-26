/* eslint-disable max-lines */
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useBlockTemplates } from '../useBlockTemplates';
import type { FooterContent, FooterBlock } from '~/components/blocks/Footer/types';
import type { Block } from '@plentymarkets/shop-api';
import type { TextCardContent } from '~/components/blocks/TextCard/types';

const mockFooterBlock: FooterBlock = {
  name: 'Footer',
  type: 'content',
  meta: { uuid: 'test-uuid', isGlobalTemplate: true },
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
  } as FooterContent,
};

const mockBlocks: Block[] = [
  { name: 'TextCard', type: 'content', meta: { uuid: 'text-1' }, content: { title: 'Test Title' } },
  { name: 'Image', type: 'content', meta: { uuid: 'image-1' }, content: { src: 'test.jpg' } },
];

const { useSdk } = vi.hoisted(() => {
  return {
    useSdk: vi.fn().mockReturnValue({
      plentysystems: {
        getBlocks: vi.fn(),
        doSaveBlocks: vi.fn(),
        getCategoryTemplate: vi.fn(),
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

const { useRuntimeConfig } = vi.hoisted(() => {
  return {
    useRuntimeConfig: vi.fn().mockReturnValue({
      public: {
        storename: 'Test Store',
        enableRichTextEditorV2: false,
      },
    }),
  };
});

const { useNotification } = vi.hoisted(() => {
  return {
    useNotification: vi.fn().mockReturnValue({
      send: vi.fn(),
    }),
  };
});

const { useHandleError } = vi.hoisted(() => {
  return {
    useHandleError: vi.fn(),
  };
});

mockNuxtImport('useSdk', () => useSdk);
mockNuxtImport('useAsyncData', () => useAsyncData);
mockNuxtImport('useState', () => useState);
mockNuxtImport('useRuntimeConfig', () => useRuntimeConfig);
mockNuxtImport('useNotification', () => useNotification);
mockNuxtImport('useHandleError', () => useHandleError);

const setupApiResponse = (responseData: unknown) =>
  useAsyncData.mockImplementation((_key, _fetcher) => ({
    data: { value: responseData },
    error: { value: null },
  }));

const setupApiCall = () =>
  useAsyncData.mockImplementation((_key, fetcher) => {
    fetcher();
    return { data: { value: null }, error: { value: null } };
  });

const setupApiError = (errorMessage = 'API Error') =>
  useAsyncData.mockImplementation(() => ({
    data: { value: null },
    error: { value: new Error(errorMessage) },
  }));

const setupConsoleSpy = () => vi.spyOn(console, 'warn').mockImplementation(() => {});

const createMockState = () => ({
  value: {
    data: [] as Block[],
    cleanData: [] as Block[],
    categoryTemplateData: null as unknown,
    defaultTemplateData: [] as Block[],
    loading: false,
  },
});

describe('useBlockTemplates', () => {
  let mockStateRef: ReturnType<typeof createMockState>;
  let mockGetBlocks: ReturnType<typeof vi.fn>;
  let mockDoSaveBlocks: ReturnType<typeof vi.fn>;
  let mockGetCategoryTemplate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStateRef = createMockState();

    useState.mockImplementation(() => mockStateRef);

    mockGetBlocks = vi.fn();
    mockDoSaveBlocks = vi.fn();
    mockGetCategoryTemplate = vi.fn();

    useSdk.mockReturnValue({
      plentysystems: {
        getBlocks: mockGetBlocks,
        doSaveBlocks: mockDoSaveBlocks,
        getCategoryTemplate: mockGetCategoryTemplate,
      },
    });

    useAsyncData.mockImplementation((_key, _fetcher) => ({
      data: { value: null },
      error: { value: null },
    }));
  });

  describe('extractFooterContentFromBlocks', () => {
    it.each([
      {
        name: 'should extract footer content from valid JSON blocks array',
        input: JSON.stringify([
          { name: 'Header', content: { title: 'Header' } },
          { name: 'Footer', content: mockFooterBlock.content },
          { name: 'Content', content: { body: 'Content' } },
        ]),
        expected: mockFooterBlock.content,
      },
      {
        name: 'should return null if no footer block is found',
        input: JSON.stringify([
          { name: 'Header', content: { title: 'Header' } },
          { name: 'Content', content: { body: 'Content' } },
        ]),
        expected: null,
      },
      {
        name: 'should return null if blocks is not an array',
        input: JSON.stringify({ name: 'Footer', content: mockFooterBlock.content }),
        expected: null,
      },
      {
        name: 'should return null if footer block has no content',
        input: JSON.stringify([{ name: 'Footer' }]),
        expected: null,
      },
    ])('$name', ({ input, expected }) => {
      const { extractFooterContentFromBlocks } = useBlockTemplates();
      expect(extractFooterContentFromBlocks(input)).toEqual(expected);
    });

    it('should return null and log warning for invalid JSON', () => {
      const consoleSpy = setupConsoleSpy();
      const { extractFooterContentFromBlocks } = useBlockTemplates();

      expect(extractFooterContentFromBlocks('invalid json')).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to extract footer from blocks:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('factory functions', () => {
    it('createFooterBlock - should create a footer block with provided content', () => {
      const content = mockFooterBlock.content as FooterContent;
      const result = useBlockTemplates().createFooterBlock(content);
      expect(result.name).toBe('Footer');
      expect(result.type).toBe('content');
      expect(result.content).toBe(content);
    });

    it('createFooterBlock - should create a footer block with custom meta', () => {
      const content = mockFooterBlock.content as FooterContent;
      const meta = { uuid: 'custom-uuid', isGlobalTemplate: false };
      const result = useBlockTemplates().createFooterBlock(content, meta);
      expect(result.meta.uuid).toBe('custom-uuid');
      expect(result.meta.isGlobalTemplate).toBe(false);
    });

    it('createDefaultFooterBlock - should create a default footer block', () => {
      const result = useBlockTemplates().createDefaultFooterBlock();
      expect(result.name).toBe('Footer');
      expect(result.type).toBe('content');
      expect(result.meta.isGlobalTemplate).toBe(true);
    });
  });

  describe('block operations', () => {
    it('mapFooterData - should map block to footer block with defaults', () => {
      const inputBlock: Block = {
        name: 'Footer',
        type: 'content',
        meta: { uuid: 'test-uuid' },
        content: { column1: { title: 'Custom Legal' } },
      };
      const result = useBlockTemplates().mapFooterData(inputBlock);
      expect(result.name).toBe('Footer');
      expect((result.content as FooterContent).column1.title).toBe('Custom Legal');
      expect((result.content as FooterContent).column2).toBeDefined();
    });

    it('mapFooterData - should return default footer if input is null', () => {
      const result = useBlockTemplates().mapFooterData(null);
      expect(result.name).toBe('Footer');
      expect(result.type).toBe('content');
    });
  });

  it('FOOTER_SWITCH_DEFINITIONS - should expose footer switch definitions', () => {
    const { FOOTER_SWITCH_DEFINITIONS } = useBlockTemplates();
    expect(FOOTER_SWITCH_DEFINITIONS).toBeDefined();
    expect(Array.isArray(FOOTER_SWITCH_DEFINITIONS)).toBe(true);
    expect(FOOTER_SWITCH_DEFINITIONS.length).toBeGreaterThan(0);
  });

  describe('getBlocksServer', () => {
    it('should fetch blocks from server using useAsyncData', async () => {
      setupApiResponse({ data: mockBlocks });
      const { getBlocksServer } = useBlockTemplates('test-id', 'category');
      const { $i18n } = useNuxtApp();

      await getBlocksServer('test-id', 'category');

      expect(useAsyncData).toHaveBeenCalledWith(
        `${$i18n.locale.value}-category-test-id-undefined`,
        expect.any(Function),
      );
      expect(mockStateRef.value.loading).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      setupApiError('Server error');
      const { send } = useNotification();
      await useBlockTemplates().getBlocksServer('test-id', 'category');
      expect(send).toHaveBeenCalledWith({ type: 'negative', message: 'Server error' });
    });

    it('should set loading state correctly', async () => {
      setupApiResponse({ data: mockBlocks });
      const { getBlocksServer, loading } = useBlockTemplates();
      await getBlocksServer('test-id', 'category');
      expect(loading.value).toBe(false);
    });
  });

  describe('getBlocks', () => {
    it('should fetch blocks directly from SDK', async () => {
      mockGetBlocks.mockResolvedValue({ data: mockBlocks });
      await useBlockTemplates().getBlocks('test-id', 'category');
      expect(mockGetBlocks).toHaveBeenCalledWith({ identifier: 'test-id', type: 'category', blocks: undefined });
      expect(mockStateRef.value.loading).toBe(false);
    });

    it('should handle blocks parameter', async () => {
      mockGetBlocks.mockResolvedValue({ data: mockBlocks });
      await useBlockTemplates().getBlocks('test-id', 'category', 'Footer');
      expect(mockGetBlocks).toHaveBeenCalledWith({ identifier: 'test-id', type: 'category', blocks: 'Footer' });
    });
  });

  describe('saveBlocks', () => {
    it('should save blocks successfully', async () => {
      mockDoSaveBlocks.mockResolvedValue({ success: true });
      const result = await useBlockTemplates().saveBlocks('test-id', 'category', JSON.stringify(mockBlocks));
      expect(mockDoSaveBlocks).toHaveBeenCalledWith({
        identifier: 'test-id',
        entityType: 'category',
        blocks: JSON.stringify(mockBlocks),
      });
      expect(result).toBe(true);
    });

    it('should call setupBlocks with response data after save', async () => {
      const savedBlocks = [...mockBlocks, mockFooterBlock];
      mockDoSaveBlocks.mockResolvedValue({ data: savedBlocks });
      await useBlockTemplates().saveBlocks('test-id', 'category', JSON.stringify(savedBlocks));
      expect(mockStateRef.value.data.at(-1)?.name).toBe('Footer');
    });

    it('should handle save errors', async () => {
      const error = new Error('Save failed');
      mockDoSaveBlocks.mockRejectedValue(error);
      const noOp = () => {};
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(noOp);

      const result = await useBlockTemplates().saveBlocks('test-id', 'category', JSON.stringify(mockBlocks));

      expect(result).toBe(false);
      expect(useHandleError).toHaveBeenCalledWith(error);
      expect(consoleSpy).toHaveBeenCalledWith('Error saving blocks:', error);
      consoleSpy.mockRestore();
    });
  });

  it('updateBlocks - should update blocks in state', () => {
    const newBlocks = [...mockBlocks];
    useBlockTemplates().updateBlocks(newBlocks);
    expect(mockStateRef.value.data).toBe(newBlocks);
  });

  it('setDefaultTemplate - should set default template data', () => {
    const defaultBlocks = [...mockBlocks];
    useBlockTemplates().setDefaultTemplate(defaultBlocks);
    expect(mockStateRef.value.defaultTemplateData).toBe(defaultBlocks);
  });

  it('fetchCategoryTemplate - should fetch category template data', async () => {
    setupApiResponse({ data: { id: 1, name: 'Test Template' } });
    await useBlockTemplates().fetchCategoryTemplate(1);
    expect(useAsyncData).toHaveBeenCalledWith('fetchCategoryTemplate-1', expect.any(Function));
  });

  describe('setupBlocks', () => {
    it('should wrap content blocks with HeaderContainer first and Footer last', () => {
      useBlockTemplates().setupBlocks(mockBlocks);

      expect(mockStateRef.value.data).toHaveLength(mockBlocks.length + 2);
      expect(mockStateRef.value.data[0]?.name).toBe('HeaderContainer');
      expect(mockStateRef.value.data[1]).toEqual(mockBlocks[0]);
      expect(mockStateRef.value.data[2]).toEqual(mockBlocks[1]);
      expect(mockStateRef.value.data[3]?.name).toBe('Footer');
      expect(mockStateRef.value.cleanData).toBeDefined();
    });

    it('should produce only HeaderContainer and Footer when no content blocks are given', () => {
      const { setupBlocks, setDefaultTemplate } = useBlockTemplates();
      setDefaultTemplate([]);
      setupBlocks([]);

      expect(mockStateRef.value.data).toHaveLength(2);
      expect(mockStateRef.value.data[0]?.name).toBe('HeaderContainer');
      expect(mockStateRef.value.data[1]?.name).toBe('Footer');
    });

    it('should fall back to the default template when server returns no content blocks', () => {
      const { setupBlocks, setDefaultTemplate } = useBlockTemplates();
      setDefaultTemplate(mockBlocks);
      setupBlocks([]);

      expect(mockStateRef.value.data).toHaveLength(mockBlocks.length + 2);
      expect(mockStateRef.value.data[0]?.name).toBe('HeaderContainer');
      expect(mockStateRef.value.data[1]).toEqual(mockBlocks[0]);
      expect(mockStateRef.value.data[2]).toEqual(mockBlocks[1]);
      expect(mockStateRef.value.data[3]?.name).toBe('Footer');
    });

    it('should use the fetched footer block from the API response', () => {
      const blocksWithFooter = [...mockBlocks, mockFooterBlock];
      useBlockTemplates().setupBlocks(blocksWithFooter);
      expect(mockStateRef.value.data).toHaveLength(mockBlocks.length + 2);
      expect(mockStateRef.value.data[0]?.name).toBe('HeaderContainer');
      expect(mockStateRef.value.data[1]).toEqual(mockBlocks[0]);
      expect(mockStateRef.value.data[2]).toEqual(mockBlocks[1]);
      expect(mockStateRef.value.data[3]).toEqual(mockFooterBlock);
    });

    it('should use a default footer when no footer is in the fetched blocks', () => {
      useBlockTemplates().setupBlocks(mockBlocks);
      expect(mockStateRef.value.data).toHaveLength(mockBlocks.length + 2);
      expect(mockStateRef.value.data[mockBlocks.length + 1]?.name).toBe('Footer');
    });

    it('should always place the footer last regardless of its position in the input blocks', () => {
      const blocksWithFooterFirst = [mockFooterBlock, ...mockBlocks];
      useBlockTemplates().setupBlocks(blocksWithFooterFirst);
      expect(mockStateRef.value.data).toHaveLength(mockBlocks.length + 2);
      expect(mockStateRef.value.data[mockBlocks.length + 1]?.name).toBe('Footer');
    });

    it('should set h1 on the first Banner inside a Carousel when Carousel is the first content block', () => {
      useRuntimeConfig.mockReturnValue({
        public: { enableRichTextEditorV2: true },
      });

      const firstBanner: Block = {
        name: 'Banner',
        type: 'content',
        meta: { uuid: 'banner-first' },
        content: { text: { title: 'First Banner', pretitle: 'Pre', subtitle: '' } },
      };

      const secondBanner: Block = {
        name: 'Banner',
        type: 'content',
        meta: { uuid: 'banner-second' },
        content: { text: { title: 'Second Banner', pretitle: 'Pre', subtitle: '' } },
      };

      const blocks: Block[] = [
        {
          name: 'HeaderContainer',
          type: 'structure',
          meta: { uuid: 'header-1' },
          content: [],
        },
        {
          name: 'Carousel',
          type: 'structure',
          meta: { uuid: 'carousel-1' },
          content: [firstBanner, secondBanner],
        },
      ];

      useBlockTemplates().setupBlocks(blocks);

      expect((firstBanner.content as Partial<TextCardContent>)?.text?.htmlDescription).toContain('<h1>');
      expect((secondBanner.content as Partial<TextCardContent>)?.text?.htmlDescription).toContain('<h2>');
      expect((secondBanner.content as Partial<TextCardContent>)?.text?.htmlDescription).not.toContain('<h1>');
    });

    it('should not set h1 on blocks inside the HeaderContainer', () => {
      useRuntimeConfig.mockReturnValue({
        public: { enableRichTextEditorV2: true },
      });

      const headerInnerBlock: Block = {
        name: 'TextCard',
        type: 'content',
        meta: { uuid: 'textcard-in-header' },
        content: { text: { title: 'Header Text', pretitle: '', subtitle: '' } },
      };

      const firstContentBlock: Block = {
        name: 'TextCard',
        type: 'content',
        meta: { uuid: 'textcard-first' },
        content: { text: { title: 'First Content', pretitle: '', subtitle: '' } },
      };

      const blocks: Block[] = [
        {
          name: 'HeaderContainer',
          type: 'structure',
          meta: { uuid: 'header-1' },
          content: [headerInnerBlock],
        },
        firstContentBlock,
      ];

      useBlockTemplates().setupBlocks(blocks);

      expect((headerInnerBlock.content as Partial<TextCardContent>)?.text?.htmlDescription).not.toContain('<h1>');
      expect((firstContentBlock.content as Partial<TextCardContent>)?.text?.htmlDescription).toContain('<h1>');
    });
  });

  describe('State management', () => {
    it('should expose readonly refs for state properties', () => {
      const { data, cleanData, loading, categoryTemplateData, headerContainerBlock, footerBlock } = useBlockTemplates();
      expect(data).toBeDefined();
      expect(cleanData).toBeDefined();
      expect(loading).toBeDefined();
      expect(categoryTemplateData).toBeDefined();
      expect(headerContainerBlock).toBeDefined();
      expect(footerBlock).toBeDefined();
    });

    it('should create unique state per identifier-type-locale combination', () => {
      useBlockTemplates('id1', 'type1', 'en');
      useBlockTemplates('id2', 'type2', 'de');
      expect(useState).toHaveBeenCalledWith(
        expect.stringContaining('useBlockTemplates-id1-type1-en'),
        expect.any(Function),
      );
      expect(useState).toHaveBeenCalledWith(
        expect.stringContaining('useBlockTemplates-id2-type2-de'),
        expect.any(Function),
      );
    });
  });
});
