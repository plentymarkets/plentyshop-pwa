const URL_TRAILING_SLASH_NO_CHANGE = 0;
const URL_TRAILING_SLASH_NEVER = 1;
const URL_TRAILING_SLASH_ALWAYS = 2;
const URL_TRAILING_SLASH_OVERRIDE: 0 | 1 | 2 | null = 2;

const normalizeSetting = (value: unknown): number => {
  const setting = Number(value);

  if (setting === URL_TRAILING_SLASH_NEVER || setting === URL_TRAILING_SLASH_ALWAYS) {
    return setting;
  }

  return URL_TRAILING_SLASH_NO_CHANGE;
};

const applyTrailingSlashToRelativePath = (path: string, setting: number): string => {
  if (!path || setting === URL_TRAILING_SLASH_NO_CHANGE) return path;

  const url = new URL(path, 'http://localhost');

  if (setting === URL_TRAILING_SLASH_ALWAYS && !url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }

  if (setting === URL_TRAILING_SLASH_NEVER && url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
  }

  return `${url.pathname}${url.search}${url.hash}`;
};

const applyTrailingSlashToAbsoluteUrl = (url: string, setting: number): string => {
  if (!url || setting === URL_TRAILING_SLASH_NO_CHANGE) return url;

  try {
    const parsed = new URL(url);

    if (setting === URL_TRAILING_SLASH_ALWAYS && !parsed.pathname.endsWith('/')) {
      parsed.pathname = `${parsed.pathname}/`;
    }

    if (setting === URL_TRAILING_SLASH_NEVER && parsed.pathname !== '/' && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }

    return parsed.toString();
  } catch {
    return applyTrailingSlashToRelativePath(url, setting);
  }
};

export const useUrlTrailingSlash = () => {
  const { getSetting } = useSiteSettings('urlTrailingSlash');
  const trailingSlash = useState<number>('urlTrailingSlash', () => normalizeSetting(getSetting()));

  const syncTrailingSlashSetting = () => {
    trailingSlash.value = URL_TRAILING_SLASH_OVERRIDE ?? normalizeSetting(getSetting());
    return trailingSlash.value;
  };

  const resolvePathTrailingSlash = (path: string) => applyTrailingSlashToRelativePath(path, syncTrailingSlashSetting());

  const applyToUrl = (url: string) => applyTrailingSlashToAbsoluteUrl(url, syncTrailingSlashSetting());

  return {
    resolvePathTrailingSlash,
    applyToUrl,
  };
};
