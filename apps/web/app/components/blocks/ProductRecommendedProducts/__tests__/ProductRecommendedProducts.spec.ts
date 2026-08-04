import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import ProductRecommendedProducts from '../../../../components/blocks/ProductRecommendedProducts/ProductRecommendedProducts.vue';
import type { ProductRecommendedProductsProps } from '../types';

// Mock shop-core to prevent window undefined errors
vi.mock('@plentymarkets/shop-core', () => ({
  t: vi.fn((key: string) => key),
  useHandleError: vi.fn(),
}));

const { useEditorStateMock } = vi.hoisted(() => ({ useEditorStateMock: vi.fn() }));
mockNuxtImport('useEditorState', () => useEditorStateMock);

const { useSiteSettingsMock } = vi.hoisted(() => ({ useSiteSettingsMock: vi.fn() }));
mockNuxtImport('useSiteSettings', () => useSiteSettingsMock);

// Mock useProductRecommended to prevent async errors after test teardown
vi.mock('~/composables/useProductRecommended/useProductRecommended', () => ({
  useProductRecommended: vi.fn(() => ({
    data: ref([]),
    fetchProductRecommended: vi.fn().mockResolvedValue([]),
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
    cacheKey: 'test-cache',
    text: {
      title: 'Recommended Products',
      subtitle: 'You might also like',
    },
    source: {
      type: 'category',
      categoryId: '123',
      itemId: '',
      crossSellingRelation: 'Similar',
    },
  },
  meta: {
    uuid: 'test-uuid',
  },
  index: 0,
};

const mockLastSeenProps: ProductRecommendedProductsProps = {
  ...mockProps,
  content: {
    ...mockProps.content,
    source: {
      type: 'last_seen',
      categoryId: '',
      itemId: '',
      crossSellingRelation: 'Similar',
    },
  },
};

describe('ProductRecommendedProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useEditorStateMock.mockReturnValue({ isEditMode: ref(false) });
    useSiteSettingsMock.mockReturnValue({ getBooleanSetting: vi.fn().mockReturnValue(true) });
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

  it('should show the last-seen tracking hint when source is last_seen, in edit mode, and tracking is disabled', () => {
    useEditorStateMock.mockReturnValue({ isEditMode: ref(true) });
    useSiteSettingsMock.mockReturnValue({ getBooleanSetting: vi.fn().mockReturnValue(false) });

    const wrapper = mount(ProductRecommendedProducts, {
      props: mockLastSeenProps,
    });

    expect(wrapper.find('[data-testid="recommended-last-seen-tracking-hint"]').exists()).toBe(true);
  });

  it('should not show the last-seen tracking hint when tracking is enabled', () => {
    useEditorStateMock.mockReturnValue({ isEditMode: ref(true) });
    useSiteSettingsMock.mockReturnValue({ getBooleanSetting: vi.fn().mockReturnValue(true) });

    const wrapper = mount(ProductRecommendedProducts, {
      props: mockLastSeenProps,
    });

    expect(wrapper.find('[data-testid="recommended-last-seen-tracking-hint"]').exists()).toBe(false);
  });

  it('should not show the last-seen tracking hint when not in edit mode', () => {
    useEditorStateMock.mockReturnValue({ isEditMode: ref(false) });
    useSiteSettingsMock.mockReturnValue({ getBooleanSetting: vi.fn().mockReturnValue(false) });

    const wrapper = mount(ProductRecommendedProducts, {
      props: mockLastSeenProps,
    });

    expect(wrapper.find('[data-testid="recommended-last-seen-tracking-hint"]').exists()).toBe(false);
  });

  it('should not show the last-seen tracking hint when source is not last_seen', () => {
    useEditorStateMock.mockReturnValue({ isEditMode: ref(true) });
    useSiteSettingsMock.mockReturnValue({ getBooleanSetting: vi.fn().mockReturnValue(false) });

    const wrapper = mount(ProductRecommendedProducts, {
      props: mockProps,
    });

    expect(wrapper.find('[data-testid="recommended-last-seen-tracking-hint"]').exists()).toBe(false);
  });

  it('should not render ProductSlider when the last-seen tracking hint is shown', () => {
    useEditorStateMock.mockReturnValue({ isEditMode: ref(true) });
    useSiteSettingsMock.mockReturnValue({ getBooleanSetting: vi.fn().mockReturnValue(false) });

    const wrapper = mount(ProductRecommendedProducts, {
      props: mockLastSeenProps,
    });

    expect(wrapper.find('[data-testid="product-slider"]').exists()).toBe(false);
  });
});
