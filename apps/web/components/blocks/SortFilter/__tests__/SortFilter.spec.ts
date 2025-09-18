import { mount } from '@vue/test-utils';
import SortFilter from '../SortFilter.vue';

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
    const wrapper = mount(SortFilter);

    expect(wrapper.find('[data-testid="category-sort-filter"]').exists()).toBe(true);
  });
});
