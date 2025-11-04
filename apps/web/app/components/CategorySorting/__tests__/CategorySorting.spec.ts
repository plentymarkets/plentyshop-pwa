import { mount } from '@vue/test-utils';
import { CategorySorting } from '#components';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {},
  }),
}));

describe('<CategorySorting />', () => {
  it('should render component', () => {
    const wrapper = mount(CategorySorting);

    expect(wrapper.get('[data-testid="category-sorting"]')).toBeTruthy();
  });
});
