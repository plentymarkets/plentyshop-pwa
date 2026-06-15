import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Product } from '@plentymarkets/shop-api';
import TextContent from '../TextContent.vue';

const { useRouterMock, isInternalLinkMock, useProductsMock } = vi.hoisted(() => ({
  useRouterMock: vi.fn(),
  isInternalLinkMock: vi.fn(),
  useProductsMock: vi.fn(),
}));

mockNuxtImport('useRouter', () => useRouterMock);
mockNuxtImport('useLocalePath', () => () => (path: string) => `/de${path}`);
mockNuxtImport('isInternalLink', () => isInternalLinkMock);
mockNuxtImport('useProducts', () => useProductsMock);

const mockPush = vi.fn();
const mockProduct = {
  variationProperties: [
    {
      id: 1,
      name: 'Appearance',
      properties: [
        {
          id: 10,
          cast: 'text',
          groupId: 1,
          values: { value: 'Red', description: '' },
        },
      ],
    },
  ],
} as Product;

const mountComponent = (htmlDescription: string) =>
  mount(TextContent, {
    props: {
      text: { htmlDescription },
    },
  });

describe('TextContent - renderedHtmlDescription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useRouterMock.mockReturnValue({ push: mockPush, resolve: vi.fn() });
    isInternalLinkMock.mockImplementation((href: string) => href.startsWith('/'));
    useProductsMock.mockReturnValue({ currentProduct: ref(mockProduct) });
  });

  it('should localize internal hrefs with localePath', () => {
    const wrapper = mountComponent('<p><a href="/shop">Shop</a></p>');
    expect(wrapper.html()).toContain('href="/de/shop"');
  });

  it('should not rewrite external hrefs', () => {
    const wrapper = mountComponent('<p><a href="https://google.com">Google</a></p>');
    expect(wrapper.html()).toContain('href="https://google.com"');
  });

  it('should only rewrite <a> tags, not other elements with href', () => {
    const wrapper = mountComponent('<link href="/style.css"><a href="/shop">Shop</a>');
    expect(wrapper.html()).toContain('href="/style.css"');
    expect(wrapper.html()).toContain('href="/de/shop"');
  });

  it('should handle single-quoted hrefs', () => {
    const wrapper = mountComponent("<a href='/shop'>Shop</a>");
    expect(wrapper.html()).toContain('/de/shop');
  });

  it('should render property name placeholders as plain text labels', () => {
    const wrapper = mountComponent(
      '<p><span data-property-token="Color" data-property-label="Color" data-property-kind="property-name">Color</span></p>',
    );

    const html = wrapper.find('[data-testid="text-html"]').html();
    expect(html).toContain('data-property-kind="property-name"');
    expect(html).toContain('>Color</span>');
  });

  it('should render property value placeholders with the resolved product value', () => {
    const wrapper = mountComponent(
      '<p><span data-property-token="{{value}}" data-property-label="{value}" data-property-id="10" data-property-kind="property-value">{value}</span></p>',
    );

    const html = wrapper.find('[data-testid="text-html"]').html();
    expect(html).toContain('data-property-kind="property-value"');
    expect(html).toContain('>Red</span>');
  });

  it('should resolve value placeholders when property id is encoded in the token', () => {
    const wrapper = mountComponent(
      '<p><span data-property-token="{{value:10}}" data-property-label="{value}" data-property-kind="property-value">{value}</span></p>',
    );

    const html = wrapper.find('[data-testid="text-html"]').html();
    expect(html).toContain('data-property-kind="property-value"');
    expect(html).toContain('>Red</span>');
  });

  it('should preserve inline styles on resolved value placeholders', () => {
    const wrapper = mountComponent(
      '<p><span style="font-family: serif; font-size: 20px;" data-property-token="{{value:10}}" data-property-label="{value}" data-property-kind="property-value">{value}</span></p>',
    );

    const html = wrapper.find('[data-testid="text-html"]').html();
    expect(html).toContain('font-family: serif;');
    expect(html).toContain('font-size: 20px;');
    expect(html).toContain('Red');
  });

  it('should fall back to the placeholder label when no product value can be resolved', () => {
    useProductsMock.mockReturnValue({ currentProduct: ref({} as Product) });
    const wrapper = mountComponent(
      '<p><span data-property-token="{{value}}" data-property-label="{value}" data-property-id="10" data-property-kind="property-value">{value}</span></p>',
    );

    const html = wrapper.find('[data-testid="text-html"]').html();
    expect(html).toContain('data-property-kind="property-value"');
    expect(html).toContain('>{value}</span>');
  });
});

describe('TextContent - handleRteClick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useRouterMock.mockReturnValue({ push: mockPush, resolve: vi.fn() });
  });

  it('should navigate via router.push for internal links', async () => {
    isInternalLinkMock.mockReturnValue(true);
    const wrapper = mountComponent('<a href="/shop">Shop</a>');
    await wrapper.find('a').trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/de/shop');
  });

  it('should not call router.push for external links', async () => {
    isInternalLinkMock.mockReturnValue(false);
    const wrapper = mountComponent('<a href="https://google.com">Google</a>');
    await wrapper.find('a').trigger('click');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not call router.push when target="_blank"', async () => {
    isInternalLinkMock.mockReturnValue(true);
    const wrapper = mountComponent('<a href="/de/shop" target="_blank">Shop</a>');
    await wrapper.find('a').trigger('click');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not call router.push on middle click (button=1)', async () => {
    isInternalLinkMock.mockReturnValue(true);
    const wrapper = mountComponent('<a href="/de/shop">Shop</a>');
    await wrapper.find('a').trigger('click', { button: 1 });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not call router.push on Cmd+click', async () => {
    isInternalLinkMock.mockReturnValue(true);
    const wrapper = mountComponent('<a href="/de/shop">Shop</a>');
    await wrapper.find('a').trigger('click', { metaKey: true });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not call router.push on Ctrl+click', async () => {
    isInternalLinkMock.mockReturnValue(true);
    const wrapper = mountComponent('<a href="/de/shop">Shop</a>');
    await wrapper.find('a').trigger('click', { ctrlKey: true });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
