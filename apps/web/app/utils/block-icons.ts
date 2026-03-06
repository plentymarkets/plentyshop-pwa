const blockIconLoaders = import.meta.glob('@/components/**/blocks/**/icon.svg', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

const normalizeIconPath = (path: string): string => {
  const match = path.match(/blocks\/(?:structure\/)?([^/]+)\/[^/]*icon\.svg/);
  return match?.[1] ?? '';
};

const blockIcons: Record<string, string> = reactive({});

Object.entries(blockIconLoaders).forEach(([path, loader]) => {
  const blockName = normalizeIconPath(path);
  if (blockName) {
    loader()
      .then((svg) => {
        blockIcons[blockName] = svg;
      })
      .catch((error) => {
        console.warn(`Failed to load icon for block "${blockName}":`, error);
      });
  }
});

export const getBlockIconSvg = (blockName: string): string | null => {
  return blockIcons[blockName] ?? null;
};
