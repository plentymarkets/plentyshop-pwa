import { useBlocksVisibility } from '~/composables/useBlocksVisibility/useBlocksVisibility';
import type { Block } from '@plentymarkets/shop-api';

describe('useBlocksVisibility', () => {
  const createMockBlock = (): Block => ({
    name: 'TestBlock',
    type: 'content',
    content: { text: 'content' },
    meta: {
      uuid: 'test-uuid-' + Math.random(),
    },
  });

  const createEmptyBlock = (): Block => ({
    name: 'EmptyBlock',
    type: 'content',
    content: {},
    meta: {
      uuid: 'empty-uuid-' + Math.random(),
    },
  });

  describe('shouldShowBlock', () => {
    it('should return false if block has no meta', () => {
      const { shouldShowBlock } = useBlocksVisibility();
      const block = createMockBlock();
      // @ts-expect-error remove meta to simulate missing meta
      delete block.meta;

      expect(shouldShowBlock(block, false)).toBe(false);
    });

    it('should return true in editor mode regardless of content', () => {
      const { shouldShowBlock } = useBlocksVisibility();
      const emptyBlock = createEmptyBlock();

      expect(shouldShowBlock(emptyBlock, true)).toBe(true);
    });

    it('should return false for blocks with empty content', () => {
      const { shouldShowBlock } = useBlocksVisibility();
      const emptyBlock = createEmptyBlock();

      expect(shouldShowBlock(emptyBlock, false)).toBe(false);
    });

    it('should return true for blocks with content', () => {
      const { shouldShowBlock } = useBlocksVisibility();
      const blockWithContent = createMockBlock();

      expect(shouldShowBlock(blockWithContent, false)).toBe(true);
    });

    it('should use registered runtime visibility state when hasData is false', () => {
      const visibility = useBlocksVisibility();
      const { shouldShowBlock, registerBlockVisibility, isHydrationComplete } = visibility;
      const block = createMockBlock();
      const hasData = ref(false);

      isHydrationComplete.value = true;
      registerBlockVisibility(block.meta.uuid, hasData.value);

      expect(shouldShowBlock(block, false)).toBe(false);
    });

    it('should use registered runtime visibility state when hasData is true', () => {
      const visibility = useBlocksVisibility();
      const { shouldShowBlock, registerBlockVisibility, isHydrationComplete } = visibility;
      const block = createMockBlock();
      const hasData = ref(true);

      isHydrationComplete.value = true;
      registerBlockVisibility(block.meta.uuid, hasData.value);

      expect(shouldShowBlock(block, false)).toBe(true);
    });

    it('should ignore runtime visibility in editor mode', () => {
      const visibility = useBlocksVisibility();
      const { shouldShowBlock, registerBlockVisibility } = visibility;
      const block = createMockBlock();
      const hasData = ref(false);

      registerBlockVisibility(block.meta.uuid, hasData.value);

      expect(shouldShowBlock(block, true)).toBe(true);
    });

    it('should ignore registry when hydration is incomplete and return based on static content', () => {
      const visibility = useBlocksVisibility();
      const { shouldShowBlock, registerBlockVisibility, isHydrationComplete } = visibility;
      const blockWithContent = createMockBlock();
      const emptyBlock = createEmptyBlock();

      isHydrationComplete.value = false;

      registerBlockVisibility(blockWithContent.meta.uuid, false);
      registerBlockVisibility(emptyBlock.meta.uuid, false);

      expect(shouldShowBlock(blockWithContent, false)).toBe(true);
      expect(shouldShowBlock(emptyBlock, false)).toBe(false);
    });
  });

  describe('registerBlockVisibility', () => {
    it('should default to true visibility for unregistered blocks', () => {
      const visibility = useBlocksVisibility();
      const { shouldShowBlock } = visibility;
      const block = createMockBlock();

      expect(shouldShowBlock(block, false)).toBe(true);
    });

    it('should register block visibility', () => {
      const visibility = useBlocksVisibility();
      const { shouldShowBlock, registerBlockVisibility, isHydrationComplete } = visibility;
      const block = createMockBlock();
      const hasData = ref(true);

      expect(shouldShowBlock(block, false)).toBe(true);

      isHydrationComplete.value = true;
      registerBlockVisibility(block.meta.uuid, hasData.value);
      expect(shouldShowBlock(block, false)).toBe(true);

      hasData.value = false;
      registerBlockVisibility(block.meta.uuid, hasData.value);
      expect(shouldShowBlock(block, false)).toBe(false);
    });

    it('should handle multiple blocks independently', () => {
      const visibility = useBlocksVisibility();
      const { shouldShowBlock, registerBlockVisibility, isHydrationComplete } = visibility;
      const block1 = createMockBlock();
      const block2 = createMockBlock();
      const hasData1 = ref(true);
      const hasData2 = ref(false);

      isHydrationComplete.value = true;
      registerBlockVisibility(block1.meta.uuid, hasData1.value);
      registerBlockVisibility(block2.meta.uuid, hasData2.value);

      expect(shouldShowBlock(block1, false)).toBe(true);
      expect(shouldShowBlock(block2, false)).toBe(false);

      hasData1.value = false;
      hasData2.value = true;

      registerBlockVisibility(block1.meta.uuid, hasData1.value);
      registerBlockVisibility(block2.meta.uuid, hasData2.value);

      expect(shouldShowBlock(block1, false)).toBe(false);
      expect(shouldShowBlock(block2, false)).toBe(true);
    });
  });

  describe('clearRegistry', () => {
    it('should clear all registered block visibilities', () => {
      const visibility = useBlocksVisibility();
      const { shouldShowBlock, registerBlockVisibility, clearRegistry, isHydrationComplete } = visibility;
      const block = createMockBlock();
      const hasData = ref(false);

      isHydrationComplete.value = true;
      registerBlockVisibility(block.meta.uuid, hasData.value);
      expect(shouldShowBlock(block, false)).toBe(false);

      clearRegistry();
      expect(shouldShowBlock(block, false)).toBe(true);
    });
  });
});
