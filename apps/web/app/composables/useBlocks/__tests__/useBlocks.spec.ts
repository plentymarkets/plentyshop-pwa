/* eslint-disable max-nested-callbacks */
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useBlocks } from '../useBlocks';
import type { Block, GetBlocksResponse } from '@plentymarkets/shop-api';
import type { FooterContent } from '~/components/blocks/Footer/types';
import { createProduct } from '~/utils/blockTemplates/product/factory';
import { createCategory } from '~/utils/blockTemplates/category/factory';

const mockFooterBlock: Block = {
  name: 'Footer',
  type: 'content',
  meta: { uuid: 'footer-uuid', isGlobalTemplate: true },
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

const mockHeaderContainerBlock: Block = {
  name: 'HeaderContainer',
  type: 'structure',
  meta: { uuid: 'header-uuid', isGlobalTemplate: true },
  content: [{ name: 'Navigation', type: 'content', meta: { uuid: 'nav-uuid' }, content: {} }],
};

const mockPageBlocks: Block[] = [
  { name: 'TextCard', type: 'content', meta: { uuid: 'text-1' }, content: { title: 'Test Title' } },
  { name: 'Image', type: 'content', meta: { uuid: 'image-1' }, content: { src: 'test.jpg' } },
];

const { useSdk } = vi.hoisted(() => ({
  useSdk: vi.fn().mockReturnValue({
    plentysystems: {
      getBlocksWithGlobalBlocks: vi.fn(),
      doSaveBlocksWithGlobalBlocks: vi.fn(),
    },
  }),
}));

const { useAsyncData } = vi.hoisted(() => ({
  useAsyncData: vi.fn(),
}));

const { useState } = vi.hoisted(() => ({
  useState: vi.fn(),
}));

const { useNuxtApp } = vi.hoisted(() => ({
  useNuxtApp: vi.fn().mockReturnValue({
    $i18n: {
      locale: { value: 'en' },
      te: (key: string) => key,
      t: (key: string) => key,
    },
  }),
}));

const { useHandleError } = vi.hoisted(() => ({
  useHandleError: vi.fn(),
}));

const { useEditor } = vi.hoisted(() => ({
  useEditor: vi.fn().mockReturnValue({
    isEditingEnabled: { value: false },
  }),
}));

mockNuxtImport('useSdk', () => useSdk);
mockNuxtImport('useAsyncData', () => useAsyncData);
mockNuxtImport('useState', () => useState);
mockNuxtImport('useNuxtApp', () => useNuxtApp);
mockNuxtImport('useHandleError', () => useHandleError);
mockNuxtImport('useEditor', () => useEditor);

const createMockState = () => ({
  value: {
    data: {} as GetBlocksResponse,
    cleanData: {} as GetBlocksResponse,
    defaultTemplateData: [] as Block[],
    loading: false,
    isSettling: false,
    hasSnapshot: false,
  },
});

const setupApiResponse = (responseData: unknown) =>
  useAsyncData.mockImplementation((_key: string, fetcher: () => unknown) => {
    fetcher();
    return {
      data: { value: { data: responseData } },
      error: { value: null },
    };
  });

const setupApiResponseWithMeta = (responseData: unknown, meta: Record<string, unknown>) =>
  useAsyncData.mockImplementation((_key: string, fetcher: () => unknown) => {
    fetcher();
    return {
      data: { value: { data: responseData, meta } },
      error: { value: null },
    };
  });

const noop = () => {};

const setupApiError = (errorMessage = 'API Error') =>
  useAsyncData.mockImplementation(() => ({
    data: { value: null },
    error: { value: new Error(errorMessage) },
  }));

describe('useBlocks', () => {
  let mockStateRef: ReturnType<typeof createMockState>;
  let mockGetBlocksWithGlobalBlocks: ReturnType<typeof vi.fn>;
  let mockDoSaveBlocksWithGlobalBlocks: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStateRef = createMockState();
    useState.mockReturnValue(mockStateRef);

    mockGetBlocksWithGlobalBlocks = vi.fn();
    mockDoSaveBlocksWithGlobalBlocks = vi.fn();

    useSdk.mockReturnValue({
      plentysystems: {
        getBlocksWithGlobalBlocks: mockGetBlocksWithGlobalBlocks,
        doSaveBlocksWithGlobalBlocks: mockDoSaveBlocksWithGlobalBlocks,
      },
    });

    useAsyncData.mockImplementation((_key: string, _fetcher: () => unknown) => ({
      data: { value: null },
      error: { value: null },
    }));
  });

  describe('state exposure', () => {
    it('should expose expected refs and methods', () => {
      const composable = useBlocks();
      expect(composable.data).toBeDefined();
      expect(composable.cleanData).toBeDefined();
      expect(composable.pageBlocks).toBeDefined();
      expect(composable.allBlocks).toBeDefined();
      expect(composable.headerContainer).toBeDefined();
      expect(composable.footer).toBeDefined();
      expect(composable.loading).toBeDefined();
      expect(composable.defaultTemplateData).toBeDefined();
      expect(composable.isSettling).toBeDefined();
    });
  });

  describe('fetchBlocks', () => {
    it('should call SDK with correct parameters and cache key', async () => {
      setupApiResponse({ HeaderContainer: mockHeaderContainerBlock, blocks: mockPageBlocks, Footer: mockFooterBlock });
      await useBlocks().fetchBlocks('test-id', 'category');
      expect(useAsyncData).toHaveBeenCalledWith('blocks-en-category-test-id', expect.any(Function), expect.anything());
      expect(mockGetBlocksWithGlobalBlocks).toHaveBeenCalledWith({
        identifier: 'test-id',
        type: 'category',
        enableGlobalBlocks: true,
      });
    });

    it('should assemble and store blocks from the API response', async () => {
      setupApiResponse({ HeaderContainer: mockHeaderContainerBlock, blocks: mockPageBlocks, Footer: mockFooterBlock });
      await useBlocks().fetchBlocks('index', 'immutable');
      expect(mockStateRef.value.data.HeaderContainer?.meta.uuid).toBe('header-uuid');
      expect(mockStateRef.value.data.Footer?.meta.uuid).toBe('footer-uuid');
      expect(mockStateRef.value.data.blocks).toHaveLength(2);
      expect(mockStateRef.value.data.blocks[0]?.name).toBe('TextCard');
      expect(mockStateRef.value.loading).toBe(false);
    });

    it('should set cleanData equal to data after fetch', async () => {
      setupApiResponse({ HeaderContainer: mockHeaderContainerBlock, blocks: mockPageBlocks, Footer: mockFooterBlock });
      await useBlocks().fetchBlocks('index', 'immutable');
      expect(JSON.stringify(mockStateRef.value.cleanData)).toEqual(JSON.stringify(mockStateRef.value.data));
    });

    it('should warn and still assemble defaults when API returns an error', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(noop);
      setupApiError('Network failure');
      await useBlocks().fetchBlocks('index', 'immutable');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch blocks:', 'Network failure');
      expect(mockStateRef.value.data.Footer).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should set loading to false after successful fetch', async () => {
      setupApiResponse({ HeaderContainer: mockHeaderContainerBlock, blocks: mockPageBlocks, Footer: mockFooterBlock });
      await useBlocks().fetchBlocks('index', 'immutable');
      expect(mockStateRef.value.loading).toBe(false);
    });

    it('should not apply default blocks when meta.hasSnapshot is true and blocks array is empty', async () => {
      setupApiResponseWithMeta(
        { HeaderContainer: mockHeaderContainerBlock, blocks: [], Footer: mockFooterBlock },
        { hasSnapshot: true },
      );
      await useBlocks().fetchBlocks('index', 'immutable');
      expect(mockStateRef.value.hasSnapshot).toBe(true);
      expect(mockStateRef.value.data.blocks).toHaveLength(0);
    });
  });

  describe('saveBlocks', () => {
    it('should call SDK doSaveBlocksWithGlobalBlocks with correct parameters', async () => {
      mockDoSaveBlocksWithGlobalBlocks.mockResolvedValue({
        data: { HeaderContainer: mockHeaderContainerBlock, blocks: mockPageBlocks, Footer: mockFooterBlock },
      });
      const content = JSON.stringify(mockPageBlocks);
      await useBlocks().saveBlocks('test-id', 'category', content);
      expect(mockDoSaveBlocksWithGlobalBlocks).toHaveBeenCalledWith(
        expect.objectContaining({
          identifier: 'test-id',
          entityType: 'category',
          blocks: content,
          enableGlobalBlocks: true,
        }),
      );
    });

    it('should return true on successful save', async () => {
      mockDoSaveBlocksWithGlobalBlocks.mockResolvedValue({
        data: { HeaderContainer: mockHeaderContainerBlock, blocks: mockPageBlocks, Footer: mockFooterBlock },
      });
      const result = await useBlocks().saveBlocks('test-id', 'category', JSON.stringify(mockPageBlocks));
      expect(result).toBe(true);
    });

    it('should return false and call useHandleError on save failure', async () => {
      const error = new Error('Save failed');
      mockDoSaveBlocksWithGlobalBlocks.mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(noop);
      const result = await useBlocks().saveBlocks('test-id', 'category', JSON.stringify(mockPageBlocks));
      expect(result).toBe(false);
      expect(useHandleError).toHaveBeenCalledWith(error);
      expect(consoleSpy).toHaveBeenCalledWith('Error saving blocks:', error);
      consoleSpy.mockRestore();
    });

    it('should set loading to false after save regardless of outcome', async () => {
      mockDoSaveBlocksWithGlobalBlocks.mockRejectedValue(new Error('fail'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(noop);
      await useBlocks().saveBlocks('id', 'type', '[]');
      expect(mockStateRef.value.loading).toBe(false);
      consoleSpy.mockRestore();
    });

    it('should not apply default blocks when saving results in an empty blocks array', async () => {
      mockDoSaveBlocksWithGlobalBlocks.mockResolvedValue({
        data: { HeaderContainer: mockHeaderContainerBlock, blocks: [], Footer: mockFooterBlock },
      });
      await useBlocks().saveBlocks('index', 'immutable', '[]');
      expect(mockStateRef.value.hasSnapshot).toBe(true);
      expect(mockStateRef.value.data.blocks).toHaveLength(0);
    });
  });

  describe('updateBlocks', () => {
    it('should update page blocks in state', () => {
      const newBlocks = [...mockPageBlocks];
      mockStateRef.value.data = {
        blocks: [],
        HeaderContainer: undefined,
        Footer: undefined,
      } as unknown as GetBlocksResponse;
      useBlocks().updateBlocks(newBlocks);
      expect(mockStateRef.value.data.blocks).toBe(newBlocks);
    });
  });

  describe('discardChanges', () => {
    it('should restore data from cleanData snapshot', () => {
      const clean = { blocks: mockPageBlocks, HeaderContainer: mockHeaderContainerBlock, Footer: mockFooterBlock };
      mockStateRef.value.cleanData = clean as unknown as GetBlocksResponse;
      mockStateRef.value.data = {
        blocks: [],
        HeaderContainer: undefined,
        Footer: undefined,
      } as unknown as GetBlocksResponse;
      useBlocks().discardChanges();
      expect(JSON.stringify(mockStateRef.value.data)).toEqual(JSON.stringify(clean));
    });
  });

  describe('setDefaultTemplate', () => {
    it('should set defaultTemplateData in state', () => {
      useBlocks().setDefaultTemplate(mockPageBlocks);
      expect(mockStateRef.value.defaultTemplateData).toBe(mockPageBlocks);
    });
  });

  describe('default blocks fallback', () => {
    it('should assemble default product blocks with HeaderContainer and Footer when API returns no blocks', async () => {
      setupApiResponse({ HeaderContainer: mockHeaderContainerBlock, blocks: [], Footer: mockFooterBlock });
      await useBlocks().fetchBlocks(0, 'product');
      expect(mockStateRef.value.data.HeaderContainer).toBeDefined();
      expect(mockStateRef.value.data.Footer).toBeDefined();
      expect(mockStateRef.value.data.blocks?.map((b) => b.name)).toEqual(createProduct().map((b) => b.name));
    });

    it('should assemble default category blocks when API returns no blocks for global template', async () => {
      setupApiResponse({ HeaderContainer: mockHeaderContainerBlock, blocks: [], Footer: mockFooterBlock });
      await useBlocks().fetchBlocks(0, 'category');
      expect(mockStateRef.value.data.blocks?.map((b) => b.name)).toEqual(createCategory().map((b) => b.name));
    });
  });
});
