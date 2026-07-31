import { CategoryTree } from '#components';
import { CategoryMock } from '../../../../__tests__/__mocks__/category.mock';
import { mount } from '@vue/test-utils';
import type { CategoryBreadcrumb } from '@plentymarkets/shop-api';

const breadcrumbsMock: CategoryBreadcrumb[] = [
  { id: 16, level: 1, name: 'Wohnzimmer', url: '/wohnzimmer', itemCount: 8 },
  { id: 17, level: 2, name: 'Sessel & Hocker', url: '/wohnzimmer/sessel-hocker', itemCount: 8 },
];

describe('<CategoryTree/>', () => {
  it('should render component', () => {
    const { getByTestId } = mount(CategoryTree, {
      props: {
        category: CategoryMock,
        breadcrumbs: breadcrumbsMock,
      },
    });

    expect(getByTestId('category-tree'));
  });

  it('should render subcategories', () => {
    const wrapper = mount(CategoryTree, {
      props: {
        category: CategoryMock,
        breadcrumbs: breadcrumbsMock,
      },
    });

    expect(wrapper.find('[data-testid="categories"]').findAll('li')).toHaveLength(2);
  });

  it('should render parent category back link when breadcrumbs has more than one entry', () => {
    const wrapper = mount(CategoryTree, {
      props: {
        category: CategoryMock,
        breadcrumbs: breadcrumbsMock,
      },
    });

    expect(wrapper.find('[data-testid="category-parent-link"]').exists()).toBe(true);
  });

  it('should not render parent back link when only one breadcrumb', () => {
    const wrapper = mount(CategoryTree, {
      props: {
        category: CategoryMock,
        breadcrumbs: [breadcrumbsMock[1]!],
      },
    });

    expect(wrapper.find('[data-testid="category-parent-link"]').exists()).toBe(false);
  });
});
