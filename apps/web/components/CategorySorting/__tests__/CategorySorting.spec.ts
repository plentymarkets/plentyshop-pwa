import { mount } from '@vue/test-utils';
import { CategorySorting } from '#components';

describe('<CategorySorting />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(CategorySorting);

    expect(getByTestId('category-sorting'));
  });
});
