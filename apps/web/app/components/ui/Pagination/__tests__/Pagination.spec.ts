import { mount } from '@vue/test-utils';
import { UiPagination } from '#components';

describe('<Pagination />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(UiPagination, {
      props: {
        currentPage: 4,
        pageSize: 24,
        maxVisiblePages: 5,
        totalItems: 2137,
      },
    });

    expect(getByTestId('pagination'));
  });
});
