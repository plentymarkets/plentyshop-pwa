import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Block } from '@plentymarkets/shop-api';
import { useBlocksHighlight } from '../useBlocksHighlight';

const mockScrollToBlock = vi.fn();
const highlightedUuid = ref('');

mockNuxtImport('useTableOfContents', () => () => ({
  scrollToBlock: mockScrollToBlock,
  highlightedUuid,
}));

const createBlock = (uuid: string): Block => ({ meta: { uuid } }) as unknown as Block;

describe('useBlocksHighlight - selectBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    highlightedUuid.value = '';
  });

  it('should set currentActiveBlockIndex and scroll to the block', () => {
    const blocks = computed(() => [createBlock('block-1'), createBlock('block-2')]);
    const { selectBlock, currentActiveBlockIndex } = useBlocksHighlight(blocks);

    selectBlock(1);

    expect(currentActiveBlockIndex.value).toBe(1);
    expect(mockScrollToBlock).toHaveBeenCalledWith('block-2');
  });

  it('should not scroll if the index is out of bounds', () => {
    const blocks = computed(() => [createBlock('block-1')]);
    const { selectBlock } = useBlocksHighlight(blocks);

    selectBlock(5);

    expect(mockScrollToBlock).not.toHaveBeenCalled();
  });
});

describe('useBlocksHighlight - highlightActiveBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    highlightedUuid.value = '';
  });

  it('should scroll to the active block when index is valid', () => {
    const blocks = computed(() => [createBlock('block-1'), createBlock('block-2')]);
    const { selectBlock, highlightActiveBlock } = useBlocksHighlight(blocks);

    selectBlock(0);
    vi.clearAllMocks();

    highlightActiveBlock();

    expect(mockScrollToBlock).toHaveBeenCalledWith('block-1');
  });

  it('should not scroll when no block is selected', () => {
    const blocks = computed(() => [createBlock('block-1')]);
    const { highlightActiveBlock } = useBlocksHighlight(blocks);

    highlightActiveBlock();

    expect(mockScrollToBlock).not.toHaveBeenCalled();
  });
});

describe('useBlocksHighlight - clearSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    highlightedUuid.value = '';
  });

  it('should reset highlightedUuid and currentActiveBlockIndex', () => {
    const blocks = computed(() => [createBlock('block-1')]);
    const { selectBlock, clearSelection, currentActiveBlockIndex } = useBlocksHighlight(blocks);

    selectBlock(0);
    clearSelection();

    expect(highlightedUuid.value).toBe('');
    expect(currentActiveBlockIndex.value).toBe(-1);
  });
});

describe('useBlocksHighlight - hasValidActiveBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    highlightedUuid.value = '';
  });

  it('should return false when no block is selected', () => {
    const blocks = computed(() => [createBlock('block-1')]);
    const { hasValidActiveBlock } = useBlocksHighlight(blocks);

    expect(hasValidActiveBlock.value).toBe(false);
  });

  it('should return true when a valid block is selected', () => {
    const blocks = computed(() => [createBlock('block-1')]);
    const { selectBlock, hasValidActiveBlock } = useBlocksHighlight(blocks);

    selectBlock(0);

    expect(hasValidActiveBlock.value).toBe(true);
  });
});

describe('useBlocksHighlight - watcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    highlightedUuid.value = '';
  });

  it('should auto-select the last block when a new block is added', async () => {
    const blockList = ref([createBlock('block-1')]);
    const blocks = computed(() => blockList.value);
    const { currentActiveBlockIndex } = useBlocksHighlight(blocks);

    blockList.value = [createBlock('block-1'), createBlock('block-2')];
    await nextTick();

    expect(currentActiveBlockIndex.value).toBe(1);
    expect(mockScrollToBlock).toHaveBeenCalledWith('block-2');
  });

  it('should not auto-select when a block is removed', async () => {
    const blockList = ref([createBlock('block-1'), createBlock('block-2')]);
    const blocks = computed(() => blockList.value);
    const { currentActiveBlockIndex } = useBlocksHighlight(blocks);

    blockList.value = [createBlock('block-1')];
    await nextTick();

    expect(currentActiveBlockIndex.value).toBe(-1);
  });
});
