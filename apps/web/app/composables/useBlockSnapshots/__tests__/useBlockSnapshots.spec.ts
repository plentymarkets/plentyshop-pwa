/* eslint-disable max-nested-callbacks */
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useBlockSnapshots } from '../useBlockSnapshots';
import type { Block, BlockSnapshot } from '@plentymarkets/shop-api';

const mockRoute = { meta: { identifier: 'index', type: 'immutable' } };

const { useRoute } = vi.hoisted(() => ({
  useRoute: vi.fn<() => { meta: { identifier: string | number; type: string } }>(() => ({
    meta: { identifier: 'index', type: 'immutable' },
  })),
}));

const { useProducts } = vi.hoisted(() => ({
  useProducts: vi.fn(),
}));

const { useBlocks } = vi.hoisted(() => ({
  useBlocks: vi.fn(),
}));

const { useSdk } = vi.hoisted(() => ({
  useSdk: vi.fn(),
}));

const { useNotification } = vi.hoisted(() => ({
  useNotification: vi.fn(),
}));

const { useSiteConfiguration } = vi.hoisted(() => ({
  useSiteConfiguration: vi.fn(),
}));

const { useState } = vi.hoisted(() => ({
  useState: vi.fn((_key: string, init?: () => unknown) => ({ value: init ? init() : undefined })),
}));

const { getEditorUITranslation } = vi.hoisted(() => ({
  getEditorUITranslation: vi.fn((key: string) => key),
}));

mockNuxtImport('useRoute', () => useRoute);
mockNuxtImport('useProducts', () => useProducts);
mockNuxtImport('useBlocks', () => useBlocks);
mockNuxtImport('useSdk', () => useSdk);
mockNuxtImport('useNotification', () => useNotification);
mockNuxtImport('useSiteConfiguration', () => useSiteConfiguration);
mockNuxtImport('useState', () => useState);
mockNuxtImport('getEditorUITranslation', () => getEditorUITranslation);

const buildSnapshot = (overrides: Partial<BlockSnapshot> = {}): BlockSnapshot => ({
  id: 1,
  configId: 0,
  snapshotableId: 0,
  snapshotableType: 'immutable',
  language: 'en',
  payload: '[]',
  label: null,
  createdBy: null,
  createdAt: '2026-08-05T11:07:08',
  ...overrides,
});

const buildBlock = (name: string, uuid: string, content: Block[] = []): Block =>
  ({
    name,
    type: 'content',
    meta: { uuid },
    content,
  }) as Block;

const buildSnapshotPayload = (blocks: Block[] = []): string =>
  JSON.stringify([
    buildBlock('HeaderContainer', 'header', [buildBlock('Navigation', 'navigation')]),
    ...blocks,
    buildBlock('FooterContainer', 'footer', [buildBlock('TextCard', 'footer-card')]),
  ]);

