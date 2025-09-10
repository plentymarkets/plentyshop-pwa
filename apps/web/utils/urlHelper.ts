export const extractImageName = (url: string) => {
  const fileNameWithExtension = url.slice(Math.max(0, url.lastIndexOf('/') + 1));
  return fileNameWithExtension.slice(0, Math.max(0, fileNameWithExtension.lastIndexOf('.')));
};

export const goToPreviousRoute = () => {
  const router = useRouter();
  const { isAuthorized } = useCustomer();
  const { $i18n } = useNuxtApp();
  const localePath = useLocalePath();

  const backPath = router.options.history.state?.back;
  if (isAuthorized.value && backPath === paths.guestLogin) {
    router.go(-2);
    return;
  }
  if (backPath) {
    const backPathLocale = String(backPath).split('/')[1];
    const isLocaleInPath = ($i18n.availableLocales as readonly string[]).includes(backPathLocale);

    if (isLocaleInPath && backPathLocale !== $i18n.locale.value) {
      return navigateTo(localePath(paths.home));
    }

    if (!isLocaleInPath && $i18n.defaultLocale !== $i18n.locale.value) {
      return navigateTo(localePath(paths.home));
    }

    return navigateTo(backPath as string);
  }

  return navigateTo(localePath(paths.home));
};