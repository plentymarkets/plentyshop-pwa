import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { UiProductCard } from '#components';
import { ProductMock } from '../../../../../__tests__/__mocks__/product.mock';

const { useLazyProductImageMock, useProductPriceMock } = vi.hoisted(() => ({
  useLazyProductImageMock: vi.fn(),
  useProductPriceMock: vi.fn(),
}));

mockNuxtImport('useLazyProductImage', () => {
  return useLazyProductImageMock;
});

mockNuxtImport('useProductPrice', () => {
  return useProductPriceMock;
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

    useProductPriceMock.mockReset();
    useProductPriceMock.mockReturnValue({
      price: ref(10),
      crossedPrice: ref(null),
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

  it('should render the crossed price when it is higher than the price', () => {
    useProductPriceMock.mockReturnValue({
      price: ref(10),
      crossedPrice: ref(20),
    });

    const wrapper = mount(UiProductCard, {
      props: {
        product: ProductMock,
      },
    });

    expect(wrapper.text()).toContain('20');
  });

  it('should not render the crossed price when it is lower than the price', () => {
    useProductPriceMock.mockReturnValue({
      price: ref(20),
      crossedPrice: ref(10),
    });

    const wrapper = mount(UiProductCard, {
      props: {
        product: ProductMock,
      },
    });

    expect(wrapper.text()).not.toContain('10');
  });
});
