export const useBrowserNavigation = () => {
  const goToPreviousRoute = () => {
    handlePreviousRouteNavigation({
      router: useRouter(),
      isAuthorized: useCustomer().isAuthorized.value,
      i18n: useNuxtApp().$i18n,
      localePath: useLocalizedPath(),
      navigateTo: navigateTo,
    });
  };

  return {
    goToPreviousRoute,
  };
};
