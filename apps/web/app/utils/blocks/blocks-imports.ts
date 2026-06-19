import type { BlockLoader, DefaultsModule } from './types';

const customerBlocks = import.meta.glob('/node_modules/*/runtime/components/blocks/**/*.vue', {
  import: 'default',
}) as Record<string, BlockLoader>;

const nuxtModuleBlocks = import.meta.glob('~~/modules/*/runtime/components/blocks/**/*.vue', {
  import: 'default',
}) as Record<string, BlockLoader>;

const coreBlocks = import.meta.glob('@/components/**/blocks/**/*.vue', { import: 'default' }) as Record<
  string,
  BlockLoader
>;


const coreBlockList = import.meta.glob('@/components/**/blocks/**/defaults.ts', { eager: true });

const normalize = (path: string) => {
  const pop = path.split('/').pop();
  if (pop) return pop.replace(/\.vue$/, '');
  return path;
};

export const blockLoaders: Record<string, BlockLoader> = {};

Object.entries(coreBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));
Object.entries(nuxtModuleBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));
Object.entries(customerBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));

export const getBlockLoader = (name: string) => {
  return blockLoaders[name];
};

const asyncComponentCache: Record<string, ReturnType<typeof defineAsyncComponent>> = {};

export const getCachedBlockComponent = (name: string) => {
  if (asyncComponentCache[name]) return asyncComponentCache[name];

  const loader = blockLoaders[name];
  if (!loader) return null;

  const component = defineAsyncComponent({ loader });
  asyncComponentCache[name] = component;
  return component;
};

export const getBlockFormLoader = (name: string) => {
  return blockLoaders[name + 'Form'];
};

export const buildBlocksListFromCore = (): BlocksList => {
  const modules = Object.values(coreBlockList) as DefaultsModule[];

  const explicitCategories = modules
    .map((mod) => mod.blocksListCategory)
    .filter((category): category is NonNullable<DefaultsModule['blocksListCategory']> => !!category);

  const listFromCategories = explicitCategories.reduce<BlocksList>((acc, category) => {
    const existing = acc[category.category];
    if (existing) {
      existing.variations = [...existing.variations, ...category.variations];
      return acc;
    }

    acc[category.category] = category;
    return acc;
  }, {});

  const blocks = modules.flatMap((mod) => {
    if (mod.BlocksList) return mod.BlocksList();
    if (mod.createDefault) return [mod.createDefault()];
    return [];
  });

  return blocks.reduce<BlocksList>((acc, block) => {
    const key = block.name;

    const variation = {
      image: '',
      title: key,
      template: {
        en: deepClone(block),
        de: deepClone(block),
      },
    };

    if (acc[key]) {
      acc[key].variations.push(variation);
    } else {
      acc[key] = {
        title: key,
        blockName: key,
        category: key,
        variations: [variation],
      };
    }

    return acc;
  }, listFromCategories);
};