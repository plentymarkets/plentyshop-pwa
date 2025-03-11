export const usePageSearch = async () => {
  const { pages } = await usePages();

  const flattenPages = (
    pages: { name: string; path: string; children?: unknown[] }[],
  ): { name: string; path: string }[] => {
    let flatPages: { name: string; path: string }[] = [];
    pages.forEach((page) => {
      flatPages.push({ name: page.name, path: page.path });
      if (page.children) {
        flatPages = flatPages.concat(
          flattenPages(page.children as { name: string; path: string; children?: unknown[] }[]),
        );
      }
    });
    return flatPages;
  };
  const options = ref(flattenPages(pages.value));
  const customLabel = ({ name, path }: { name: string; path: string }): string => {
    return `${name} – ${path}`;
  };

  const trimPath = (path: string): string => {
    const parts = path.split('/').filter(Boolean);

    if (parts.length >= 2) {
      return `/${parts.slice(0, -1).join('/')}/`;
    }

    return `/${parts[0] || ''}`;
  };

  return { options, customLabel, trimPath };
};
