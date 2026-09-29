import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import type { RouteLocationNormalizedGeneric } from 'vue-router';
import { useCategoryFilter } from '../useCategoryFilter';

const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }));
mockNuxtImport('navigateTo', () => navigateToMock);

mockNuxtImport('useLocalization', () => () => ({
  getCategoryUrlFromRoute: () => '',
}));

mockNuxtImport('useSiteSettings', () => () => ({
  getSetting: () => 'name_asc',
}));

mockNuxtImport('useRuntimeConfig', () => () => ({
  app: { baseURL: '/' },
  public: { defaultItemsPerPage: 24 },
}));

const currentRoute = {
  fullPath: '/category?page=3&facets=108',
  query: { page: '3', facets: '108' },
} as unknown as RouteLocationNormalizedGeneric;

const mountComposable = () => {
  let composable!: ReturnType<typeof useCategoryFilter>;

  mount({
    setup() {
      composable = useCategoryFilter(currentRoute);
      return {};
    },
    template: '<div></div>',
  });

  return composable;
};

describe('useCategoryFilter', () => {
  beforeEach(() => {
    navigateToMock.mockClear();
  });

  it('should reset page when a filter is applied', () => {
    const { updateFilters } = mountComposable();

    updateFilters({ '109': true });

    expect(navigateToMock).toHaveBeenCalledWith({ query: expect.not.objectContaining({ page: expect.anything() }) });
  });

  it('should reset page when the last filter is removed', () => {
    const { updateFilters } = mountComposable();

    updateFilters({ '108': false });

    expect(navigateToMock).toHaveBeenCalledWith({ query: expect.not.objectContaining({ page: expect.anything() }) });
  });

  it('should reset page when a price filter is applied', () => {
    const { updatePrices } = mountComposable();

    updatePrices('10', '100');

    expect(navigateToMock).toHaveBeenCalledWith({ query: expect.not.objectContaining({ page: expect.anything() }) });
  });

  it('should reset page when the sort order is changed', () => {
    const { updateSorting } = mountComposable();

    updateSorting('price_asc');

    expect(navigateToMock).toHaveBeenCalledWith({ query: expect.not.objectContaining({ page: expect.anything() }) });
  });
});
