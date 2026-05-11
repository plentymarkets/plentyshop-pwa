import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useBlockManager } from '../useBlockManager';
import type { Block } from '@plentymarkets/shop-api';

const pageBlocks = ref<Block[]>([]);
const headerContainer = ref<Block | null>(null);
const footer = ref<Block | null>(null);
const data = ref<Block[]>([]);
const cleanData = ref<Block[]>([]);
const allBlocks = ref<Block[]>([]);
const isEditingEnabled = ref(false);
const updateBlocks = vi.fn();
const openDrawerWithView = vi.fn();
const closeBlocksConfigurationDrawer = vi.fn();

mockNuxtImport('useBlocks', () => () => ({
  data,
  cleanData,
  pageBlocks,
  allBlocks,
  headerContainer,
  footer,
  updateBlocks,
}));

mockNuxtImport('useEditor', () => () => ({
  isEditingEnabled,
}));

mockNuxtImport('useBlocksList', () => () => ({
  getBlockTemplateByLanguage: vi.fn(),
}));

mockNuxtImport('useSiteConfiguration', () => () => ({
  openDrawerWithView,
  closeBlocksConfigurationDrawer,
}));

mockNuxtImport('useNotification', () => () => ({
  send: vi.fn(),
}));

mockNuxtImport('useNuxtApp', () => () => ({
  $i18n: { locale: ref('en') },
  payload: { state: {} },
  _state: {},
}));

mockNuxtImport('useViewport', () => () => ({
  isLessThan: vi.fn().mockReturnValue(false),
  isGreaterThan: vi.fn().mockReturnValue(false),
}));

const createBlock = (name = 'TestBlock', id = 'uuid-1'): Block => ({
  name,
  type: 'content',
  content: {},
  meta: { uuid: id },
});

const createHeaderContainer = (children: Block[]): Block => ({
  name: 'HeaderContainer',
  type: 'structure',
  content: children,
  meta: { uuid: 'header-uuid' },
  configuration: { layout: { sticky: false }, visible: true },
});

describe('useBlockManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pageBlocks.value = [];
    headerContainer.value = null;
    footer.value = null;
    data.value = [];
    cleanData.value = [];
    allBlocks.value = [];
    isEditingEnabled.value = false;
  });

  describe('deleteBlock', () => {
    it('should do nothing when pageBlocks is null', async () => {
      pageBlocks.value = null as unknown as Block[];
      const { deleteBlock } = useBlockManager();

      await deleteBlock('some-uuid');

      expect(closeBlocksConfigurationDrawer).not.toHaveBeenCalled();
    });

    it('should remove a block from pageBlocks when found', async () => {
      const block = createBlock('TextBlock', 'target-uuid');
      pageBlocks.value = [block];
      data.value = [block];
      allBlocks.value = [block];
      const { deleteBlock } = useBlockManager();

      await deleteBlock('target-uuid');

      expect(pageBlocks.value).toHaveLength(0);
      expect(closeBlocksConfigurationDrawer).toHaveBeenCalled();
    });

    it('should remove a child from the header container when the block is not in pageBlocks', async () => {
      const child1 = createBlock('UtilityBar', 'child-uuid-1');
      const child2 = createBlock('Navigation', 'child-uuid-2');
      headerContainer.value = createHeaderContainer([child1, child2]);
      pageBlocks.value = [];
      data.value = [];
      allBlocks.value = [];
      const { deleteBlock } = useBlockManager();

      await deleteBlock('child-uuid-1');

      const content = headerContainer.value.content as Block[];
      expect(content).toHaveLength(1);
      expect(content.at(0)?.meta.uuid).toBe('child-uuid-2');
      expect(closeBlocksConfigurationDrawer).toHaveBeenCalled();
    });

    it('should not remove the last child from the header container', async () => {
      const onlyChild = createBlock('UtilityBar', 'only-child-uuid');
      headerContainer.value = createHeaderContainer([onlyChild]);
      pageBlocks.value = [];
      data.value = [];
      allBlocks.value = [];
      const { deleteBlock } = useBlockManager();

      await deleteBlock('only-child-uuid');

      const content = headerContainer.value.content as Block[];
      expect(content).toHaveLength(1);
      expect(closeBlocksConfigurationDrawer).toHaveBeenCalled();
    });
  });
});
