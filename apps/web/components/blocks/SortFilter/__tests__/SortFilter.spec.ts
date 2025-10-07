import { mount } from '@vue/test-utils';
import SortFilter from '../SortFilter.vue';
import type { SortFilterProps } from '../types';

const mockProps: SortFilterProps = {
  name: 'SortFilter',
  type: 'content',
  content: {
    enableFilters: true,
    fields: {
      category: true,
      sortBy: true,
      perPage: true,
      itemRating: true,
      manufacturer: true,
      price: true,
      availability: true,
      customizedFilters: true,
    },
    filtersOrder: [
      'category',
      'sortBy',
      'perPage',
      'itemRating',
      'manufacturer',
      'price',
      'availability',
      'customizedFilters',
    ],
    filtersDisabled: [],
    showAllFiltersImmediately: true,
    numberOfFiltersToShowInitially: 0,
  },
  meta: {
    uuid: 'test-uuid',
  },
  index: 0,
};

describe('SortFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render CategoryFilters when not visible', () => {
    const wrapper = mount(SortFilter);

    expect(wrapper.find('[data-testid="category-filters"]').exists()).toBe(false);
  });

  it('should not render categories from CategoryTree', () => {
    const wrapper = mount(SortFilter);

    expect(wrapper.find('[data-testid="categories"]').exists()).toBe(false);
  });

  it('should render category sort and filter', () => {
    const wrapper = mount(SortFilter, {
      props: mockProps,
    });

    expect(wrapper.find('[data-testid="category-sort-filter"]').exists()).toBe(true);
  });
});
