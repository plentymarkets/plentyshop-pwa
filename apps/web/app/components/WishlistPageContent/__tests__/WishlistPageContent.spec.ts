import { mount } from '@vue/test-utils';
import { WishlistPageContent } from '#components';

describe('<CategoryPageContent />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(WishlistPageContent, {
      props: {
        title: 'title',
        withHeader: true,
      },
    });

    expect(getByTestId('wishlist-page-content'));
  });
});
