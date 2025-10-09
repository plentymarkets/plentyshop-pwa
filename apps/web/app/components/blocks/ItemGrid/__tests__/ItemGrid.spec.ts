import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ItemGridMock } from './ItemGrid.mock';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { products } from './mockProducts';
const { useProductsMock } = vi.hoisted(() => ({
  useProductsMock: vi.fn(),
}));

mockNuxtImport('useProducts', () => useProductsMock);

describe('ItemGrid.vue', () => {
  beforeEach(() => {
    useProductsMock.mockReset();
    useProductsMock.mockImplementation(() => ({
      data: { value: { products, pagination: { totals: products.length } } },
      productsPerPage: { value: 2 },
    }));
  });

  it('should render the product grid with correct responsive classes', async () => {
    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, {
      props: { ...ItemGridMock },
    });
    const grid = wrapper.find('[data-testid="category-grid"]');

    expect(grid.exists()).toBe(true);
    expect(grid.classes()).toContain('mb-10');
    expect(grid.classes()).toContain('gap-4');
    expect(grid.classes()).toContain('md:gap-6');
    expect(grid.classes()).toContain('md:mb-5');
  });

  it('should position product count correctly (left, center, right)', async () => {
    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, { props: { ...ItemGridMock } });

    const countDiv = wrapper.find('.flex.items-center');
    expect(countDiv.classes()).toContain('justify-start');

    await wrapper.setProps({ content: { ...ItemGridMock.content, itemCountPosition: 'center' } });
    expect(wrapper.find('.flex.items-center').classes()).toContain('justify-center');

    await wrapper.setProps({ content: { ...ItemGridMock.content, itemCountPosition: 'right' } });
    expect(wrapper.find('.flex.items-center').classes()).toContain('justify-end');
  });

  it('should render the correct number of product cards (2)', async () => {
    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, {
      props: { ...ItemGridMock },
    });
    expect(wrapper.findAll('[data-testid="product-card"]').length).toBe(2);
  });

  it('should render a single product card when only one product is returned', async () => {
    useProductsMock.mockImplementation(() => ({
      data: { value: { products: [products[0]], pagination: { totals: 1 } } },
      productsPerPage: { value: 1 },
    }));

    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, {
      props: { ...ItemGridMock },
    });
    expect(wrapper.findAll('[data-testid="product-card"]').length).toBe(1);
  });

  it('should not render product grid when products are empty', async () => {
    useProductsMock.mockImplementation(() => ({
      data: { value: { products: [], pagination: { totals: 0 } } },
      productsPerPage: { value: 0 },
    }));

    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, {
      props: { ...ItemGridMock },
    });

    expect(wrapper.find('[data-testid="category-grid"]').exists()).toBe(false);
  });

  it('should render top pagination when paginationPosition is top', async () => {
    const { default: ItemGrid } = await import('../ItemGrid.vue');

    const wrapper = mount(ItemGrid, {
      props: {
        ...ItemGridMock,
        content: { ...ItemGridMock.content, paginationPosition: 'top' },
      },
    });

    expect(wrapper.find('[data-testid="pagination-top"]').exists()).toBe(true);
  });

  it('should render bottom pagination when paginationPosition is bottom', async () => {
    const { default: ItemGrid } = await import('../ItemGrid.vue');

    const wrapper = mount(ItemGrid, {
      props: {
        ...ItemGridMock,
        content: { ...ItemGridMock.content, paginationPosition: 'bottom' },
      },
    });

    expect(wrapper.find('[data-testid="pagination-bottom"]').exists()).toBe(true);
  });

  it('should not render pagination when totalProducts is 0', async () => {
    useProductsMock.mockImplementation(() => ({
      data: { value: { products: [], pagination: { totals: 0 } } },
      productsPerPage: { value: 0 },
    }));

    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, {
      props: { ...ItemGridMock },
    });

    expect(wrapper.find('[data-testid="pagination-top"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="pagination-bottom"]').exists()).toBe(false);
  });

  it('should render pagination when totalProducts is greater than 0', async () => {
    useProductsMock.mockImplementation(() => ({
      data: { value: { products: [products[0]], pagination: { totals: 1 } } },
      productsPerPage: { value: 1 },
    }));

    const { default: ItemGrid } = await import('../ItemGrid.vue');

    const wrapper = mount(ItemGrid, {
      props: {
        ...ItemGridMock,
        content: { ...ItemGridMock.content, paginationPosition: 'bottom' },
      },
    });

    expect(wrapper.find('[data-testid="pagination-bottom"]').exists()).toBe(true);
  });

  it('should render item count when content.showItemCount is true', async () => {
    useProductsMock.mockImplementation(() => ({
      data: { value: { products, pagination: { totals: products.length } } },
      productsPerPage: { value: 2 },
    }));

    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, {
      props: { ...ItemGridMock, content: { ...ItemGridMock.content, showItemCount: true } },
    });

    expect(wrapper.find('.flex.items-center').exists()).toBe(true);
  });

  it('should not render item count when content.showItemCount is false', async () => {
    useProductsMock.mockImplementation(() => ({
      data: { value: { products: [], pagination: { totals: 0 } } },
      productsPerPage: { value: 0 },
    }));

    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, {
      props: { ...ItemGridMock, content: { ...ItemGridMock.content, showItemCount: false } },
    });

    expect(wrapper.find('.flex.items-center').exists()).toBe(false);
  });

  it('should apply correct grid classes based on props', async () => {
    useProductsMock.mockImplementation(() => ({
      data: { value: { products, pagination: { totals: products.length } } },
      productsPerPage: { value: 2 },
    }));

    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, {
      props: {
        ...ItemGridMock,
        content: {
          ...ItemGridMock.content,
          itemsPerRowMobile: 2,
          itemsPerRowTablet: 3,
          itemsPerRowDesktop: 4,
        },
      },
    });

    expect(wrapper.find('[data-testid="category-grid"]').classes()).toContain('grid-cols-2');
    expect(wrapper.find('[data-testid="category-grid"]').classes()).toContain('md:grid-cols-3');
    expect(wrapper.find('[data-testid="category-grid"]').classes()).toContain('lg:grid-cols-4');
  });
  it('should show VAT ', async () => {
    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, {
      props: { ...ItemGridMock },
    });

    expect(wrapper.text()).toContain('itemInclVAT');
  });

  it('should render the correct number of products per row based on viewport', async () => {
    const { default: ItemGrid } = await import('../ItemGrid.vue');

    const wrapper = mount(ItemGrid, {
      props: {
        ...ItemGridMock,
        content: {
          ...ItemGridMock.content,
          itemsPerRowMobile: 1,
          itemsPerRowTablet: 2,
          itemsPerRowDesktop: 3,
        },
      },
    });

    const grid = wrapper.find('[data-testid="category-grid"]');
    expect(grid.classes()).toContain('grid-cols-1');
    expect(grid.classes()).toContain('md:grid-cols-2');
    expect(grid.classes()).toContain('lg:grid-cols-3');
  });

  it('should render shipping information with a link', async () => {
    const paths = { shipping: '/shipping' };

    const { default: ItemGrid } = await import('../ItemGrid.vue');

    const wrapper = mount(ItemGrid, {
      props: { ...ItemGridMock },
      global: {
        stubs: {
          'i18n-t': {
            template: '<span><slot name="shipping"></slot></span>',
          },
        },
        mocks: {
          useLocalePath: () => (path: string) => `/mocked${path}`,
          $t: (key: string) => key,
          paths,
        },
      },
    });

    const shippingInfo = wrapper.find('[data-testid="shipping-link"]');
    expect(shippingInfo.exists()).toBe(true);
    expect(shippingInfo.text()).toContain('delivery');
    expect(shippingInfo.attributes('href')).toBe('/shipping');
  });

  it('should render correct item count when showItemCount is true', async () => {
    useProductsMock.mockImplementation(() => ({
      data: { value: { products, pagination: { totals: products.length } } },
      productsPerPage: { value: 2 },
    }));

    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, {
      props: { ...ItemGridMock, content: { ...ItemGridMock.content, showItemCount: true } },
    });

    const itemCount = wrapper.find('.flex.items-center span');
    expect(itemCount.exists()).toBe(true);
    expect(itemCount.text()).toContain(`numberOfProducts`);
  });
});
