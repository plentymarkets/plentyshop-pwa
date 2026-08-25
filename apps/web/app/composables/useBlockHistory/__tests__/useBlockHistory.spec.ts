import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { GetBlocksResponse } from '@plentymarkets/shop-api';

const { useBlocks } = vi.hoisted(() => ({
  useBlocks: vi.fn(),
}));

mockNuxtImport('useBlocks', () => useBlocks);

const emptyResponse = (): GetBlocksResponse => ({ blocks: [] }) as unknown as GetBlocksResponse;

const withBlock = (title: string): GetBlocksResponse =>
  ({
    blocks: [{ name: 'TextCard', type: 'content', meta: { uuid: 'a' }, content: { title } }],
  }) as unknown as GetBlocksResponse;

describe('useBlockHistory', () => {
  let data: Ref<GetBlocksResponse>;
  let restoreBlocks: ReturnType<typeof vi.fn>;

  const importUseBlockHistory = async () => {
    const mod = await import('../useBlockHistory');
    return mod.useBlockHistory();
  };

  const commitChange = async (value: GetBlocksResponse) => {
    data.value = value;
    await nextTick();
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();

    data = ref(emptyResponse());
    restoreBlocks = vi.fn((value: GetBlocksResponse) => {
      data.value = value;
    });
    useBlocks.mockReturnValue({ data, restoreBlocks });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should report canUndo and canRedo as false when nothing has changed yet', async () => {
    const { canUndo, canRedo } = await importUseBlockHistory();

    expect(canUndo.value).toBe(false);
    expect(canRedo.value).toBe(false);
  });

  it('should enable canUndo once a change is committed', async () => {
    const { canUndo } = await importUseBlockHistory();

    await commitChange(withBlock('first'));

    expect(canUndo.value).toBe(true);
  });

  it('should restore the previous snapshot when undo is called', async () => {
    const { canUndo, undo } = await importUseBlockHistory();

    await commitChange(withBlock('first'));
    expect(canUndo.value).toBe(true);

    undo();

    expect(data.value).toEqual(emptyResponse());
    expect(restoreBlocks).toHaveBeenCalledWith(emptyResponse());
  });

  it('should enable canRedo after an undo, and restore the undone state when redo is called', async () => {
    const { canRedo, undo, redo } = await importUseBlockHistory();

    await commitChange(withBlock('first'));
    undo();
    expect(canRedo.value).toBe(true);

    redo();

    expect(data.value).toEqual(withBlock('first'));
  });

  it('should not resurrect a stale pending snapshot after resetHistory is called', async () => {
    const { undo, resetHistory } = await importUseBlockHistory();

    // Commits immediately (leading edge of the throttle window).
    await commitChange(withBlock('page-one-edit'));

    // Within the throttle window — this commit is only scheduled, not yet applied.
    data.value = withBlock('page-one-edit-pending');
    await nextTick();

    // Simulate navigating to a new page: blocks are replaced, then history is reset.
    const newPageData = withBlock('page-two-loaded');
    data.value = newPageData;
    await nextTick();
    resetHistory();

    // Let the still-pending throttled commit from before the reset fire.
    vi.advanceTimersByTime(1000);
    await nextTick();

    undo();

    // Undo must not bring back page-one's stale data onto page two.
    expect(data.value).toEqual(newPageData);
  });

  it('should cap the undo stack at the configured capacity', async () => {
    const { canUndo, undo } = await importUseBlockHistory();
    const capacity = 50;

    for (let i = 0; i < capacity + 5; i++) {
      data.value = withBlock(`edit-${i}`);
      await nextTick();
      vi.advanceTimersByTime(900);
      await nextTick();
    }

    let undoCount = 0;
    while (canUndo.value) {
      undo();
      undoCount++;
    }

    expect(undoCount).toBe(capacity);
  });
});
