export default defineNuxtRouteMiddleware(() => {
  const { isAuthorized } = useCustomer();
  const localePath = useLocalePath();

  if (isAuthorized.value) return navigateTo(localePath(paths.home));
});
