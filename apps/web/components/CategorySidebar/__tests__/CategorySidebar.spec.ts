import { mount } from '@vue/test-utils';
import { CategorySidebar } from '#components';

describe('<CategorySidebar />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(CategorySidebar, {
      props: {
        isOpen: false,
      },
    });

    expect(getByTestId('category-sidebar'));
  });
});
