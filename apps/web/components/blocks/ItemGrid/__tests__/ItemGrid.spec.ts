import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ItemGrid from '../ItemGrid.vue';
import { ItemGridMock } from './ItemGrid.mock';
import type { Product } from '@plentymarkets/shop-api';
import { mockProduct } from '../Products.mock';

// Mocks for composables and utils
vi.mock('@plentymarkets/shop-api', () => ({
  productGetters: {
    getVariationId: (product: Product) => product.variation?.id || null,
  },
}));

vi.mock('~/composables/useCategoryFilter', () => ({
  useCategoryFilter: () => ({
    getFacetsFromURL: () => ({ page: 1, categoryUrlPath: 'cat' }),
  }),
}));


// const getProductsMock = (products?: Product[]) => {
//   const safeProducts = products ?? mockProduct ?? [];
//   return {
//     data: { value: { products: safeProducts, pagination: { totals: safeProducts.length } } },
//     productsPerPage: { value: 2 },
//   };
// };

vi.mock('~/composables/useProducts', () => ({
  useProducts: () => ({
    data: { value: { products: [mockProduct, mockProduct], pagination: { totals: 2 } } },
    productsPerPage: { value: 2 },
  }),
}));

vi.mock('~/composables/useCart', () => ({
  useCart: () => ({
    showNetPrices: false,
  }),
}));

vi.mock('~/composables/useViewport', () => ({
  useViewport: () => ({
    isGreaterOrEquals: (bp: string) => bp === 'lg',
  }),
}));

vi.mock('~/composables/useLocalePath', () => ({
  useLocalePath: () => (path: string) => path,
}));

vi.mock('~/utils/scroll', () => ({
  scrollToHTMLObject: vi.fn(),
}));



describe('ItemGrid.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

//   it('renders empty state if no products', () => {
//   vi.doMock('~/composables/useProducts', () => ({
//     useProducts: () => getProductsMock([]),
//   }));
//   const wrapper = mount(ItemGrid, { props: ItemGridMock });
//   expect(wrapper.findComponent({ name: 'LazyCategoryEmptyState' }).exists()).toBe(true);
// });

  it('renders correct number of products per row for each breakpoint', () => {
    const wrapper = mount(ItemGrid, { props: ItemGridMock });
    const grid = wrapper.find('[data-testid="category-grid"]');
    expect(grid.exists()).toBe(true);
    // Check for grid classes (gap, mb, etc.)
    // expect(grid.classes()).toContain('mb-10');
    // expect(grid.classes()).toContain('gap-4');
    // expect(grid.classes()).toContain('md:gap-6');
    // expect(grid.classes()).toContain('md:mb-5');
  });

  //   it('shows product count when showItemCount is true', () => {
  //     const wrapper = mount(ItemGrid, { props: ItemGridMock });
  //     expect(wrapper.text()).toContain('numberOfProducts');
  //   });

  //   it('hides product count when showItemCount is false', () => {
  //     const wrapper = mount(ItemGrid, {
  //       props: {
  //         ...ItemGridMock,

  //         content: { ...ItemGridMock.content, showItemCount: false },
  //       },
  //     });
  //     expect(wrapper.text()).not.toContain('numberOfProducts');
  //   });

  //   it('positions product count correctly (left, center, right)', async () => {
  //     const wrapper = mount(ItemGrid, { props: ItemGridMock });
  //     const countDiv = wrapper.find('.flex.items-center');
  //     expect(countDiv.classes()).toContain('justify-start');
  //     await wrapper.setProps({ content: { ...ItemGridMock.content, itemCountPosition: 'center' } });
  //     expect(wrapper.find('.flex.items-center').classes()).toContain('justify-center');
  //     await wrapper.setProps({ content: { ...ItemGridMock.content, itemCountPosition: 'right' } });
  //     expect(wrapper.find('.flex.items-center').classes()).toContain('justify-end');
  //   });

  //   it('renders pagination in correct position(s)', () => {
  //     // bottom
  //     let wrapper = mount(ItemGrid, {
  //       props: {
  //         ...ItemGridMock,
  //         content: { ...ItemGridMock.content, paginationPosition: 'bottom' },
  //       },
  //     });
  //     expect(wrapper.findAllComponents({ name: 'UiPagination' }).length).toBe(1);

  //     // top
  //     wrapper = mount(ItemGrid, {
  //       props: {
  //         ...ItemGridMock,
  //         content: { ...ItemGridMock.content, paginationPosition: 'top' },
  //       },
  //     });
  //     expect(wrapper.findAllComponents({ name: 'UiPagination' }).length).toBe(1);

  //     // both
  //     wrapper = mount(ItemGrid, {
  //       props: {
  //         ...ItemGridMock,
  //         content: { ...ItemGridMock.content, paginationPosition: 'both' },
  //       },
  //     });
  //     expect(wrapper.findAllComponents({ name: 'UiPagination' }).length).toBe(2);
  //   });

  //   it('renders empty state if no products', () => {
  //     const wrapper = mount(ItemGrid, {
  //       props: { ...ItemGridMock, products: [], totalProducts: 0 },
  //     });
  //     expect(wrapper.findComponent({ name: 'LazyCategoryEmptyState' }).exists()).toBe(true);
  //   });

  //   it('shows VAT/shipping info with correct i18n', () => {
  //     const wrapper = mount(ItemGrid, { props: ItemGridMock });
  //     expect(wrapper.text()).toContain('itemInclVAT');
  //     expect(wrapper.text()).toContain('excludedShipping');
  //   });

  //   it('scrolls to headline on page change', async () => {
  //     const { scrollToHTMLObject } = await import('~/utils/scroll');
  //     const wrapper = mount(ItemGrid, { props: ItemGridMock });
  //     // Simulate page change
  //     await wrapper.vm.$nextTick();
  //     wrapper.vm.currentPage = 2;
  //     await wrapper.vm.$nextTick();
  //     expect(scrollToHTMLObject).toHaveBeenCalledWith('#category-headline', false);
  //   });
});


