export type NavigationDependencies = {
  router: ReturnType<typeof useRouter>;
  isAuthorized: boolean;
  i18n: ReturnType<typeof useNuxtApp>['$i18n'];
  localePath: ReturnType<typeof useLocalePath>;
  navigateTo: typeof navigateTo;
};
