import { handlePreviousRouteNavigation, isInternalLink, localizeHtmlLinks } from '~/utils/urlHelper';

import { paths } from '~/utils/paths';
import { vi } from 'vitest';
import type { Router } from 'vue-router';

describe('handlePreviousRouteNavigation', () => {
  const mockRouterGo = vi.fn();
  const mockNavigateTo = vi.fn();
  const mockLocalePath = vi.fn((path) => `/en${path}`);

  let dependencies: Parameters<typeof handlePreviousRouteNavigation>[0];

  beforeEach(() => {
    vi.clearAllMocks();
    dependencies = {
      router: {
        options: { history: { state: { back: null } } },
        go: mockRouterGo,
      } as unknown as Router,
      isAuthorized: false,
      i18n: {
        locale: { value: 'en' },
        defaultLocale: 'en',
        availableLocales: ['en', 'de'],
      } as ReturnType<typeof useNuxtApp>['$i18n'],
      localePath: mockLocalePath,
      navigateTo: mockNavigateTo,
    };
  });

  it('should navigate to home with locale if there is no back path', () => {
    handlePreviousRouteNavigation(dependencies);

    expect(mockNavigateTo).toHaveBeenCalledWith('/en/');
    expect(mockLocalePath).toHaveBeenCalledWith(paths.home);
  });

  it('should go back two steps if user is authorized and previous route was guest login', () => {
    dependencies.isAuthorized = true;
    dependencies.router.options.history.state.back = paths.guestLogin;

    handlePreviousRouteNavigation(dependencies);

    expect(mockRouterGo).toHaveBeenCalledWith(-2);
    expect(mockNavigateTo).not.toHaveBeenCalled();
  });

  it('should navigate to back path if it exists and locale matches current locale', () => {
    dependencies.router.options.history.state.back = '/en/some-page';

    handlePreviousRouteNavigation(dependencies);
    expect(mockNavigateTo).toHaveBeenCalledWith('/en/some-page');
  });

  it('should navigate to home if back path locale does not match current locale', () => {
    dependencies.router.options.history.state.back = '/de/some-page';

    handlePreviousRouteNavigation(dependencies);
    expect(mockNavigateTo).toHaveBeenCalledWith('/en/');
    expect(mockLocalePath).toHaveBeenCalledWith(paths.home);
  });

  it('should navigate to home if back path has locale that does not match current locale', () => {
    dependencies.i18n.locale.value = 'en';
    dependencies.router.options.history.state.back = '/de/cart';

    handlePreviousRouteNavigation(dependencies);
    expect(mockNavigateTo).toHaveBeenCalledWith('/en/');
    expect(mockLocalePath).toHaveBeenCalledWith(paths.home);
  });

  it('should navigate home if the backpath has no locale and current locale is not default', () => {
    dependencies.i18n.locale.value = 'de';
    dependencies.i18n.defaultLocale = 'en';
    dependencies.router.options.history.state.back = '/some-page';

    handlePreviousRouteNavigation(dependencies);
    expect(mockNavigateTo).toHaveBeenCalledWith('/en/');
    expect(mockLocalePath).toHaveBeenCalledWith(paths.home);
  });
});

describe('isInternalLink', () => {
  const makeRouter = (matchedLength: number, name: string | null = 'some-route') =>
    ({
      resolve: vi.fn(() => ({
        matched: new Array(matchedLength),
        name,
      })),
    }) as unknown as Router;

  it('should return true for a known internal path', () => {
    expect(isInternalLink('/shop', makeRouter(1))).toBe(true);
  });

  it('should return true for a path with locale prefix', () => {
    expect(isInternalLink('/de/shop', makeRouter(1))).toBe(true);
  });

  it('should return false for an http URL', () => {
    expect(isInternalLink('https://google.com', makeRouter(1))).toBe(false);
  });

  it('should return false for a protocol-relative URL', () => {
    expect(isInternalLink('//cdn.example.com', makeRouter(1))).toBe(false);
  });

  it('should return false for a mailto link', () => {
    expect(isInternalLink('mailto:info@example.com', makeRouter(1))).toBe(false);
  });

  it('should return false for a fragment-only href', () => {
    expect(isInternalLink('#anchor', makeRouter(1))).toBe(false);
  });

  it('should return false when resolved route is the error/404 route', () => {
    expect(isInternalLink('/anything', makeRouter(1, 'error'))).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isInternalLink('', makeRouter(1))).toBe(false);
  });
});

describe('localizeHtmlLinks', () => {
  const makeRouter = (matchedLength: number, name: string | null = 'some-route') =>
    ({
      resolve: vi.fn(() => ({
        matched: new Array(matchedLength),
        name,
      })),
    }) as unknown as Router;

  const localePath = ((path: string) => `/de${path}`) as unknown as ReturnType<typeof useLocalePath>;
  const resolveTrailingSlash = (path: string) => path;

  it('should rewrite an internal href with the localized path', () => {
    const result = localizeHtmlLinks(
      '<a href="/shipping">Shipping</a>',
      makeRouter(1),
      localePath,
      resolveTrailingSlash,
    );
    expect(result).toBe('<a href="/de/shipping">Shipping</a>');
  });

  it('should leave external href values unchanged', () => {
    const result = localizeHtmlLinks(
      '<a href="https://example.com">External</a>',
      makeRouter(1),
      localePath,
      resolveTrailingSlash,
    );
    expect(result).toBe('<a href="https://example.com">External</a>');
  });

  it('should rewrite multiple internal links in one pass', () => {
    const result = localizeHtmlLinks(
      '<a href="/cart">Cart</a><a href="/wishlist">Wishlist</a>',
      makeRouter(1),
      localePath,
      resolveTrailingSlash,
    );
    expect(result).toBe('<a href="/de/cart">Cart</a><a href="/de/wishlist">Wishlist</a>');
  });

  it('should not rewrite non-anchor elements with href', () => {
    const result = localizeHtmlLinks(
      '<link href="/style.css"><a href="/shop">Shop</a>',
      makeRouter(1),
      localePath,
      resolveTrailingSlash,
    );
    expect(result).toContain('href="/style.css"');
    expect(result).toContain('href="/de/shop"');
  });

  it('should apply resolveTrailingSlash to the rewritten href', () => {
    const withTrailingSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);
    const result = localizeHtmlLinks('<a href="/shop">Shop</a>', makeRouter(1), localePath, withTrailingSlash);
    expect(result).toBe('<a href="/de/shop/">Shop</a>');
  });

  it('should handle single-quoted href values', () => {
    const result = localizeHtmlLinks("<a href='/shop'>Shop</a>", makeRouter(1), localePath, resolveTrailingSlash);
    expect(result).toContain('/de/shop');
  });

  it('should return the html unchanged when there are no anchor tags', () => {
    const html = '<p>No links here</p>';
    expect(localizeHtmlLinks(html, makeRouter(1), localePath, resolveTrailingSlash)).toBe(html);
  });
});
