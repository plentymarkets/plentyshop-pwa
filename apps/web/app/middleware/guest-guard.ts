export default defineNuxtRouteMiddleware((to) => {
  const { isGuest, isAuthorized } = useCustomer();
  const localePath = useLocalePath();
  const publicPaths = [localePath(paths.authLogin)];
  if (publicPaths.includes(to.path)) return;

  if (isGuest.value || (!isGuest.value && !isAuthorized.value)) return;
  return navigateTo(to);
});
