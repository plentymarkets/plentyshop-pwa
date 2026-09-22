import { defineNuxtModule } from 'nuxt/kit';
import type { NuxtPage } from 'nuxt/schema';

const ROUTE_NAME_SEPARATOR = '___';
const DEFAULT_TREE_SUFFIX = 'default';
const FALLBACK_DEFAULT_LOCALE = 'en';

/**
 * Removes the unprefixed "default tree" routes that `@nuxtjs/i18n` (>= 10.6.0) generates for
 * non-default locales when a page restricts its locales via `defineI18nRoute({ locales })`.
 *
 * With `strategy: 'prefix_and_default'` only the default locale may own a `<name>___<locale>___default`
 * route bound to the unprefixed path. The module's default-tree localizer re-resolves the page options
 * with a narrowed locale list, but `defineI18nRoute({ locales })` short-circuits that narrowing, so every
 * locale of the page ends up with a default-tree route pointing at `/`, `/cart`, … Because route lookup
 * prefers the `___default` variant, `switchLocalePath('de')` then resolves to the unprefixed path and
 * locale switching silently does nothing.
 *
 * @param pages Localized pages as produced by `@nuxtjs/i18n`.
 * @param defaultLocale The configured i18n default locale.
 * @returns The pages without the bogus default-tree routes.
 * @example stripForeignDefaultTreeRoutes(pages, 'en');
 */
export const stripForeignDefaultTreeRoutes = (pages: NuxtPage[], defaultLocale: string): NuxtPage[] => {
  const defaultTreeRouteName = new RegExp(
    `${ROUTE_NAME_SEPARATOR}([^_]+)${ROUTE_NAME_SEPARATOR}${DEFAULT_TREE_SUFFIX}$`,
  );

  const keep = (page: NuxtPage) => {
    const locale = page.name?.match(defaultTreeRouteName)?.[1];

    if (!locale) {
      return true;
    }

    return locale === defaultLocale;
  };

  return pages.filter(keep).map((page) => {
    if (!page.children?.length) {
      return page;
    }

    return { ...page, children: stripForeignDefaultTreeRoutes(page.children, defaultLocale) };
  });
};

export default defineNuxtModule({
  meta: {
    name: 'locale-routes',
  },
  setup(_options, nuxt) {
    const defaultLocale = nuxt.options.i18n?.defaultLocale ?? FALLBACK_DEFAULT_LOCALE;

    // Registering inside `modules:done` guarantees this handler runs after the i18n module's own
    // `pages:resolved`/`pages:extend` handlers, so it sees the already localized route list.
    nuxt.hook('modules:done', () => {
      const filterPages = (pages: NuxtPage[]) => {
        const filtered = stripForeignDefaultTreeRoutes(pages, defaultLocale);

        if (filtered.length !== pages.length) {
          pages.length = 0;
          pages.push(...filtered);
        }
      };

      nuxt.hook('pages:resolved', filterPages);
      nuxt.hook('pages:extend', filterPages);
    });
  },
});
