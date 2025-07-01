export default defineNuxtRouteMiddleware((to) => {
  const { isGuest, isAuthorized } = useCustomer();
  const localePath = useLocalePath();
  if (isGuest.value || (!isGuest.value && !isAuthorized.value)) return;

  if (to.query?.redirect) {
    window.location.href = to.query?.redirect as string;
  } else {
    return navigateTo(localePath(paths.home));
  }
});
