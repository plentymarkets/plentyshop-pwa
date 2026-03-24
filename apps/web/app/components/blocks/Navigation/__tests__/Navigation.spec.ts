import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { CategoryTreeMock } from '../../../../../__tests__/__mocks__/category-tree.mock';
import Navigation from '../Navigation.vue';

const { useViewportMock, useRouterMock, useMegaMenuMock, useCategoryTreeMock } = vi.hoisted(() => ({
  useViewportMock: vi.fn(),
  useRouterMock: vi.fn(),
  useMegaMenuMock: vi.fn(),
  useCategoryTreeMock: vi.fn(),
}));

mockNuxtImport('useViewport', () => useViewportMock);
mockNuxtImport('useRouter', () => useRouterMock);
mockNuxtImport('useMegaMenu', () => useMegaMenuMock);
mockNuxtImport('useCategoryTree', () => useCategoryTreeMock);
mockNuxtImport('useLocalePath', () => () => (path: string) => path);
mockNuxtImport('useLocalization', () => () => ({
  buildCategoryMenuLink: (category: { id: number }) => `/category/${category.id}`,
}));

describe('Navigation.vue', () => {
  beforeEach(() => {
    useViewportMock.mockReturnValue({
      isGreaterOrEquals: () => true,
    });

    useRouterMock.mockReturnValue({
      afterEach: () => () => undefined,
    });

    useMegaMenuMock.mockReturnValue({
      close: vi.fn(),
      open: vi.fn(),
      isOpen: ref(false),
      activeNode: ref([]),
      category: ref(null),
      setCategory: vi.fn(),
    });

    useCategoryTreeMock.mockReturnValue({
      data: ref([]),
      getCategoryTree: vi.fn(),
    });
  });

  it('should render desktop navigation and category buttons', () => {
    const wrapper = mount(Navigation, {
      props: {
        categories: CategoryTreeMock.slice(0, 2),
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to || href"><slot /></a>',
            props: ['to', 'href'],
          },
          SfDrawer: true,
          SfListItem: true,
          SfIconClose: true,
          SfIconChevronRight: true,
          SfCounter: true,
          SfIconArrowBack: true,
          UiButton: true,
        },
      },
    });

    expect(wrapper.find('nav').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid="category-button"]').length).toBe(2);
  });

  it('should apply alignment and layout styles from content props', () => {
    const wrapper = mount(Navigation, {
      props: {
        categories: CategoryTreeMock.slice(0, 1),
        content: {
          text: { textAlignment: 'center' },
          color: { backgroundColor: '#ffffff', textColor: '#111111' },
          layout: {
            paddingTop: 10,
            paddingBottom: 20,
            paddingLeft: 30,
            paddingRight: 40,
          },
        },
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to || href"><slot /></a>',
            props: ['to', 'href'],
          },
          SfDrawer: true,
          SfListItem: true,
          SfIconClose: true,
          SfIconChevronRight: true,
          SfCounter: true,
          SfIconArrowBack: true,
          UiButton: true,
        },
      },
    });

    const list = wrapper.find('ul');
    expect(list.classes()).toContain('justify-center');

    const style = list.attributes('style') ?? '';
    expect(style).toContain('background-color: #ffffff;');
    expect(style).toContain('color: #111111;');
    expect(style).toContain('padding: 10px 40px 20px 30px;');
  });
});
