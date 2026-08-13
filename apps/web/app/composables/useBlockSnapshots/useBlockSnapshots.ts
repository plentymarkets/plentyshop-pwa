import type { Block, BlockSnapshot, GetBlocksResponse } from '@plentymarkets/shop-api';
import type { SnapshotDatePreset, SnapshotGroup, UseBlockSnapshotsState } from './types';
import { assembleBlocks } from '~/utils/blocks/block-helpers';
import { FOOTER_BLOCK_NAME } from '~/utils/blocks/block-names';
import { FOOTER_CONTAINER_BLOCK_NAME } from '~/utils/blockTemplates/footer';
import { HEADER_CONTAINER_BLOCK_NAME } from '~/utils/blockTemplates/header';

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const toISODate = (d: Date): string => d.toISOString().slice(0, 10);

const ITEMS_PER_PAGE = 30;

export const useBlockSnapshots = () => {
  const state = useState<UseBlockSnapshotsState>('useBlockSnapshots', () => ({
    drawerOpen: false,
    snapshots: [],
    loading: false,
    loadingMore: false,
    preset: 'all',
    dateFrom: '',
    dateTo: '',
    confirmingId: null,
    restoredSnapshotId: null,
    restoring: false,
    currentPage: 1,
    lastPage: 1,
  }));

  const route = useRoute();
  const { data: dataProducts } = useProducts();
  const { restoreBlocks } = useBlocks();
  const { send } = useNotification();

  const resolveEntity = (): { identifier: string | number; type: string } => {
    let identifier: string | number = route.meta.identifier as string | number;
    const type = route.meta.type as string;

    if (type === 'category' && dataProducts.value?.category?.type === 'content' && dataProducts.value.category.id) {
      identifier = dataProducts.value.category.id;
    }

    return { identifier, type };
  };

  const entityKey = computed(() => {
    const { identifier, type } = resolveEntity();
    return `${type}:${identifier}`;
  });

  const openDrawer = () => {
    useSiteConfiguration().closeDrawer();
    state.value.drawerOpen = true;
    fetchSnapshots();
  };

  const closeDrawer = () => {
    state.value.drawerOpen = false;
  };

  const resetForCurrentEntity = () => {
    state.value.preset = 'all';
    state.value.dateFrom = '';
    state.value.dateTo = '';
    state.value.currentPage = 1;
    state.value.lastPage = 1;
    state.value.confirmingId = null;
    state.value.restoredSnapshotId = null;
    state.value.snapshots = [];
    fetchSnapshots();
  };

  const toggleDrawer = () => {
    if (state.value.drawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  const fetchSnapshots = async () => {
    state.value.loading = true;

    const { identifier, type } = resolveEntity();
    const { dateFrom, dateTo } = state.value;

    try {
      const { data } = await useSdk().plentysystems.getBlockSnapshots({
        snapshotableType: type,
        snapshotableId: typeof identifier === 'number' ? identifier : undefined,
        createdFrom: dateFrom || undefined,
        createdTo: dateTo || undefined,
        page: 1,
        itemsPerPage: ITEMS_PER_PAGE,
      });

      state.value.snapshots = data.data;
      state.value.currentPage = data.pagination.currentPage;
      state.value.lastPage = data.pagination.lastPage;
    } catch (error) {
      send({ message: getEditorUITranslation('snapshot-list-error'), type: 'negative' });
      console.error('Failed to fetch block snapshots:', error);
    } finally {
      state.value.loading = false;
    }
  };

  const hasMore = computed(() => state.value.currentPage < state.value.lastPage);

  const loadMore = async () => {
    if (state.value.loadingMore || !hasMore.value) {
      return;
    }

    state.value.loadingMore = true;

    const { identifier, type } = resolveEntity();
    const { dateFrom, dateTo } = state.value;

    try {
      const { data } = await useSdk().plentysystems.getBlockSnapshots({
        snapshotableType: type,
        snapshotableId: typeof identifier === 'number' ? identifier : undefined,
        createdFrom: dateFrom || undefined,
        createdTo: dateTo || undefined,
        page: state.value.currentPage + 1,
        itemsPerPage: ITEMS_PER_PAGE,
      });

      state.value.snapshots = [...state.value.snapshots, ...data.data];
      state.value.currentPage = data.pagination.currentPage;
      state.value.lastPage = data.pagination.lastPage;
    } catch (error) {
      send({ message: getEditorUITranslation('snapshot-list-error'), type: 'negative' });
      console.error('Failed to load more block snapshots:', error);
    } finally {
      state.value.loadingMore = false;
    }
  };

  const setPreset = (preset: SnapshotDatePreset) => {
    const now = new Date();
    let from = '';
    const to = '';

    if (preset === '1d') {
      const d = new Date(now);
      d.setDate(d.getDate() - 1);
      from = toISODate(d);
    }
    if (preset === '7d') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      from = toISODate(d);
    }
    if (preset === '30d') {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      from = toISODate(d);
    }

    state.value.preset = preset;
    state.value.dateFrom = from;
    state.value.dateTo = to;
    fetchSnapshots();
  };

  const setDateFrom = (value: string) => {
    state.value.dateFrom = value;
    state.value.preset = 'custom';
    fetchSnapshots();
  };

  const setDateTo = (value: string) => {
    state.value.dateTo = value;
    state.value.preset = 'custom';
    fetchSnapshots();
  };

  const groupedSnapshots = computed<SnapshotGroup[]>(() => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: SnapshotGroup[] = [];

    state.value.snapshots.forEach((snapshot) => {
      const created = new Date(snapshot.createdAt);
      let label: string;
      if (isSameDay(created, today)) {
        label = getEditorUITranslation('snapshot-group-today');
      } else if (isSameDay(created, yesterday)) {
        label = getEditorUITranslation('snapshot-group-yesterday');
      } else {
        label = created.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
      }

      let group = groups.find((g) => g.label === label);
      if (!group) {
        group = { label, items: [] };
        groups.push(group);
      }
      group.items.push(snapshot);
    });

    return groups;
  });

  const requestRestore = (id: number) => {
    state.value.confirmingId = id;
  };

  const cancelRestore = () => {
    state.value.confirmingId = null;
  };

  const confirmingSnapshot = computed<BlockSnapshot | undefined>(() =>
    state.value.confirmingId != null ? state.value.snapshots.find((s) => s.id === state.value.confirmingId) : undefined,
  );

  const confirmRestore = async () => {
    const snapshotId = state.value.confirmingId;
    if (snapshotId == null) {
      return;
    }

    state.value.restoring = true;

    try {
      const { data: snapshot } = await useSdk().plentysystems.getBlockSnapshot({ identifier: snapshotId });
      const { identifier, type } = resolveEntity();

      const payload = JSON.parse(snapshot.payload) as { blocks?: Block[] } | Block[];
      const flatBlocks: Block[] = Array.isArray(payload) ? payload : (payload.blocks ?? []);

      const raw = flatBlocks.reduce<GetBlocksResponse>(
        (acc, block) => {
          if (block?.name === HEADER_CONTAINER_BLOCK_NAME) {
            acc.HeaderContainer = block;
          } else if (block?.name === FOOTER_CONTAINER_BLOCK_NAME || block?.name === FOOTER_BLOCK_NAME) {
            acc.Footer = block;
          } else {
            acc.blocks.push(block);
          }
          return acc;
        },
        { blocks: [] } as GetBlocksResponse,
      );

      const assembled = assembleBlocks(raw, type, identifier, true);
      restoreBlocks(assembled);

      state.value.restoredSnapshotId = snapshotId;
      state.value.confirmingId = null;
      useLogEvent().logSnapshotRestore();
      send({ message: getEditorUITranslation('snapshot-restore-success'), type: 'positive' });
    } catch (error) {
      send({ message: getEditorUITranslation('snapshot-restore-error'), type: 'negative' });
      console.error('Failed to restore block snapshot:', error);
    } finally {
      state.value.restoring = false;
    }
  };

  const latestSnapshotId = computed(() => {
    const [latestSnapshot] = [...state.value.snapshots].sort((a, b) => {
      const timeDifference = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      if (timeDifference !== 0) {
        return timeDifference;
      }

      return b.id - a.id;
    });

    return latestSnapshot?.id ?? null;
  });

  const activeSnapshotId = computed(() => state.value.restoredSnapshotId ?? latestSnapshotId.value);

  const isActiveSnapshot = (id: number) => activeSnapshotId.value === id;

  const isRestoredSnapshot = (id: number) => state.value.restoredSnapshotId === id;

  const markSnapshotSaved = async () => {
    state.value.restoredSnapshotId = null;

    if (state.value.drawerOpen) {
      await fetchSnapshots();
    }
  };

  return {
    drawerOpen: computed(() => state.value.drawerOpen),
    loading: computed(() => state.value.loading),
    loadingMore: computed(() => state.value.loadingMore),
    hasMore,
    restoring: computed(() => state.value.restoring),
    preset: computed(() => state.value.preset),
    dateFrom: computed(() => state.value.dateFrom),
    dateTo: computed(() => state.value.dateTo),
    groupedSnapshots,
    activeSnapshotId,
    confirming: computed(() => state.value.confirmingId != null),
    confirmingSnapshot,
    entityKey,
    isActiveSnapshot,
    isRestoredSnapshot,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    fetchSnapshots,
    loadMore,
    setPreset,
    setDateFrom,
    setDateTo,
    requestRestore,
    cancelRestore,
    confirmRestore,
    markSnapshotSaved,
    resetForCurrentEntity,
  };
};
