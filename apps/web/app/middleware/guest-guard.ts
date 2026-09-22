export default defineNuxtRouteMiddleware(() => {
  const { isAuthorized } = useCustomer();
  const localePath = useLocalizedPath();

  if (isAuthorized.value) return navigateTo(localePath(paths.home));
});
