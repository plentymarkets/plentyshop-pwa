export default defineNuxtRouteMiddleware(async (to) => {
  if (to.query.ak && to.query.id) {
    const lang = to.query.Lang?.toString();
    if (lang) {
      const { createLocalePath } = useLocalization();
      return navigateTo(createLocalePath(`${paths.confirmation}/${to.query.id}/${to.query.ak}`, lang));
    }
    const localePath = useLocalePath();
    return navigateTo(localePath(`${paths.confirmation}/${to.query.id}/${to.query.ak}`));
  }
});
