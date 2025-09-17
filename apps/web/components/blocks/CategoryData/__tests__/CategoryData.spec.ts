import { mount } from '@vue/test-utils';
import CategoryData from '../CategoryData.vue';
import type { CategoryDataProps } from '../types';

const mockProps: CategoryDataProps = {
  name: 'CategoryData',
  type: 'content',
  content: {
    categoryId: '11',
    name: 'Category name',
    description1: 'description one',
    description2: 'description two',
  },
  meta: {
    uuid: 'test-uuid',
  },
  index: 0,
};

describe('CategoryData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render category name', () => {
    const wrapper = mount(CategoryData, {
      props: {
        ...mockProps,
        shouldLoad: false,
      },
    });

    expect(wrapper.find('[data-testid="category-name"]').exists()).toBe(true);
  });

});
