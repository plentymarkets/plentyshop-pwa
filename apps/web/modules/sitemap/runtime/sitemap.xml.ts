import { sitemapPages, buildTime } from '#sitemap-data';

type SitemapURL = {
  loc: string;
  alternate?: { hreflang: string; href: string }[];
  lastmod?: string;
};

const applyTrailingSlash = (url: string, mode: string): string => {
  const [path, query] = url.split('?');
  const isRoot = path === '/';
  const suffix = query ? `?${query}` : '';

  if (isRoot) return url;
  if (!path) return url;

  switch (mode) {
    case 'always':
      return path.endsWith('/') ? url : `${path}/${suffix}`;
    case 'never':
      return path.endsWith('/') ? `${path.slice(0, -1)}${suffix}` : url;
    case 'auto':
    default:
      return url;
  }
};

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml');

  const host = getRequestHost(event);
  const baseUrl = host.startsWith('localhost') ? `http://${host}` : `https://${host}`;
  const config = useRuntimeConfig();
  const { locales, defaultLocale, trailingSlash } = config.public.plentySitemap;
  const urls: SitemapURL[] = [];
  const lastmod = buildTime;

  for (const page of sitemapPages) {
    const pagePath = page.path === '/' ? '' : page.path;

    if (locales.length > 0) {
      const alternate = locales.map((locale) => {
        const prefix = locale === defaultLocale ? '' : `/${locale}`;
        const href = applyTrailingSlash(`${baseUrl}${prefix}${pagePath || '/'}`, trailingSlash);
        return { hreflang: locale, href };
      });

      alternate.push({
        hreflang: 'x-default',
        href: applyTrailingSlash(`${baseUrl}${pagePath || '/'}`, trailingSlash),
      });

      for (const locale of locales) {
        const prefix = locale === defaultLocale ? '' : `/${locale}`;
        urls.push({
          loc: applyTrailingSlash(`${baseUrl}${prefix}${pagePath || '/'}`, trailingSlash),
          alternate,
          lastmod,
        });
      }
    } else {
      urls.push({
        loc: applyTrailingSlash(`${baseUrl}${pagePath || '/'}`, trailingSlash),
        lastmod,
      });
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
