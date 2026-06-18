import { NO_CHANGE, NEVER, ALWAYS } from '~/utils/urlTrailingSlashConstants';

const normalizeSetting = (value: unknown): number => {
  const setting = Number(value);

  if (setting === NEVER || setting === ALWAYS) {
    return setting;
  }

  return NO_CHANGE;
};

const applyTrailingSlashToRelativePath = (path: string, setting: number): string => {
  if (!path || setting === NO_CHANGE) return path;

  const url = new URL(path, 'http://localhost');

  if (setting === ALWAYS && !url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }

  if (setting === NEVER && url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
  }

  return `${url.pathname}${url.search}${url.hash}`;
};

const applyTrailingSlashToAbsoluteUrl = (url: string, setting: number): string => {
  if (!url || setting === NO_CHANGE) return url;

  try {
    const parsed = new URL(url);

    if (setting === ALWAYS && !parsed.pathname.endsWith('/')) {
      parsed.pathname = `${parsed.pathname}/`;
    }

    if (setting === NEVER && parsed.pathname !== '/' && parsed.pathname.endsWith('/')) {
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
    trailingSlash.value = normalizeSetting(getSetting());
    return trailingSlash.value;
  };

  const resolvePathTrailingSlash = (path: string) => applyTrailingSlashToRelativePath(path, syncTrailingSlashSetting());

  const applyToUrl = (url: string) => applyTrailingSlashToAbsoluteUrl(url, syncTrailingSlashSetting());

  return {
    resolvePathTrailingSlash,
    applyToUrl,
  };
};
