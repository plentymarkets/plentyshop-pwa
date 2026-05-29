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

const createFooterContainer = (children: Block[]): Block => ({
  name: 'FooterContainer',
  type: 'structure',
  content: children,
  meta: { uuid: 'footer-uuid' },
  configuration: { visible: true },
});

const createStructureBlock = (children: Block[], id = 'structure-uuid'): Block => ({
  name: 'MultiGrid',
  type: 'structure',
  content: children,
  meta: { uuid: id },
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

    it('should remove a top-level child from the footer container', async () => {
      const child1 = createBlock('TextCard', 'footer-child-1');
      const child2 = createBlock('TextCard', 'footer-child-2');
      footer.value = createFooterContainer([child1, child2]);
      pageBlocks.value = [];
      data.value = [];
      allBlocks.value = [];
      const { deleteBlock } = useBlockManager();

      await deleteBlock('footer-child-1');

      const content = footer.value.content as Block[];
      expect(content).toHaveLength(1);
      expect(content.at(0)?.meta.uuid).toBe('footer-child-2');
      expect(closeBlocksConfigurationDrawer).toHaveBeenCalled();
    });

    it('should remove a nested child from inside the footer container', async () => {
      const nested = createBlock('TextCard', 'nested-uuid');
      const grid = createStructureBlock([nested], 'grid-uuid');
      const sibling = createBlock('TextCard', 'sibling-uuid');
      footer.value = createFooterContainer([grid, sibling]);
      pageBlocks.value = [];
      data.value = [];
      allBlocks.value = [];
      const { deleteBlock } = useBlockManager();

      await deleteBlock('nested-uuid');

      const content = footer.value.content as Block[];
      expect(content).toHaveLength(2);
      expect(content[0]?.content as Block[]).toHaveLength(0);
      expect(closeBlocksConfigurationDrawer).toHaveBeenCalled();
    });
  });

  describe('deleteBlockHard', () => {
    it('should do nothing when pageBlocks is null', () => {
      pageBlocks.value = null as unknown as Block[];
      const { deleteBlockHard } = useBlockManager();

      deleteBlockHard('some-uuid');

      expect(closeBlocksConfigurationDrawer).not.toHaveBeenCalled();
    });

    it('should remove a top-level block from pageBlocks', () => {
      const block = createBlock('TextBlock', 'target-uuid');
      pageBlocks.value = [block];
      data.value = [block];
      allBlocks.value = [block];
      const { deleteBlockHard } = useBlockManager();

      deleteBlockHard('target-uuid');

      expect(pageBlocks.value).toHaveLength(0);
      expect(closeBlocksConfigurationDrawer).toHaveBeenCalled();
    });

    it('should remove a top-level child from the header container', () => {
      const child1 = createBlock('UtilityBar', 'child-uuid-1');
      const child2 = createBlock('Navigation', 'child-uuid-2');
      headerContainer.value = createHeaderContainer([child1, child2]);
      const { deleteBlockHard } = useBlockManager();

      deleteBlockHard('child-uuid-1');

      const content = headerContainer.value.content as Block[];
      expect(content).toHaveLength(1);
      expect(content.at(0)?.meta.uuid).toBe('child-uuid-2');
      expect(closeBlocksConfigurationDrawer).toHaveBeenCalled();
    });

    it('should remove a nested child from inside the header container', () => {
      const nested = createBlock('TextBlock', 'header-nested-uuid');
      const grid = createStructureBlock([nested], 'header-grid-uuid');
      const sibling = createBlock('Navigation', 'header-sibling-uuid');
      headerContainer.value = createHeaderContainer([grid, sibling]);
      const { deleteBlockHard } = useBlockManager();

      deleteBlockHard('header-nested-uuid');

      const content = headerContainer.value.content as Block[];
      expect(content).toHaveLength(2);
      expect(content[0]?.content as Block[]).toHaveLength(0);
      expect(closeBlocksConfigurationDrawer).toHaveBeenCalled();
    });

    it('should not remove the last top-level child from the header container', () => {
      const onlyChild = createBlock('UtilityBar', 'only-child-uuid');
      headerContainer.value = createHeaderContainer([onlyChild]);
      const { deleteBlockHard } = useBlockManager();

      deleteBlockHard('only-child-uuid');

      const content = headerContainer.value.content as Block[];
      expect(content).toHaveLength(1);
      expect(closeBlocksConfigurationDrawer).toHaveBeenCalled();
    });

    it('should remove a top-level child from the footer container', () => {
      const child1 = createBlock('TextCard', 'footer-child-1');
      const child2 = createBlock('TextCard', 'footer-child-2');
      footer.value = createFooterContainer([child1, child2]);
      const { deleteBlockHard } = useBlockManager();

      deleteBlockHard('footer-child-1');

      const content = footer.value.content as Block[];
      expect(content).toHaveLength(1);
      expect(content.at(0)?.meta.uuid).toBe('footer-child-2');
      expect(closeBlocksConfigurationDrawer).toHaveBeenCalled();
    });

    it('should remove a nested block from a column and drop its column width', () => {
      const nested: Block = { ...createBlock('TextBlock', 'col-nested-uuid'), parent_slot: 1 };
      const sibling: Block = { ...createBlock('TextBlock', 'col-sibling-uuid'), parent_slot: 0 };
      const grid: Block = {
        name: 'MultiGrid',
        type: 'structure',
        content: [sibling, nested],
        meta: { uuid: 'grid-uuid' },
        configuration: {
          visible: true,
          columnWidths: [50, 50],
          columnWidthsTablet: [50, 50],
          columnWidthsMobile: [100, 100],
        },
      };
      pageBlocks.value = [grid];
      data.value = [grid];
      allBlocks.value = [grid];
      const { deleteBlockHard } = useBlockManager();

      deleteBlockHard('col-nested-uuid');

      const content = grid.content as Block[];
      expect(content).toHaveLength(1);
      expect(content[0]?.meta.uuid).toBe('col-sibling-uuid');
      const cfg = grid.configuration as unknown as { columnWidths: number[]; columnWidthsTablet: number[] };
      expect(cfg.columnWidths).toEqual([50]);
      expect(cfg.columnWidthsTablet).toEqual([50]);
      expect(closeBlocksConfigurationDrawer).toHaveBeenCalled();
    });
  });
});
