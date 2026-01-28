import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import CategorySelect from '../CategorySelect.vue';
import type { CategoryData } from '@plentymarkets/shop-api';

const createMockCategoryData = (): CategoryData => ({
  entries: [],
  isLastPage: true,
  page: 1,
  totalsCount: 0,
  lastPageNumber: 1,
  firstOnPage: 0,
  lastOnPage: 0,
  itemsPerPage: 10,
});

const { useCategoriesSearch } = vi.hoisted(() => ({
  useCategoriesSearch: vi.fn(() => ({
    data: ref(createMockCategoryData()),
    getCategories: vi.fn(),
  })),
}));

const { useNotification } = vi.hoisted(() => ({
  useNotification: vi.fn(() => ({
    send: vi.fn(),
  })),
}));

const { getEditorTranslation } = vi.hoisted(() => ({
  getEditorTranslation: vi.fn((key: string) => key),
}));

mockNuxtImport('useCategoriesSearch', () => useCategoriesSearch);
mockNuxtImport('useNotification', () => useNotification);
mockNuxtImport('getEditorTranslation', () => getEditorTranslation);

describe('CategorySelect', () => {
  let originalIntersectionObserver: typeof IntersectionObserver;
  const disconnectSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    disconnectSpy.mockClear();

    originalIntersectionObserver = global.IntersectionObserver;

    global.IntersectionObserver = class {
      callback: IntersectionObserverCallback;
      options?: IntersectionObserverInit;
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = disconnectSpy;
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = '';
      thresholds: number[] = [];

      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        this.options = options;
      }
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;
  });

  const defaultProps = {
    modelValue: null,
    baseSearchParams: { type: 'item' as const },
    dataTestId: 'category-select',
  };

  it('should render component', () => {
    const wrapper = mount(CategorySelect, { props: defaultProps });
    expect(wrapper.find('[data-testid="category-select"]').exists()).toBe(true);
  });

  it('should safely unmount without observer being created', () => {
    const wrapper = mount(CategorySelect, { props: defaultProps });

    expect(() => wrapper.unmount()).not.toThrow();
    expect(disconnectSpy).not.toHaveBeenCalled();
  });

  it('should send pinnedId only on first page, not on subsequent pages', async () => {
    vi.useFakeTimers();
    const mockGetCategories = vi.fn().mockResolvedValue(undefined);

    useCategoriesSearch.mockReturnValue({
      data: ref({
        ...createMockCategoryData(),
        isLastPage: false,
      }),
      getCategories: mockGetCategories,
    });

    const propsWithPinnedId = {
      ...defaultProps,
      modelValue: '42',
      pinnedId: 42,
    };

    const wrapper = mount(CategorySelect, { props: propsWithPinnedId });

    await vi.runAllTimersAsync();
    await wrapper.vm.$nextTick();

    expect(mockGetCategories).toHaveBeenCalledWith({
      type: 'item',
      page: 1,
      itemsPerPage: 10,
      pinnedId: '42',
    });

    mockGetCategories.mockClear();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (wrapper.vm as any).loadNextPage();

    expect(mockGetCategories).toHaveBeenCalledWith({
      type: 'item',
      page: 2,
      itemsPerPage: 10,
    });
    expect(mockGetCategories).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
