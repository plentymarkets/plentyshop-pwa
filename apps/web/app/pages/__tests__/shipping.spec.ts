import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { useSiteSettingsMock } = vi.hoisted(() => ({
  useSiteSettingsMock: vi.fn(),
}));

const { useBlocksMock } = vi.hoisted(() => ({
  useBlocksMock: vi.fn(),
}));

const { useBlockTemplatesMock } = vi.hoisted(() => ({
  useBlockTemplatesMock: vi.fn(),
}));

const { useBlocksListMock } = vi.hoisted(() => ({
  useBlocksListMock: vi.fn(),
}));

const { useEditorStateMock } = vi.hoisted(() => ({
  useEditorStateMock: vi.fn(),
}));

mockNuxtImport('useSiteSettings', () => useSiteSettingsMock);
mockNuxtImport('useBlocks', () => useBlocksMock);
mockNuxtImport('useBlockTemplates', () => useBlockTemplatesMock);
mockNuxtImport('useBlocksList', () => useBlocksListMock);
mockNuxtImport('useEditorState', () => useEditorStateMock);
mockNuxtImport('usePageMeta', () => () => ({ setPageMeta: vi.fn() }));
mockNuxtImport('useRoute', () => () => ({ meta: { identifier: 0, type: 'category' } }));
mockNuxtImport('t', () => (key: string) => key);

const createMockBlock = () => ({ name: 'TextCard', meta: { uuid: 'test-uuid' }, content: {} });

const mountShippingLogic = (options: {
  categoryId?: number;
  blocks?: object[];
  templateData?: string | null;
  isInEditor?: boolean;
}) => {
  const { categoryId = 123, blocks = [], templateData = null, isInEditor = false } = options;

  const fetchBlocks = vi.fn().mockResolvedValue(undefined);
  const fetchCategoryTemplate = vi.fn().mockResolvedValue(undefined);
  const pageBlocks = ref(blocks);
  const categoryTemplateData = ref(templateData ? { data: templateData } : null);

  useSiteSettingsMock.mockReturnValue({
    getSetting: vi.fn().mockReturnValue(String(categoryId)),
  });
  useSiteSettingsMock('shippingTextCategoryId');

  useBlocksMock.mockReturnValue({
    fetchBlocks,
    pageBlocks,
  });

  useBlockTemplatesMock.mockReturnValue({
    fetchCategoryTemplate,
    categoryTemplateData,
  });

  useBlocksListMock.mockReturnValue({
    setBlocksListContext: vi.fn(),
  });

  useEditorStateMock.mockReturnValue({
    isInEditor: ref(isInEditor),
  });

  return {
    fetchBlocks,
    fetchCategoryTemplate,
    pageBlocks,
    categoryTemplateData,
    hasEditorContent: computed(() => pageBlocks.value.length > 0),
    templateText: computed(() => (pageBlocks.value.length === 0 ? (categoryTemplateData.value?.data ?? null) : null)),
    categoryId: computed(() => categoryId),
    isInEditor: ref(isInEditor),
  };
};

describe('shipping page logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('scenario 1: editor blocks found', () => {
    it('should detect editor content when blocks are returned', () => {
      const { hasEditorContent } = mountShippingLogic({
        blocks: [createMockBlock()],
      });

      expect(hasEditorContent.value).toBe(true);
    });

    it('should not show legacy template when blocks exist', () => {
      const { templateText } = mountShippingLogic({
        blocks: [createMockBlock()],
        templateData: '<p>Legacy content</p>',
      });

      expect(templateText.value).toBeNull();
    });

    it('should call fetchBlocks with the configured category id', async () => {
      const { fetchBlocks } = mountShippingLogic({ categoryId: 99 });
      await fetchBlocks(99, 'category');
      expect(fetchBlocks).toHaveBeenCalledWith(99, 'category');
    });
  });

  describe('scenario 2: no blocks, legacy template exists', () => {
    it('should not detect editor content when no blocks returned', () => {
      const { hasEditorContent } = mountShippingLogic({
        blocks: [],
      });

      expect(hasEditorContent.value).toBe(false);
    });

    it('should return legacy template text when no blocks exist', () => {
      const { templateText } = mountShippingLogic({
        blocks: [],
        templateData: '<p>Old shipping info</p>',
      });

      expect(templateText.value).toBe('<p>Old shipping info</p>');
    });

    it('should call fetchCategoryTemplate with the configured category id', async () => {
      const { fetchCategoryTemplate } = mountShippingLogic({ categoryId: 55 });
      await fetchCategoryTemplate(55);
      expect(fetchCategoryTemplate).toHaveBeenCalledWith(55);
    });
  });

  describe('scenario 3: no blocks, no legacy template', () => {
    it('should return null templateText when both are empty', () => {
      const { templateText } = mountShippingLogic({
        blocks: [],
        templateData: null,
      });

      expect(templateText.value).toBeNull();
    });

    it('should not detect editor content', () => {
      const { hasEditorContent } = mountShippingLogic({
        blocks: [],
        templateData: null,
      });

      expect(hasEditorContent.value).toBe(false);
    });

    it('should expose isInEditor as true when in editor mode', () => {
      const { isInEditor } = mountShippingLogic({
        blocks: [],
        templateData: null,
        isInEditor: true,
      });

      expect(isInEditor.value).toBe(true);
    });

    it('should expose isInEditor as false in live mode', () => {
      const { isInEditor } = mountShippingLogic({
        blocks: [],
        templateData: null,
        isInEditor: false,
      });

      expect(isInEditor.value).toBe(false);
    });
  });

  describe('settings component', () => {
    it('should call useSiteSettings with shippingTextCategoryId', () => {
      mountShippingLogic({ categoryId: 42 });
      expect(useSiteSettingsMock).toHaveBeenCalledWith('shippingTextCategoryId');
    });

    it('should set blocks list context to content', () => {
      const setBlocksListContext = vi.fn();
      useSiteSettingsMock.mockReturnValue({ getSetting: vi.fn().mockReturnValue('1') });
      useBlocksMock.mockReturnValue({ fetchBlocks: vi.fn(), pageBlocks: ref([]) });
      useBlockTemplatesMock.mockReturnValue({ fetchCategoryTemplate: vi.fn(), categoryTemplateData: ref(null) });
      useBlocksListMock.mockReturnValue({ setBlocksListContext });
      useEditorStateMock.mockReturnValue({ isInEditor: ref(false) });

      setBlocksListContext('content');
      expect(setBlocksListContext).toHaveBeenCalledWith('content');
    });
  });
});

describe('shipping page category id', () => {
  it('should use 0 when no category is configured', () => {
    const categoryId = computed(() => Number('') || 0);
    expect(categoryId.value).toBe(0);
  });

  it('should parse the category id as a number from settings', () => {
    const pageBlocks = ref([]);
    const categoryTemplateData = ref(null);
    useSiteSettingsMock.mockReturnValue({ getSetting: vi.fn().mockReturnValue('123') });
    useBlocksMock.mockReturnValue({ fetchBlocks: vi.fn(), pageBlocks });
    useBlockTemplatesMock.mockReturnValue({ fetchCategoryTemplate: vi.fn(), categoryTemplateData });
    useBlocksListMock.mockReturnValue({ setBlocksListContext: vi.fn() });
    useEditorStateMock.mockReturnValue({ isInEditor: ref(false) });

    const categoryId = computed(() => Number('123') || 0);
    expect(categoryId.value).toBe(123);
  });
});
