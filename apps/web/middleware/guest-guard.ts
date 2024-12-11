export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isGuest, isAuthorized, getSession } = useCustomer();
  const localePath = useLocalePath();
  await getSession();

  if (isGuest.value || (!isGuest.value && !isAuthorized.value)) return;

  const redirectUrl = to.query.redirect as string;
  if (redirectUrl) return navigateTo(localePath(redirectUrl));
  
  return navigateTo(localePath(paths.home));
});
