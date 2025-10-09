import { mount } from '@vue/test-utils';
import { CategoryFilters } from '#components';

describe('<CategoryFilters />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(CategoryFilters, {
      props: {
        facets: [
          {
            count: 0,
            id: 1,
            name: 'Price Filter',
            type: 'price',
          },
        ],
      },
    });

    expect(getByTestId('category-filters'));
  });
});
