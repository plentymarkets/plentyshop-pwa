import { mount } from '@vue/test-utils';
import { CategoryItemsPerPage } from '#components';

describe('<CategoryItemsPerPage />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(CategoryItemsPerPage, {
      props: {
        totalProducts: 10,
      },
    });

    expect(getByTestId('category-items-per-page'));
  });
});
