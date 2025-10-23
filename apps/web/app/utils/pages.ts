export const flattenPages = (
  pages: { name: string; path: string; id: number; children?: unknown[]; right?: string; type?: string }[],
  skipsFilters = true,
): { name: string; path: string; id: string; right?: string; type?: string }[] => {
  return pages.reduce<{ name: string; path: string; id: string; right?: string; type?: string }[]>((acc, page) => {
    const passesFilters = skipsFilters || (page.right !== 'customer' && page.type === 'item');

    if (passesFilters) {
      acc.push({ name: page.name, path: page.path, id: page.id.toString(), right: page.right, type: page.type });
    }

    if (page.children) {
      acc.push(
        ...flattenPages(
          page.children as {
            name: string;
            path: string;
            id: number;
            children?: unknown[];
            right?: string;
            type?: string;
          }[],
          skipsFilters,
        ),
      );
    }
    return acc;
  }, []);
};
