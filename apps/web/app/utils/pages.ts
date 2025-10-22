export const flattenPages = (
  pages: { name: string; path: string; id: number; children?: unknown[] }[],
): { name: string; path: string, id: string }[] => {
  return pages.reduce<{ name: string; path: string, id: string }[]>((acc, page) => {

    acc.push({ name: page.name, path: page.path, id: page.id.toString() });
    if (page.children) {
      acc.push(...flattenPages(page.children as { name: string; path: string; id: number; children?: unknown[] }[]));
    }
    return acc;
  }, []);
};
