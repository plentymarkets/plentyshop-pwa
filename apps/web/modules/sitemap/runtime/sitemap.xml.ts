import { sitemapPages, buildTime } from '#sitemap-data';
import { createHash } from 'node:crypto';
import { NO_CHANGE, NEVER, ALWAYS } from '~/utils/urlTrailingSlashConstants';

// eslint-disable-next-line custom-rules/file-organization-types
type SitemapURL = {
  loc: string;
  alternate?: { hreflang: string; href: string }[];
  lastmod?: string;
};

const parseTrailingSlashSetting = (value: unknown): number => {
  let parsedSetting: number | null = null;

  if (typeof value === 'number' && Number.isFinite(value)) parsedSetting = Math.trunc(value);

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed)) parsedSetting = parsed;
  }

  return parsedSetting === NEVER || parsedSetting === ALWAYS ? parsedSetting : NO_CHANGE;
};

const resolveTrailingSlashSetting = (siteSetting: number, defaultMode: string): number => {
  if (siteSetting !== NO_CHANGE) return siteSetting;
  if (defaultMode === 'never') return NEVER;
  if (defaultMode === 'always') return ALWAYS;

  return NO_CHANGE;
};

const URL_TRAILING_SLASH_SETTING_KEY = 'urlTrailingSlash';
const SETTINGS_CACHE_KEY = `sitemap:${URL_TRAILING_SLASH_SETTING_KEY}`;
const SETTINGS_CACHE_TTL_SECONDS = 3600;

const getSettingsCacheKey = (apiUrl: string): string => {
  const source = apiUrl.length > 0 ? apiUrl : 'default';
  const hash = createHash('sha256').update(source).digest('hex').slice(0, 24);
  return `${SETTINGS_CACHE_KEY}:${hash}`;
};

const getSiteTrailingSlashSetting = async (apiUrl: string): Promise<number> => {
  const storage = useStorage();
  const cacheKey = getSettingsCacheKey(apiUrl);
  const cached = await storage.getItem(cacheKey);

  if (cached !== null) return parseTrailingSlashSetting(cached);

  if (apiUrl.length === 0) {
    await storage.setItem(cacheKey, NO_CHANGE, { ttl: SETTINGS_CACHE_TTL_SECONDS });
    return NO_CHANGE;
  }

  try {
    const response = await $fetch<{ data: { originalKey: string; value: string | null }[] }>(
      `${apiUrl}/plentysystems/getSettings`,
    );

    const trailingSlashSetting = response?.data?.find(
      (setting) => setting.originalKey === URL_TRAILING_SLASH_SETTING_KEY,
    );

    const value = parseTrailingSlashSetting(trailingSlashSetting?.value);
    await storage.setItem(cacheKey, value, { ttl: SETTINGS_CACHE_TTL_SECONDS });
    return value;
  } catch {
    await storage.setItem(cacheKey, NO_CHANGE, { ttl: SETTINGS_CACHE_TTL_SECONDS });
    return NO_CHANGE;
  }
};

const applyTrailingSlash = (url: string, setting: number): string => {
  let urlObj: URL;

  try {
    urlObj = new URL(url);
  } catch {
    return url;
  }

  const pathname = urlObj.pathname || '/';
  const isRoot = pathname === '/';

  if (isRoot) {
    return url;
  }

  if (setting === ALWAYS) {
    if (!pathname.endsWith('/')) {
      urlObj.pathname = `${pathname}/`;
      return urlObj.toString();
    }

    return url;
  }

  if (setting === NEVER) {
    if (pathname.endsWith('/')) {
      urlObj.pathname = pathname.slice(0, -1) || '';
      return urlObj.toString();
    }

    return url;
  }

  return url;
};

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml');

  const host = getRequestHost(event);
  const baseUrl = host.startsWith('localhost') ? `http://${host}` : `https://${host}`;
  const config = useRuntimeConfig();
  const { locales, defaultLocale } = config.public.plentySitemap;
  const publicConfig = config.public as Record<string, unknown>;
  const shopCore = publicConfig.shopCore as Record<string, unknown> | undefined;
  const apiUrlFromShopCore = typeof shopCore?.apiUrl === 'string' ? shopCore.apiUrl : '';
  const domain = typeof publicConfig.domain === 'string' ? publicConfig.domain : '';
  const apiUrl = apiUrlFromShopCore.length > 0 ? apiUrlFromShopCore : domain;
  const siteTrailingSlashSetting = await getSiteTrailingSlashSetting(apiUrl);
  const effectiveTrailingSlash = resolveTrailingSlashSetting(siteTrailingSlashSetting, 'never');
  const urls: SitemapURL[] = [];
  const lastmod = buildTime;
  const buildPageUrl = (pagePath: string, locale?: string): string => {
    const prefix = locale && locale !== defaultLocale ? `/${locale}` : '';
    return applyTrailingSlash(`${baseUrl}${prefix}${pagePath || '/'}`, effectiveTrailingSlash);
  };

  for (const pagePath of sitemapPages) {
    const alternate =
      locales.length > 0
        ? [
            ...locales.map((locale) => ({ hreflang: locale, href: buildPageUrl(pagePath, locale) })),
            { hreflang: 'x-default', href: buildPageUrl(pagePath) },
          ]
        : undefined;
    const localeEntries = locales.length > 0 ? locales : [undefined];

    for (const locale of localeEntries) {
      const urlEntry: SitemapURL = {
        loc: buildPageUrl(pagePath, locale),
        lastmod,
      };

      if (alternate) urlEntry.alternate = alternate;

      urls.push(urlEntry);
    }
  }

  const renderUrl = (url: SitemapURL) => {
    const alternateLinks =
      url.alternate
        ?.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`)
        .join('\n') ?? '';

    return `  <url>
    <loc>${url.loc}</loc>
${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>\n` : ''}${alternateLinks}
  </url>`;
  };

  return `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/_nuxt-plenty/sitemap_style.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(renderUrl).join('\n')}
</urlset>`;
});
