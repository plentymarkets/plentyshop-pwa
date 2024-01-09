import { mount } from '@vue/test-utils';
import CategoryTree from '~/components/CategoryTree/CategoryTree.vue';
import { CategoryMock } from '../../../__tests__/fixtures/category.mock';


describe('<CategoryTree/>', () => {
  it('should render component', () => {

    // mock category tree
    const { getByTestId } = mount(CategoryTree, {
      props: {
        category: CategoryMock
      }
    });

    expect(getByTestId('category-tree'));
  });
});
