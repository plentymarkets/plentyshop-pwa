export function matchOldConfirmationUrl(
  path: string,
): { lang?: string; orderId: string; orderAccessKey: string } | null {
  const regex = /^\/(?:(\w{2})\/)?[-_a-zA-Z0-9]*\/akQQ([^/]+)\/idQQ(\d+)(?:\.html)?\/?$/;
  const match = path.match(regex);

  if (match) {
    const lang = match[1]; // Optional
    const orderAccessKey = match[2];
    const orderId = match[3];

    return {
      lang,
      orderAccessKey,
      orderId,
    };
  }

  return null;
}

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) {
    const match = matchOldConfirmationUrl(to.path);
    if (match) {
      const langPrefix = match.lang ? `/${match.lang}` : '';
      return navigateTo(`${langPrefix}${paths.confirmation}/${match.orderId}/${match.orderAccessKey}`, {
        redirectCode: 301,
      });
    } else if (to.path === '/') {
      const accessKey = to.query.ak?.toString();
      const orderId = to.query.id?.toString();
      const lang = to.query.Lang?.toString();

      if (accessKey && orderId) {
        if (lang) {
          const { createLocalePath } = useLocalization();
          return navigateTo(createLocalePath(`${paths.confirmation}/${orderId}/${accessKey}`, lang));
        }
        const localePath = useLocalePath();
        return navigateTo(localePath(`${paths.confirmation}/${orderId}/${accessKey}`));
      }
    }
  }
});
