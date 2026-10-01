import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { proxyNuxtApp } from '~/__tests__/utils/mockNuxtApp';
import { useBlockSnapshots } from '~/composables/useBlockSnapshots/useBlockSnapshots';

mockNuxtImport('useRoute', () => () => ({
  meta: { identifier: 'test-id', type: 'category' },
}));

mockNuxtImport('useProducts', () => () => ({
  data: ref({ category: { type: 'content', id: 123 } }),
}));

mockNuxtImport('useBlocks', () => () => ({
  restoreBlocks: vi.fn(),
}));

mockNuxtImport('useNotification', () => () => ({
  send: vi.fn(),
}));

mockNuxtImport('useSiteConfiguration', () => () => ({
  closeDrawer: vi.fn(),
}));

const { getBlockSnapshots } = vi.hoisted(() => ({
  getBlockSnapshots: vi.fn().mockResolvedValue({
    data: {
      data: [],
      pagination: { currentPage: 1, lastPage: 1 },
    },
  }),
}));

const { useNuxtApp } = vi.hoisted(() => ({
  useNuxtApp: vi.fn(),
}));

mockNuxtImport('useSdk', () => () => ({
  plentysystems: {
    getBlockSnapshots,
    getBlockSnapshot: vi.fn().mockResolvedValue({ data: { payload: '{"blocks":[]}' } }),
  },
}));

mockNuxtImport('useNuxtApp', () => () => proxyNuxtApp((useNuxtApp() ?? {}) as Record<string, unknown>));

const locale = ref('en');
useNuxtApp.mockReturnValue({
  $i18n: { locale, te: (key: string) => key, t: (key: string) => key },
});

describe('useBlockSnapshots', () => {
  describe('entity resolution', () => {
    it('should expose the resolved entity identifier', () => {
      const composable = useBlockSnapshots();

      expect(composable.identifier.value).toBe(123);
    });
  });

  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      const composable = useBlockSnapshots();

      expect(composable.drawerOpen.value).toBe(false);
      expect(composable.loading.value).toBe(false);
      expect(composable.loadingMore.value).toBe(false);
      expect(composable.preset.value).toBe('all');
      expect(composable.restoring.value).toBe(false);
      expect(composable.confirming.value).toBe(false);
    });

    it('should initialize with empty snapshots list', () => {
      const composable = useBlockSnapshots();

      expect(composable.groupedSnapshots.value).toEqual([]);
    });
  });

  describe('drawer actions', () => {
    it('should open the drawer', () => {
      const composable = useBlockSnapshots();

      composable.openDrawer();

      expect(composable.drawerOpen.value).toBe(true);
    });

    it('should close the drawer', () => {
      const composable = useBlockSnapshots();

      composable.openDrawer();
      composable.closeDrawer();

      expect(composable.drawerOpen.value).toBe(false);
    });

    it('should toggle the drawer when closed', () => {
      const composable = useBlockSnapshots();

      composable.toggleDrawer();

      expect(composable.drawerOpen.value).toBe(true);
    });

    it('should toggle the drawer when open', () => {
      const composable = useBlockSnapshots();

      composable.openDrawer();
      composable.toggleDrawer();

      expect(composable.drawerOpen.value).toBe(false);
    });
  });

  describe('preset selection', () => {
    it('should set preset to "all" without date filtering', () => {
      const composable = useBlockSnapshots();

      composable.setPreset('all');

      expect(composable.preset.value).toBe('all');
      expect(composable.dateFrom.value).toBe('');
      expect(composable.dateTo.value).toBe('');
    });

    it('should set preset to "1d" and calculate yesterday date', () => {
      const composable = useBlockSnapshots();

      composable.setPreset('1d');

      expect(composable.preset.value).toBe('1d');
      expect(composable.dateFrom.value).toBeTruthy();
      expect(composable.dateTo.value).toBe('');
    });
  });

  describe('reset functionality', () => {
    it('should reset all filter settings when switching entity', () => {
      const composable = useBlockSnapshots();

      composable.setPreset('7d');
      composable.requestRestore(1);

      composable.resetForCurrentEntity();

      expect(composable.preset.value).toBe('all');
      expect(composable.dateFrom.value).toBe('');
      expect(composable.dateTo.value).toBe('');
      expect(composable.confirming.value).toBe(false);
    });
  });

  describe('restore functionality', () => {
    it('should request restore for a snapshot', () => {
      const composable = useBlockSnapshots();

      composable.requestRestore(42);

      expect(composable.confirming.value).toBe(true);
    });

    it('should cancel restore request', () => {
      const composable = useBlockSnapshots();

      composable.requestRestore(42);
      composable.cancelRestore();

      expect(composable.confirming.value).toBe(false);
    });

    it('should check if snapshot is restored', () => {
      const composable = useBlockSnapshots();

      expect(composable.isRestoredSnapshot(42)).toBe(false);
    });
  });

  describe('language switch', () => {
    afterEach(() => {
      const composable = useBlockSnapshots();
      composable.closeDrawer();
      locale.value = 'en';
      getBlockSnapshots.mockClear();
    });

    it('should change entityKey when the locale changes for the same route', async () => {
      const composable = useBlockSnapshots();
      const initialKey = composable.entityKey.value;

      locale.value = 'de';
      await nextTick();

      expect(composable.entityKey.value).not.toBe(initialKey);
    });

    it('should refetch snapshots when the entity key changes while the drawer is open', async () => {
      const composable = useBlockSnapshots();
      composable.openDrawer();
      getBlockSnapshots.mockClear();

      locale.value = 'de';
      await nextTick();
      composable.resetForCurrentEntity();

      expect(getBlockSnapshots).toHaveBeenCalledTimes(1);
    });

    it('should not refetch snapshots when the entity key changes while the drawer is closed', async () => {
      const composable = useBlockSnapshots();
      composable.closeDrawer();
      getBlockSnapshots.mockClear();

      locale.value = 'de';
      await nextTick();
      composable.resetForCurrentEntity();

      expect(getBlockSnapshots).not.toHaveBeenCalled();
    });

    it('should clear the restored snapshot marker when the entity key changes even while the drawer is closed', async () => {
      const composable = useBlockSnapshots();

      composable.requestRestore(42);
      await composable.confirmRestore();
      expect(composable.isRestoredSnapshot(42)).toBe(true);

      composable.closeDrawer();
      getBlockSnapshots.mockClear();

      locale.value = 'de';
      await nextTick();
      composable.resetForCurrentEntity();

      expect(composable.isRestoredSnapshot(42)).toBe(false);
      expect(getBlockSnapshots).not.toHaveBeenCalled();
    });
  });
});