describe('useBlockSnapshots', () => {
  let stateRef: { value: ReturnType<typeof createInitialState> };
  let mockGetBlockSnapshots: ReturnType<typeof vi.fn>;
  let mockGetBlockSnapshot: ReturnType<typeof vi.fn>;
  let mockRestoreBlocks: ReturnType<typeof vi.fn>;
  let mockSend: ReturnType<typeof vi.fn>;

  function createInitialState() {
    return {
      drawerOpen: false,
      snapshots: [] as BlockSnapshot[],
      loading: false,
      loadingMore: false,
      preset: 'all' as const,
      dateFrom: '',
      dateTo: '',
      confirmingId: null as number | null,
      restoredSnapshotId: null as number | null,
      restoring: false,
      currentPage: 1,
      lastPage: 1,
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();

    stateRef = { value: createInitialState() };
    useState.mockReturnValue(stateRef);

    useRoute.mockReturnValue(mockRoute);
    useProducts.mockReturnValue({ data: { value: {} } });

    mockRestoreBlocks = vi.fn();
    useBlocks.mockReturnValue({ restoreBlocks: mockRestoreBlocks });

    mockGetBlockSnapshots = vi.fn().mockResolvedValue({
      data: { data: [buildSnapshot()], pagination: { currentPage: 1, perPage: 50, total: 1, lastPage: 1 } },
    });
    mockGetBlockSnapshot = vi.fn().mockResolvedValue({ data: buildSnapshot({ payload: buildSnapshotPayload() }) });

    useSdk.mockReturnValue({
      plentysystems: {
        getBlockSnapshots: mockGetBlockSnapshots,
        getBlockSnapshot: mockGetBlockSnapshot,
      },
    });

    mockSend = vi.fn();
    useNotification.mockReturnValue({ send: mockSend });
    useSiteConfiguration.mockReturnValue({ closeDrawer: vi.fn() });
  });

  describe('openDrawer / closeDrawer / toggleDrawer', () => {
    it('opens the drawer and fetches snapshots', async () => {
      const { openDrawer, drawerOpen } = useBlockSnapshots();

      openDrawer();
      await flushPromises();

      expect(drawerOpen.value).toBe(true);
      expect(mockGetBlockSnapshots).toHaveBeenCalledTimes(1);
    });

    it('closes the drawer', () => {
      const { openDrawer, closeDrawer, drawerOpen } = useBlockSnapshots();
      openDrawer();
      closeDrawer();
      expect(drawerOpen.value).toBe(false);
    });

    it('toggles the drawer open and closed', () => {
      const { toggleDrawer, drawerOpen } = useBlockSnapshots();
      toggleDrawer();
      expect(drawerOpen.value).toBe(true);
      toggleDrawer();
      expect(useBlockSnapshots().drawerOpen.value).toBe(false);
    });
  });

  describe('fetchSnapshots', () => {
    it('scopes the request by the current route type', async () => {
      const { fetchSnapshots } = useBlockSnapshots();
      await fetchSnapshots();

      expect(mockGetBlockSnapshots).toHaveBeenCalledWith(
        expect.objectContaining({ snapshotableType: 'immutable', page: 1, itemsPerPage: 30 }),
      );
    });

    it('resolves the numeric category id from useProducts when set', async () => {
      useRoute.mockReturnValue({ meta: { identifier: 5, type: 'category' } });
      useProducts.mockReturnValue({ data: { value: { category: { type: 'content', id: 42 } } } });

      const { fetchSnapshots } = useBlockSnapshots();
      await fetchSnapshots();

      expect(mockGetBlockSnapshots).toHaveBeenCalledWith(expect.objectContaining({ snapshotableId: 42 }));
    });

    it('sends a notification and logs on error', async () => {
      mockGetBlockSnapshots.mockRejectedValueOnce(new Error('boom'));
      const { fetchSnapshots } = useBlockSnapshots();

      await fetchSnapshots();

      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });

  describe('loadMore', () => {
    it('does nothing when there is no further page', async () => {
      const { fetchSnapshots, loadMore, hasMore } = useBlockSnapshots();
      await fetchSnapshots();

      expect(hasMore.value).toBe(false);

      await loadMore();

      expect(mockGetBlockSnapshots).toHaveBeenCalledTimes(1);
    });

    it('appends the next page of results and advances currentPage', async () => {
      mockGetBlockSnapshots.mockResolvedValueOnce({
        data: {
          data: [buildSnapshot({ id: 1 })],
          pagination: { currentPage: 1, perPage: 30, total: 31, lastPage: 2 },
        },
      });

      const { fetchSnapshots } = useBlockSnapshots();
      await fetchSnapshots();

      expect(useBlockSnapshots().hasMore.value).toBe(true);

      mockGetBlockSnapshots.mockResolvedValueOnce({
        data: {
          data: [buildSnapshot({ id: 2 })],
          pagination: { currentPage: 2, perPage: 30, total: 31, lastPage: 2 },
        },
      });

      const { loadMore } = useBlockSnapshots();
      await loadMore();

      expect(mockGetBlockSnapshots).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2, itemsPerPage: 30 }));

      const { hasMore, groupedSnapshots } = useBlockSnapshots();
      expect(hasMore.value).toBe(false);
      expect(groupedSnapshots.value.flatMap((g) => g.items)).toHaveLength(2);
    });

    it('sends a notification and logs on error', async () => {
      mockGetBlockSnapshots.mockResolvedValueOnce({
        data: {
          data: [buildSnapshot({ id: 1 })],
          pagination: { currentPage: 1, perPage: 30, total: 31, lastPage: 2 },
        },
      });

      const { fetchSnapshots, loadMore } = useBlockSnapshots();
      await fetchSnapshots();

      mockGetBlockSnapshots.mockRejectedValueOnce(new Error('boom'));
      await loadMore();

      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });

  describe('setPreset', () => {
    it('sets a 7 day date range', () => {
      const { setPreset, dateFrom, preset } = useBlockSnapshots();
      setPreset('7d');
      expect(preset.value).toBe('7d');
      expect(dateFrom.value).not.toBe('');
    });

    it('clears the range for "all"', () => {
      const { setPreset, dateFrom, dateTo } = useBlockSnapshots();
      setPreset('7d');
      setPreset('all');
      expect(dateFrom.value).toBe('');
      expect(dateTo.value).toBe('');
    });
  });

  describe('entityKey', () => {
    it('changes when the route type/identifier changes', () => {
      const { entityKey } = useBlockSnapshots();
      expect(entityKey.value).toBe('immutable:index');

      useRoute.mockReturnValue({ meta: { identifier: 5, type: 'category' } });

      const { entityKey: nextEntityKey } = useBlockSnapshots();
      expect(nextEntityKey.value).toBe('category:5');
    });
  });

  describe('resetForCurrentEntity', () => {
    it('clears filters, pagination, and any pending confirmation, then refetches', async () => {
      const {
        fetchSnapshots,
        setPreset,
        requestRestore,
        resetForCurrentEntity,
        preset,
        dateFrom,
        confirming,
        confirmRestore,
        isRestoredSnapshot,
      } = useBlockSnapshots();
      await fetchSnapshots();

      setPreset('7d');
      requestRestore(1);
      await confirmRestore();
      mockGetBlockSnapshots.mockClear();

      resetForCurrentEntity();
      await flushPromises();

      expect(preset.value).toBe('all');
      expect(dateFrom.value).toBe('');
      expect(confirming.value).toBe(false);
      expect(isRestoredSnapshot(1)).toBe(false);
      expect(mockGetBlockSnapshots).toHaveBeenCalledTimes(1);
    });
  });

  describe('groupedSnapshots', () => {
    it('groups snapshots by day label', async () => {
      const today = new Date().toISOString();
      mockGetBlockSnapshots.mockResolvedValueOnce({
        data: {
          data: [buildSnapshot({ id: 1, createdAt: today })],
          pagination: { currentPage: 1, perPage: 50, total: 1, lastPage: 1 },
        },
      });

      const { fetchSnapshots, groupedSnapshots } = useBlockSnapshots();
      await fetchSnapshots();

      expect(groupedSnapshots.value).toHaveLength(1);
      expect(groupedSnapshots.value[0]?.items).toHaveLength(1);
    });
  });

  describe('restore flow', () => {
    it('requestRestore sets the confirming snapshot', async () => {
      const { fetchSnapshots, requestRestore, confirming, confirmingSnapshot } = useBlockSnapshots();
      await fetchSnapshots();

      requestRestore(1);

      expect(confirming.value).toBe(true);
      expect(confirmingSnapshot.value?.id).toBe(1);
    });

    it('cancelRestore clears the confirming snapshot', async () => {
      const { fetchSnapshots, requestRestore, cancelRestore, confirming } = useBlockSnapshots();
      await fetchSnapshots();

      requestRestore(1);
      cancelRestore();

      expect(confirming.value).toBe(false);
    });

    it('confirmRestore fetches the snapshot, restores blocks, and keeps the drawer open', async () => {
      mockGetBlockSnapshot.mockResolvedValueOnce({
        data: buildSnapshot({
          id: 1,
          payload: buildSnapshotPayload([buildBlock('TextCard', 'a')]),
        }),
      });

      const { fetchSnapshots, openDrawer, requestRestore, confirmRestore, confirming, drawerOpen, isRestoredSnapshot } =
        useBlockSnapshots();
      await fetchSnapshots();
      openDrawer();
      await flushPromises();

      requestRestore(1);
      await confirmRestore();

      expect(mockGetBlockSnapshot).toHaveBeenCalledWith({ identifier: 1 });
      expect(mockRestoreBlocks).toHaveBeenCalledTimes(1);
      expect(confirming.value).toBe(false);
      expect(drawerOpen.value).toBe(true);
      expect(isRestoredSnapshot(1)).toBe(true);
      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('uses the latest snapshot as active until a restored snapshot is pending save', async () => {
      mockGetBlockSnapshots.mockResolvedValueOnce({
        data: {
          data: [
            buildSnapshot({ id: 1, createdAt: '2026-08-05T11:07:08' }),
            buildSnapshot({ id: 2, createdAt: '2026-08-06T11:07:08' }),
          ],
          pagination: { currentPage: 1, perPage: 30, total: 2, lastPage: 1 },
        },
      });

      const { fetchSnapshots, requestRestore, confirmRestore, activeSnapshotId } = useBlockSnapshots();
      await fetchSnapshots();

      expect(activeSnapshotId.value).toBe(2);

      requestRestore(1);
      await confirmRestore();

      expect(useBlockSnapshots().activeSnapshotId.value).toBe(1);
    });

    it('clears a pending restored snapshot after the page is saved', async () => {
      const {
        fetchSnapshots,
        requestRestore,
        confirmRestore,
        markSnapshotSaved,
        isRestoredSnapshot,
        activeSnapshotId,
      } = useBlockSnapshots();
      await fetchSnapshots();

      requestRestore(1);
      await confirmRestore();

      expect(isRestoredSnapshot(1)).toBe(true);

      await markSnapshotSaved();

      expect(isRestoredSnapshot(1)).toBe(false);
      expect(activeSnapshotId.value).toBe(1);
    });

    it('sends a negative notification when restore fails', async () => {
      mockGetBlockSnapshot.mockRejectedValueOnce(new Error('boom'));

      const { fetchSnapshots, requestRestore, confirmRestore } = useBlockSnapshots();
      await fetchSnapshots();

      requestRestore(1);
      await confirmRestore();

      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
      expect(mockRestoreBlocks).not.toHaveBeenCalled();
    });
  });
});

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}
