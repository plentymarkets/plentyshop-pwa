export default defineNuxtRouteMiddleware(() => {
  const { isGuest, isAuthorized } = useCustomer();
  const localePath = useLocalePath();

  if (isGuest.value || (!isGuest.value && !isAuthorized.value)) return;
  return navigateTo(localePath(paths.home));
});
