/**
 * This middleware is used to check if the user is authorized.
 *
 * Use this auth guard to protect routes that require the user to be logged in.
 *
 * If the user is not authorized, the user will be redirected to the login page.
 */

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthorized } = useCustomer();
  const { getSession } = useFetchSession();
  const localePath = useLocalePath();

  await getSession();

  if (!isAuthorized.value) {
    const targetUrl = to.fullPath;
    return navigateTo({
      path: localePath(paths.authLogin),
      query: {
        redirect: targetUrl,
      },
    });
  }
});
