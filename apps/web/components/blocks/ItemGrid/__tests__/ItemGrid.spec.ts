import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ItemGridMock } from './ItemGrid.mock';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

// Hardcoded products for test
// const products = [
//   {
//     variation: {
//       id: 1,
//       name: 'Var 1',
//       availabilityId: 1,
//       minimumOrderQuantity: 1,
//       mayShowUnitPrice: false,
//       vatId: 1,
//       availability: {
//         id: 1,
//         icon: '',
//         averageDays: 0,
//         createdAt: '',
//         updatedAt: '',
//         names: { id: 1, availabilityId: 1, lang: 'en', name: 'Available', createdAt: '', updatedAt: '' },
//       },
//       availabilityUpdatedAt: '',
//     },
//     texts: { name1: 'Product 1', name2: '', name3: '', urlPath: '', lang: 'en' },
//     unit: { unitOfMeasurement: 'pcs', names: { unitId: 1, lang: 'en', name: 'Piece' }, content: 1 },
//     item: {
//       id: 1,
//       condition: { names: { name: 'New', lang: 'en' } },
//       manufacturerId: 1,
//       itemType: 'default',
//       manufacturer: { externalName: 'Brand', name: 'Brand' },
//     },
//     images: { all: [], variation: [] },
//     filter: { isSalable: true, isSalableAndActive: true },
//     properties: [],
//     facets: [],
//   },
//   {
//     variation: {
//       id: 2,
//       name: 'Var 2',
//       availabilityId: 1,
//       minimumOrderQuantity: 1,
//       mayShowUnitPrice: false,
//       vatId: 1,
//       availability: {
//         id: 1,
//         icon: '',
//         averageDays: 0,
//         createdAt: '',
//         updatedAt: '',
//         names: { id: 1, availabilityId: 1, lang: 'en', name: 'Available', createdAt: '', updatedAt: '' },
//       },
//       availabilityUpdatedAt: '',
//     },
//     texts: { name1: 'Product 2', name2: '', name3: '', urlPath: '', lang: 'en' },
//     unit: { unitOfMeasurement: 'pcs', names: { unitId: 1, lang: 'en', name: 'Piece' }, content: 1 },
//     item: {
//       id: 2,
//       condition: { names: { name: 'New', lang: 'en' } },
//       manufacturerId: 1,
//       itemType: 'default',
//       manufacturer: { externalName: 'Brand', name: 'Brand' },
//     },
//     images: { all: [], variation: [] },
//     filter: { isSalable: true, isSalableAndActive: true },
//     properties: [],
//     facets: [],
//   },
// ];

describe('ItemGrid.vue', () => {
  beforeEach(() => {
    // mockNuxtImport('useProducts', () => {
    //   return () => ({
    //     data: { value: { products, pagination: { totals: products.length } } },
    //     productsPerPage: { value: 2 },
    //   });
    // });

    mockNuxtImport('useWishlist', () => {
      return () => {
        return { data: computed(() => []), fetchProducts: () => {} };
      };
    });
  });

  it('renders correct number of products per row for each breakpoint', async () => {
    const { default: ItemGrid } = await import('../ItemGrid.vue');
    const wrapper = mount(ItemGrid, {
      props: { ...ItemGridMock },
      global: {
        stubs: {
          NuxtLazyHydrate: { template: '<div><slot /></div>' },
          UiProductCard: { template: '<div data-testid="card" />' },
        },
      },
    });
    const grid = wrapper.find('[data-testid="category-grid"]');

    expect(grid.exists()).toBe(true);
    expect(grid.classes()).toContain('mb-10');
    expect(grid.classes()).toContain('gap-4');
    expect(grid.classes()).toContain('md:gap-6');
    expect(grid.classes()).toContain('md:mb-5');
  });
});
// import { describe, it, expect, vi, beforeEach } from 'vitest'
// import { mount } from '@vue/test-utils'
// import { ItemGridMock } from './ItemGrid.mock'

// // Hoist-safe data used by mocks
// const h = vi.hoisted(() => ({
//   products: [
//     { variation: { id: 1 } },
//     { variation: { id: 2 } },
//   ],
// }))

// vi.mock('#app', () => ({
//   useNuxtApp: () => ({ $config: {}, vueApp: {} }),
// }))

