export default defineNuxtRouteMiddleware(({ query }) => {
  if (query.ActionCall === 'WebActionConfirmNewsletter') {
    const { ActionCall, ...theRestQuery } = query;
    const localePath = useLocalePath();
    return navigateTo({ path: localePath(paths.newsletterConfirmation), query: theRestQuery });
  }
});
