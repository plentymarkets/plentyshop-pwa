import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import TextContent from '../TextContent.vue';

const { useRouterMock, isInternalLinkMock } = vi.hoisted(() => ({
  useRouterMock: vi.fn(),
  isInternalLinkMock: vi.fn(),
}));

mockNuxtImport('useRouter', () => useRouterMock);
mockNuxtImport('useLocalePath', () => () => (path: string) => `/de${path}`);
mockNuxtImport('isInternalLink', () => isInternalLinkMock);

const mockPush = vi.fn();

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
  });

  it('localizes internal hrefs with localePath', () => {
    const wrapper = mountComponent('<p><a href="/shop">Shop</a></p>');
    expect(wrapper.html()).toContain('href="/de/shop"');
  });

  it('does not rewrite external hrefs', () => {
    const wrapper = mountComponent('<p><a href="https://google.com">Google</a></p>');
    expect(wrapper.html()).toContain('href="https://google.com"');
  });

  it('only rewrites <a> tags, not other elements with href', () => {
    const wrapper = mountComponent('<link href="/style.css"><a href="/shop">Shop</a>');
    expect(wrapper.html()).toContain('href="/style.css"');
    expect(wrapper.html()).toContain('href="/de/shop"');
  });

  it('handles single-quoted hrefs', () => {
    const wrapper = mountComponent("<a href='/shop'>Shop</a>");
    expect(wrapper.html()).toContain('/de/shop');
  });
});

describe('TextContent - handleRteClick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useRouterMock.mockReturnValue({ push: mockPush, resolve: vi.fn() });
  });

  it('navigates via router.push for internal links', async () => {
    isInternalLinkMock.mockReturnValue(true);
    const wrapper = mountComponent('<a href="/shop">Shop</a>');
    await wrapper.find('a').trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/de/shop');
  });

  it('does not call router.push for external links', async () => {
    isInternalLinkMock.mockReturnValue(false);
    const wrapper = mountComponent('<a href="https://google.com">Google</a>');
    await wrapper.find('a').trigger('click');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not call router.push when target="_blank"', async () => {
    isInternalLinkMock.mockReturnValue(true);
    const wrapper = mountComponent('<a href="/de/shop" target="_blank">Shop</a>');
    await wrapper.find('a').trigger('click');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not call router.push on middle click (button=1)', async () => {
    isInternalLinkMock.mockReturnValue(true);
    const wrapper = mountComponent('<a href="/de/shop">Shop</a>');
    await wrapper.find('a').trigger('click', { button: 1 });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not call router.push on Cmd+click', async () => {
    isInternalLinkMock.mockReturnValue(true);
    const wrapper = mountComponent('<a href="/de/shop">Shop</a>');
    await wrapper.find('a').trigger('click', { metaKey: true });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not call router.push on Ctrl+click', async () => {
    isInternalLinkMock.mockReturnValue(true);
    const wrapper = mountComponent('<a href="/de/shop">Shop</a>');
    await wrapper.find('a').trigger('click', { ctrlKey: true });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
