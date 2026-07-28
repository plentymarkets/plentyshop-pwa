type NuxtAppOverrides = Record<string | symbol, unknown>;

/**
 * @nuxt/test-utils v4's setupNuxt relies on the real Nuxt app instance (its router and `_route`),
 * so replacing `useNuxtApp` wholesale breaks test setup. Use this inside a `mockNuxtImport('useNuxtApp', ...)`
 * factory to proxy the real app and override only the properties a test needs (e.g. `$i18n`, `$isEditor`).
 *
 * Usage:
 *   mockNuxtImport('useNuxtApp', () => () => proxyNuxtApp({ $i18n: { locale: localeRef } }));
 */
export const proxyNuxtApp = (overrides: NuxtAppOverrides): unknown => {
  const app = tryUseNuxtApp();

  if (!app) {
    return overrides;
  }

  return new Proxy(app as unknown as NuxtAppOverrides, {
    get: (target, prop) => (prop in overrides ? overrides[prop] : Reflect.get(target, prop)),
    has: (target, prop) => prop in overrides || Reflect.has(target, prop),
    set: (target, prop, value) => {
      // Keep overridden props read/write consistent (composables may store state on nuxtApp).
      if (prop in overrides) {
        overrides[prop] = value;
        return true;
      }
      return Reflect.set(target, prop, value);
    },
  });
};
