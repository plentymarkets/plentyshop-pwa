import { mount } from '@vue/test-utils';
import { CategoryItemsPerPage } from '#components';

describe('<CategoryItemsPerPage />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(CategoryItemsPerPage);

    expect(getByTestId('category-items-per-page'));
  });
});
