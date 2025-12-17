export const isCssUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  const clean = url.split('?')[0]?.split('#')[0]?.toLowerCase();
  return clean?.endsWith('.css') ?? false;
};

export const isJsUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  const clean = url.split('?')[0]?.split('#')[0]?.toLowerCase();
  return clean?.endsWith('.js') || clean?.endsWith('.mjs');
};