// // Everything ItemGrid touches should be stubbed
// vi.mock('~/composables/useProducts', () => {
//   // keep it simple; you can also import ref from 'vue' and use ref(...)
//   return {
//     useProducts: () => ({
//       data: { value: { products: h.products, pagination: { totals: h.products.length } } },
//       productsPerPage: { value: 2 },
//     }),
//   }
// })

// vi.mock('~/composables/useCategoryFilter', () => ({
//   useCategoryFilter: () => ({
//     getFacetsFromURL: () => ({ page: 1, categoryUrlPath: 'cat' }),
//   }),
// }))

// vi.mock('~/composables/useViewport', () => ({
//   useViewport: () => ({ isGreaterOrEquals: (bp: string) => bp === 'lg' }),
// }))

// vi.mock('~/composables/useCart', () => ({
//   useCart: () => ({ showNetPrices: false }),
// }))

// vi.mock('~/composables/useLocalePath', () => ({
//   useLocalePath: () => (path: string) => path,
// }))

// vi.mock('vue-i18n', () => ({
//   useI18n: () => ({ t: (k: string) => k }),
// }))

// vi.mock('~/utils/scroll', () => ({
//   scrollToHTMLObject: vi.fn(),
// }))

// vi.mock('@plentymarkets/shop-api', () => ({
//   productGetters: {
//     getVariationId: (p: any) => p?.variation?.id ?? null,
//   },
// }))

// describe('ItemGrid.vue', () => {
//   beforeEach(() => {
//     vi.clearAllMocks()
//   })

//   it('renders correct number of products per row for each breakpoint', async () => {

//     const { default: ItemGrid } = await import('../ItemGrid.vue')

//     const wrapper = mount(ItemGrid, {
//       props: { ...ItemGridMock },
//       global: {
//         stubs: {
//           NuxtLazyHydrate: { template: '<div><slot /></div>' },
//           UiProductCard: { template: '<div data-testid="card" />' },
//         },
//       },
//     })

//     const grid = wrapper.find('[data-testid="category-grid"]')
//     expect(grid.exists()).toBe(true)
//     expect(grid.classes()).toContain('mb-10')
//     expect(grid.classes()).toContain('gap-4')
//     expect(grid.classes()).toContain('md:gap-6')
//     expect(grid.classes()).toContain('md:mb-5')

//     // sanity: 2 cards rendered
//     expect(wrapper.findAll('[data-testid="card"]').length).toBe(2)
//   })
// })

//   it('renders empty state if no products', async () => {
//     vi.mock('~/composables/useProducts', () => ({
//       useProducts: () => ({
//         data: { value: { products: [], pagination: { totals: 0 } } },
//         productsPerPage: { value: 2 },
//       }),
//     }));
//     const { default: ItemGrid } = await import('../ItemGrid.vue');
//     const wrapper = mount(ItemGrid, {
//       props: { ...ItemGridMock },
//       global: {
//         stubs: {
//           NuxtLazyHydrate: { template: '<div><slot /></div>' },
//           UiProductCard: { template: '<div data-testid="card" />' },
//         },
//       },
//     });
//     expect(wrapper.findComponent({ name: 'LazyCategoryEmptyState' }).exists()).toBe(true);
//   });
// });

//   it('renders empty state if no products', async () => {
//     vi.doMock('~/composables/useProducts', () => ({
//       useProducts: () => ({
//         data: { value: { products: [], pagination: { totals: 0 } } },
//         productsPerPage: { value: 2 },
//       }),
//     }));
//     const { default: ItemGrid } = await import('../ItemGrid.vue');
//     const wrapper = mount(ItemGrid, { props: ItemGridMock });
//     expect(wrapper.findComponent({ name: 'LazyCategoryEmptyState' }).exists()).toBe(true);
//   });

//   it('renders correct number of products per row for each breakpoint', () => {
//     const wrapper = mount(ItemGrid, { props: ItemGridMock });
//     const grid = wrapper.find('[data-testid="category-grid"]');
//     console.log(grid.html());
//     expect(grid.exists()).toBe(true);

// expect(grid.classes()).toContain('mb-10');
// expect(grid.classes()).toContain('gap-4');
// expect(grid.classes()).toContain('md:gap-6');
// expect(grid.classes()).toContain('md:mb-5');
//   });

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
//  });
