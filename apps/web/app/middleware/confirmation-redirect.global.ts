const OLD_CONFIRMATION_URL_REGEX = /^\/(?:(\w{2})\/)?[-_a-zA-Z0-9]*\/akQQ([^/]+)\/idQQ(\d+)(?:\.html)?\/?$/;

export function matchOldConfirmationUrl(
  path: string,
): { lang?: string; orderId: string; orderAccessKey: string } | null {
  const match = path.match(OLD_CONFIRMATION_URL_REGEX);

  if (match) {
    const lang = match[1]; // Optional
    const orderAccessKey = match[2];
    const orderId = match[3];

    return {
      lang: lang ?? undefined,
      orderAccessKey: orderAccessKey ?? '',
      orderId: orderId ?? '',
    };
  }

  return null;
}

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) return;
  const path = to.path;

  if (path !== '/' && !path.includes('akQQ')) return;

  if (path.includes('akQQ') && path.includes('idQQ')) {
    const match = matchOldConfirmationUrl(path);
    if (match) {
      const langPrefix = match.lang ? `/${match.lang}` : '';
      return navigateTo(`${langPrefix}${paths.confirmation}/${match.orderId}/${match.orderAccessKey}`, {
        redirectCode: 301,
      });
    }
  }

  if (path === '/' && (to.query.ak || to.query.id)) {
    const accessKey = to.query.ak?.toString();
    const orderId = to.query.id?.toString();

    if (accessKey && orderId) {
      const lang = to.query.Lang?.toString();

      if (lang) {
        const { createLocalePath } = useLocalization();
        return navigateTo(createLocalePath(`${paths.confirmation}/${orderId}/${accessKey}`, lang));
      }

      const localePath = useLocalePath();
      return navigateTo(localePath(`${paths.confirmation}/${orderId}/${accessKey}`));
    }
  }
});
