import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { BlockSnapshot } from '@plentymarkets/shop-api';
import VersionHistoryList from '../VersionHistoryList.vue';

const { getEditorTranslationMock } = vi.hoisted(() => ({
  getEditorTranslationMock: vi.fn((key: string) => key),
}));

mockNuxtImport('getEditorTranslation', () => getEditorTranslationMock);

const identifier = ref('index');
const groupedSnapshots = ref<{ label: string; items: BlockSnapshot[] }[]>([]);

mockNuxtImport('useBlockSnapshots', () => () => ({
  loading: ref(false),
  loadingMore: ref(false),
  hasMore: ref(false),
  groupedSnapshots,
  requestRestore: vi.fn(),
  loadMore: vi.fn(),
  isActiveSnapshot: vi.fn().mockReturnValue(false),
  isRestoredSnapshot: vi.fn().mockReturnValue(false),
  identifier,
}));

const createSnapshot = (id: number, snapshotableType: string): BlockSnapshot => ({
  id,
  configId: 1,
  snapshotableId: null,
  snapshotableType,
  language: 'en',
  payload: '{}',
  label: null,
  createdBy: null,
  createdAt: '2026-01-01T00:00:00.000Z',
});

describe('VersionHistoryList', () => {
  it('should label an immutable snapshot as Homepage when identifier is index', () => {
    identifier.value = 'index';
    groupedSnapshots.value = [{ label: 'Today', items: [createSnapshot(1, 'immutable')] }];

    const wrapper = mount(VersionHistoryList, { global: { stubs: { SfLoaderCircular: true } } });

    expect(wrapper.find('[data-testid="version-history-item-1"]').text()).toContain('entity-immutable-homepage');
  });

  it('should label an immutable snapshot as Shipping policy when identifier is shipping', () => {
    identifier.value = 'shipping';
    groupedSnapshots.value = [{ label: 'Today', items: [createSnapshot(2, 'immutable')] }];

    const wrapper = mount(VersionHistoryList, { global: { stubs: { SfLoaderCircular: true } } });

    expect(wrapper.find('[data-testid="version-history-item-2"]').text()).toContain('entity-immutable-shipping');
  });

  it('should fall back to a generic page label for an unmapped immutable identifier', () => {
    identifier.value = 'unmapped-page';
    groupedSnapshots.value = [{ label: 'Today', items: [createSnapshot(3, 'immutable')] }];

    const wrapper = mount(VersionHistoryList, { global: { stubs: { SfLoaderCircular: true } } });

    expect(wrapper.find('[data-testid="version-history-item-3"]').text()).toContain('entity-immutable-page');
  });

  it('should label a category snapshot as Category page regardless of identifier', () => {
    identifier.value = 'index';
    groupedSnapshots.value = [{ label: 'Today', items: [createSnapshot(4, 'category')] }];

    const wrapper = mount(VersionHistoryList, { global: { stubs: { SfLoaderCircular: true } } });

    expect(wrapper.find('[data-testid="version-history-item-4"]').text()).toContain('entity-category');
  });
});
