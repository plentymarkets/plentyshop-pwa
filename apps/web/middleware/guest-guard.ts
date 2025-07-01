export default defineNuxtRouteMiddleware((to) => {
  const { isGuest, isAuthorized } = useCustomer();
  if (isGuest.value || (!isGuest.value && !isAuthorized.value)) return;

  return navigateTo(to);
});
