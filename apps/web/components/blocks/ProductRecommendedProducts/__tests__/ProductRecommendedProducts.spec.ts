import { mount } from '@vue/test-utils';
import ProductRecommendedProducts from '../ProductRecommendedProducts.vue';
import type { ProductRecommendedProductsProps } from '../types';

vi.mock('@/composables/useProductRecommended', () => ({
  useProductRecommended: vi.fn(() => ({
    data: ref([]),
    fetchProductRecommended: vi.fn(),
  })),
}));

vi.mock('@/composables/useI18n', () => ({
  useI18n: vi.fn(() => ({
    locale: ref('en'),
  })),
}));

vi.mock('@/components/ui/ProductSlider/ProductSlider.vue', () => ({
  default: {
    name: 'ProductSlider',
    template: '<div data-testid="product-slider">Product Slider</div>',
  },
}));

vi.mock('@/components/TextContent/TextContent.vue', () => ({
  default: {
    name: 'TextContent',
    template: '<div data-testid="recommended-block">Text Content</div>',
  },
}));

const mockProps: ProductRecommendedProductsProps = {
  name: 'ProductRecommendedProducts',
  type: 'content',
  content: {
    categoryId: '123',
    cacheKey: 'test-cache',
    text: {
      title: 'Recommended Products',
      subtitle: 'You might also like',
    },
    layout: {
      marginTop: '',
      marginBottom: '',
      marginLeft: '',
      marginRight: '',
    },
  },
  meta: {
    uuid: 'test-uuid',
  },
  index: 0,
};

describe('ProductRecommendedProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render text content even when not visible', () => {
    const wrapper = mount(ProductRecommendedProducts, {
      props: {
        ...mockProps,
        shouldLoad: false,
      },
    });

    expect(wrapper.find('[data-testid="recommended-block"]').exists()).toBe(true);
  });

  it('should not render ProductSlider when not visible', () => {
    const wrapper = mount(ProductRecommendedProducts, {
      props: {
        ...mockProps,
        shouldLoad: false,
      },
    });

    expect(wrapper.find('[data-testid="product-slider"]').exists()).toBe(false);
  });

  it('should default shouldLoad to false when not provided', () => {
    const wrapper = mount(ProductRecommendedProducts, {
      props: mockProps,
    });

    expect(wrapper.find('[data-testid="product-slider"]').exists()).toBe(false);
  });
});
