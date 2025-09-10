import { handlePreviousRouteNavigation } from '~/utils/urlHelper';
import { paths } from '~/utils/paths';
import { vi } from 'vitest';

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
      } as any,
      isAuthorized: false,
      i18n: {
        locale: { value: 'en' },
        defaultLocale: 'en',
        availableLocales: ['en', 'de'],
      } as any,
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
