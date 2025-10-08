import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ItemGridMock } from './ItemGrid.mock';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { useProductsMock } = vi.hoisted(() => ({
  useProductsMock: vi.fn(),
}));

mockNuxtImport('useProducts', () => useProductsMock);

const products = [
  {
    variation: {
      id: 1,
      name: 'Var 1',
      availabilityId: 1,
      minimumOrderQuantity: 1,
      mayShowUnitPrice: false,
      vatId: 1,
      availability: {
        id: 1,
        icon: '',
        averageDays: 0,
        createdAt: '',
        updatedAt: '',
        names: { id: 1, availabilityId: 1, lang: 'en', name: 'Available', createdAt: '', updatedAt: '' },
      },
      availabilityUpdatedAt: '',
    },
    texts: { name1: 'Product 1', name2: '', name3: '', urlPath: '', lang: 'en' },
    unit: { unitOfMeasurement: 'pcs', names: { unitId: 1, lang: 'en', name: 'Piece' }, content: 1 },
    item: {
      id: 1,
      condition: { names: { name: 'New', lang: 'en' } },
      manufacturerId: 1,
      itemType: 'default',
      manufacturer: { externalName: 'Brand', name: 'Brand' },
    },
    images: { all: [], variation: [] },
    filter: { isSalable: true, isSalableAndActive: true },
    properties: [],
    facets: [],
  },
  {
    variation: {
      id: 2,
      name: 'Var 2',
      availabilityId: 1,
      minimumOrderQuantity: 1,
      mayShowUnitPrice: false,
      vatId: 1,
      availability: {
        id: 1,
        icon: '',
        averageDays: 0,
        createdAt: '',
        updatedAt: '',
        names: { id: 1, availabilityId: 1, lang: 'en', name: 'Available', createdAt: '', updatedAt: '' },
      },
      availabilityUpdatedAt: '',
    },
    texts: { name1: 'Product 2', name2: '', name3: '', urlPath: '', lang: 'en' },
    unit: { unitOfMeasurement: 'pcs', names: { unitId: 1, lang: 'en', name: 'Piece' }, content: 1 },
    item: {
      id: 2,
      condition: { names: { name: 'New', lang: 'en' } },
      manufacturerId: 1,
      itemType: 'default',
      manufacturer: { externalName: 'Brand', name: 'Brand' },
    },
    images: { all: [], variation: [] },
    filter: { isSalable: true, isSalableAndActive: true },
    properties: [],
    facets: [],
  },
];

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

  //   it('renders empty state if no products', async () => {
  //  useProductsMock.mockImplementation(() => ({
  //     data: { value: { products: [0], pagination: { totals: 0 } } },
  //     productsPerPage: { value: 0 },
  //   }));
  //   const { default: ItemGrid } = await import('../ItemGrid.vue');
  //   const wrapper = mount(ItemGrid, {
  //     props: { ...ItemGridMock },
  //   });
  //  // expect(wrapper.findComponent({ name: 'LazyCategoryEmptyState' }).exists()).toBe(true);
  //      expect(wrapper.findAll('[data-testid="empty-state"]').length).exists().toBe(true);

  // });
it('renders empty state if no products', async () => {
  useProductsMock.mockImplementation(() => ({
    data: { value: { products: [], pagination: { totals: 0 } } }, // Use an empty array for products
    productsPerPage: { value: 0 },
  }));

  const { default: ItemGrid } = await import('../ItemGrid.vue');
  const wrapper = mount(ItemGrid, {
    props: { ...ItemGridMock },
  });

  // Debugging logs
  console.log(wrapper.vm.products);
  console.log(wrapper.html());

  // Check for the empty state component
  expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true);
});
});
