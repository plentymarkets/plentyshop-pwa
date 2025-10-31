import { mount } from '@vue/test-utils';
import { WishlistPageContent } from '#components';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

describe('<CategoryPageContent />', () => {
  mockNuxtImport('useWishlist', () => {
    return () => {
      return { data: computed(() => []), fetchWishlist: () => {} };
    };
  });

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
