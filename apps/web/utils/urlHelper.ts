export const extractImageName = (url: string) => {
  const fileNameWithExtension = url.slice(Math.max(0, url.lastIndexOf('/') + 1));
  return fileNameWithExtension.slice(0, Math.max(0, fileNameWithExtension.lastIndexOf('.')));
};

type NavigationDependencies = {
  router: ReturnType<typeof useRouter>;
  isAuthorized: boolean;
  i18n: ReturnType<typeof useNuxtApp>['$i18n'];
  localePath: ReturnType<typeof useLocalePath>;
  navigateTo: typeof navigateTo;
};

export const handlePreviousRouteNavigation = (dependencies: NavigationDependencies) => {
  const { router, isAuthorized, i18n, localePath, navigateTo: navTo } = dependencies;

  const backPath = router.options.history.state?.back;
  if (isAuthorized && backPath === paths.guestLogin) {
    router.go(-2);
    return;
  }
  if (backPath) {
    const backPathLocale = String(backPath).split('/')[1];
    const isLocaleInPath = (i18n.availableLocales as readonly string[]).includes(backPathLocale);

    if (isLocaleInPath && backPathLocale !== i18n.locale.value) {
      return navTo(localePath(paths.home));
    }

    if (!isLocaleInPath && i18n.defaultLocale !== i18n.locale.value) {
      return navTo(localePath(paths.home));
    }

    return navTo(backPath as string);
  }

  return navTo(localePath(paths.home));
};
