export default defineNuxtRouteMiddleware(async ({ query }) => {
  const accessKey = query.ak?.toString();
  const orderId = query.id?.toString();
  const lang = query.Lang?.toString();

  if (accessKey && orderId) {
    if (lang) {
      const { createLocalePath } = useLocalization();
      return navigateTo(createLocalePath(`${paths.confirmation}/${orderId}/${accessKey}`, lang));
    }
    const localePath = useLocalePath();
    return navigateTo(localePath(`${paths.confirmation}/${orderId}/${accessKey}`));
  }
});
