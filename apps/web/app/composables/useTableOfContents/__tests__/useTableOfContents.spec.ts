import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useTableOfContents } from '../useTableOfContents';
import type { Block } from '@plentymarkets/shop-api';

const allBlocks = ref<Block[]>([]);

mockNuxtImport('useCarousel', () => () => ({
  setIndex: vi.fn(),
}));

mockNuxtImport('useBlockManager', () => () => ({
  isStructureBlock: vi.fn().mockReturnValue(false),
}));

mockNuxtImport('useBlocks', () => () => ({
  allBlocks,
}));

const createBlock = (name = 'TestBlock', uuid = 'uuid-1'): Block => ({
  name,
  type: 'content',
  content: {},
  meta: { uuid },
});

describe('useTableOfContents', () => {
  describe('blockToFlatBlock', () => {
    it('should convert a block to a FlatBlock with default depth 0', () => {
      const block = createBlock('TextBlock', 'uuid-text');
      const { blockToFlatBlock } = useTableOfContents();

      const result = blockToFlatBlock(block);

      expect(result.uuid).toBe('uuid-text');
      expect(result.depth).toBe(0);
      expect(result.block).toBe(block);
    });

    it('should use the provided depth', () => {
      const block = createBlock('TextBlock', 'uuid-text');
      const { blockToFlatBlock } = useTableOfContents();

      const result = blockToFlatBlock(block, 2);

      expect(result.depth).toBe(2);
    });
  });

  describe('toggleBlockExpansion', () => {
    it('should add a uuid to expandedBlocks when not present', () => {
      const { toggleBlockExpansion, expandedBlocks } = useTableOfContents();
      expandedBlocks.value.clear();

      toggleBlockExpansion('some-uuid');

      expect(expandedBlocks.value.has('some-uuid')).toBe(true);
    });

    it('should remove a uuid from expandedBlocks when already present', () => {
      const { toggleBlockExpansion, expandedBlocks } = useTableOfContents();
      expandedBlocks.value.clear();
      expandedBlocks.value.add('some-uuid');

      toggleBlockExpansion('some-uuid');

      expect(expandedBlocks.value.has('some-uuid')).toBe(false);
    });
  });

  describe('getChildren', () => {
    it('should return children as FlatBlocks when block has array content', () => {
      const child1 = createBlock('ChildBlock1', 'child-uuid-1');
      const child2 = createBlock('ChildBlock2', 'child-uuid-2');
      const parent = { ...createBlock('ParentBlock', 'parent-uuid'), content: [child1, child2] };
      const { blockToFlatBlock, getChildren } = useTableOfContents();
      const parentFlat = blockToFlatBlock(parent, 0);

      const children = getChildren(parentFlat);

      expect(children).toHaveLength(2);
      expect(children[0]!.uuid).toBe('child-uuid-1');
      expect(children[1]!.uuid).toBe('child-uuid-2');
      expect(children[0]!.depth).toBe(1);
    });

    it('should return empty array when block content is not an array', () => {
      const block = createBlock('TextBlock', 'uuid-text');
      const { blockToFlatBlock, getChildren } = useTableOfContents();
      const flatBlock = blockToFlatBlock(block, 0);

      const children = getChildren(flatBlock);

      expect(children).toHaveLength(0);
    });

    it('should skip children without a meta uuid', () => {
      const validChild = createBlock('ValidChild', 'valid-uuid');
      const invalidChild = { name: 'InvalidChild', type: 'content', content: {}, meta: {} } as Block;
      const parent = { ...createBlock('ParentBlock', 'parent-uuid'), content: [validChild, invalidChild] };
      const { blockToFlatBlock, getChildren } = useTableOfContents();
      const parentFlat = blockToFlatBlock(parent, 0);

      const children = getChildren(parentFlat);

      expect(children).toHaveLength(1);
      expect(children[0]!.uuid).toBe('valid-uuid');
    });
  });

  describe('section open states', () => {
    it('should default headerOpen to true', () => {
      const { headerOpen } = useTableOfContents();
      expect(headerOpen.value).toBe(true);
    });

    it('should default contentOpen to true', () => {
      const { contentOpen } = useTableOfContents();
      expect(contentOpen.value).toBe(true);
    });

    it('should default footerOpen to true', () => {
      const { footerOpen } = useTableOfContents();
      expect(footerOpen.value).toBe(true);
    });
  });

  describe('scrollToBlock', () => {
    afterEach(() => {
      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it('should set selectedUuid to the given uuid', () => {
      const { scrollToBlock, selectedUuid } = useTableOfContents();

      scrollToBlock('target-uuid');

      expect(selectedUuid.value).toBe('target-uuid');
    });

    it('should set highlightedUuid to the given uuid', () => {
      const { scrollToBlock, highlightedUuid } = useTableOfContents();

      scrollToBlock('target-uuid');

      expect(highlightedUuid.value).toBe('target-uuid');
    });

    it('should clear highlightedUuid after 1500ms', async () => {
      vi.useFakeTimers();
      const { scrollToBlock, highlightedUuid } = useTableOfContents();

      scrollToBlock('target-uuid');
      expect(highlightedUuid.value).toBe('target-uuid');

      vi.advanceTimersByTime(1500);
      expect(highlightedUuid.value).toBe('');
    });
  });
});
