export default defineNuxtRouteMiddleware(({ query }) => {
  if (query.ActionCall === 'WebActionConfirmNewsletter') {
    const { ActionCall, ...theRestQuery } = query;
    return navigateTo({ path: paths.newsletterConfirmation, query: theRestQuery });
  }
});
