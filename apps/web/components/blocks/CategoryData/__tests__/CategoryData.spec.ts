import { mount } from '@vue/test-utils';
import CategoryData from '../CategoryData.vue';
import type { CategoryDataProps } from '../types';
import { CategoryMock } from '~/__tests__/__mocks__/category.mock';

const mockProps: CategoryDataProps = {
  name: 'CategoryData',
  type: 'content',
  content: {
    categoryId: '16',
    name: 'Category name',
    fields: {
      name: true,
      description1: false,
      description2: false,
      shortDescription: false,
    },
    fieldsOrder: ['name', 'description1', 'description2', 'shortDescription'],
    fieldsDisabled: [],
    layout: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
    displayCategoryImage: 'off',
    text: {
      pretitle: 'Test pretitle',
      title: 'Test title',
      subtitle: 'Test subtitle',
      htmlDescription: '<p>Test description</p>',
      bgColor: '#fff',
      bgOpacity: 1,
      background: true,
    },
    image: {},
  },
  category: CategoryMock,
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
