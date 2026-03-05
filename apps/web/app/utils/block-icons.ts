const blockIconLoaders = import.meta.glob(
  '@/components/**/blocks/**/icon.svg',
  {
    query: '?raw',
    import: 'default',
  },
) as Record<string, () => Promise<string>>;

const normalizeIconPath = (path: string): string => {
  const match = path.match(/blocks\/(?:structure\/)?([^/]+)\/[^/]*icon\.svg/);
  return match?.[1] ?? '';
};

const blockIcons = new Map<string, string>();

const initializeIcons = async () => {
  const promises = Object.entries(blockIconLoaders).map(async ([path, loader]) => {
    const blockName = normalizeIconPath(path);
    if (blockName) {
      try {
        const svg = await loader();
        blockIcons.set(blockName, svg);
      } catch (error) {
        console.warn(`Failed to load icon for block "${blockName}":`, error);
      }
    }
  });
  await Promise.all(promises);
};

initializeIcons().catch((error) => {
  console.warn('Failed to initialize block icons:', error);
});

export const getBlockIconSvg = (blockName: string): string | null => {
  return blockIcons.get(blockName) ?? null;
};




