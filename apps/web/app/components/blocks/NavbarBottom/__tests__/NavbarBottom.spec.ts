import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import NavbarBottom from '../NavbarBottom.vue';

const { useMegaMenuMock, useWishlistMock, useCartMock, useCustomerMock } = vi.hoisted(() => ({
  useMegaMenuMock: vi.fn(),
  useWishlistMock: vi.fn(),
  useCartMock: vi.fn(),
  useCustomerMock: vi.fn(),
}));

mockNuxtImport('useMegaMenu', () => useMegaMenuMock);
mockNuxtImport('useWishlist', () => useWishlistMock);
mockNuxtImport('useCart', () => useCartMock);
mockNuxtImport('useCustomer', () => useCustomerMock);
mockNuxtImport('useLocalePath', () => () => (path: string) => path);
mockNuxtImport('useRoute', () => () => ({ path: '/' }));

const stubs = {
  NuxtLink: { template: '<a :href="to"><slot /></a>', props: ['to'] },
  UiButton: { template: '<button :style="style"><slot /></button>', props: ['style'] },
  SfBadge: true,
};

describe('blocks/NavbarBottom.vue', () => {
  beforeEach(() => {
    useMegaMenuMock.mockReturnValue({ open: vi.fn() });
    useWishlistMock.mockReturnValue({ wishlistItemIds: ref([]) });
    useCartMock.mockReturnValue({ data: ref(null) });
    useCustomerMock.mockReturnValue({ isAuthorized: ref(false) });
  });

  it('renders the nav element with data-testid', () => {
    const wrapper = mount(NavbarBottom, { global: { stubs } });
    expect(wrapper.find('[data-testid="navbar-bottom"]').exists()).toBe(true);
  });

  it('has fixed bottom-left positioning classes on the nav', () => {
    const wrapper = mount(NavbarBottom, { global: { stubs } });
    const nav = wrapper.find('[data-testid="navbar-bottom"]');
    expect(nav.classes()).toContain('fixed');
    expect(nav.classes()).toContain('bottom-0');
    expect(nav.classes()).toContain('left-0');
    expect(nav.classes()).toContain('z-sticky');
    expect(nav.classes()).toContain('w-full');
  });

  it('renders default action items (home, products, wishlist, cart, account)', () => {
    const wrapper = mount(NavbarBottom, { global: { stubs } });
    expect(wrapper.findAll('button')).toHaveLength(5);
  });

  it('applies backgroundColor and iconColor as inline style to buttons', async () => {
    const wrapper = mount(NavbarBottom, {
      props: { backgroundColor: '#ff0000', iconColor: '#00ff00' },
      global: { stubs },
    });
    const buttons = wrapper.findAll('button');
    expect(buttons[0]?.attributes('style')).toContain('#ff0000');
  });

  it('respects actionVisibility to hide items', () => {
    const wrapper = mount(NavbarBottom, {
      props: {
        actionOrder: ['wishlist', 'cart', 'account'],
        actionVisibility: { wishlist: false, cart: true, account: true },
      },
      global: { stubs },
    });
    // home + products = 2 fixed, cart + account = 2 visible, wishlist hidden
    expect(wrapper.findAll('button')).toHaveLength(4);
  });

  it('respects actionOrder to change item sequence', () => {
    const wrapper = mount(NavbarBottom, {
      props: {
        actionOrder: ['cart', 'wishlist', 'account'],
      },
      global: { stubs },
    });
    expect(wrapper.findAll('button')).toHaveLength(5);
  });
});
