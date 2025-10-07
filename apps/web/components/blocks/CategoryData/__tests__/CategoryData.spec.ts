import { mount } from '@vue/test-utils';
import CategoryData from '../CategoryData.vue';
import type { CategoryDataProps } from '../types';
import { CategoryMock } from '~/__tests__/__mocks__/category.mock';
import type { CategoryDetails } from '@plentymarkets/shop-api/lib/types/api/category';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

vi.mock('@plentymarkets/shop-api', () => {
  return {
    categoryGetters: {
      getCategoryName: (category: CategoryDetails) => category?.name ?? 'Category name',
      getCategoryDescription1: (category: CategoryDetails) => category?.description ?? '',
      getCategoryDescription2: (category: CategoryDetails) => category?.description2 ?? '',
      getCategoryShortDescription: (category: CategoryDetails) => category?.shortDescription ?? '',
    },
  };
});

const mockProps: CategoryDataProps = {
  name: 'CategoryData',
  type: 'content',
  content: {
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
      narrowContainer: false,
    },
    displayCategoryImage: 'off',
    text: {
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

  mockNuxtImport('useProducts', () => {
    return () => {
      return { data: computed(() => ({ category: CategoryMock.details })) };
    };
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
