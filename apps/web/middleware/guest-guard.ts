export default defineNuxtRouteMiddleware(() => {
  const { isGuest, isAuthorized } = useCustomer();
  const localePath = useLocalePath();

  if (isAuthorized.value) return navigateTo(localePath(paths.home));
  if (isGuest.value || (!isGuest.value && !isAuthorized.value)) return;

  return;
});
