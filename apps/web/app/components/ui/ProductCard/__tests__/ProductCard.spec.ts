import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { UiProductCard } from '#components';
import { ProductMock } from '../../../../../__tests__/__mocks__/product.mock';

const { useLazyProductImageMock } = vi.hoisted(() => ({
  useLazyProductImageMock: vi.fn(),
}));

mockNuxtImport('useLazyProductImage', () => {
  return useLazyProductImageMock;
});

describe('<ProductCard />', () => {
  beforeEach(() => {
    useLazyProductImageMock.mockReset();
    useLazyProductImageMock.mockReturnValue({
      imageContainerRef: ref(null),
      shouldLoadMainImage: ref(true),
      shouldLoadHoverImage: ref(false),
      mainImageLoaded: ref(true),
      hoverImageLoaded: ref(false),
      onMainImageLoad: vi.fn(),
      onMainImageError: vi.fn(),
      onHoverImageLoad: vi.fn(),
      onHoverImageError: vi.fn(),
    });
  });

  it('should render component', () => {
    const wrapper = mount(UiProductCard, {
      props: {
        product: ProductMock,
      },
    });

    expect(wrapper.find('[data-testid="product-card"]').exists()).toBe(true);
  });

  it('should not render image initially for non-priority items', () => {
    useLazyProductImageMock.mockReturnValue({
      imageContainerRef: ref(null),
      shouldLoadMainImage: ref(false),
      shouldLoadHoverImage: ref(false),
      mainImageLoaded: ref(false),
      hoverImageLoaded: ref(false),
      onMainImageLoad: vi.fn(),
      onMainImageError: vi.fn(),
      onHoverImageLoad: vi.fn(),
      onHoverImageError: vi.fn(),
    });

    const wrapper = mount(UiProductCard, {
      props: {
        product: ProductMock,
        index: 10,
      },
    });

    expect(wrapper.find('[data-testid="image-slot"]').exists()).toBe(false);
  });
});
