import type { BlockLoader, DefaultsModule } from './types';
import type { BlocksList } from '~/composables/useBlocksList/types';

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

const coreBlockListLoaders = import.meta.glob('@/components/**/blocks/**/defaults.ts');

const customerBlockListLoaders = import.meta.glob('/node_modules/*/runtime/components/blocks/**/defaults.ts');

const nuxtModuleBlockListLoaders = import.meta.glob('~~/modules/*/runtime/components/blocks/**/defaults.ts');

const blockListLoadersSources = [...Object.values(coreBlockListLoaders), ...Object.values(nuxtModuleBlockListLoaders), ...Object.values(customerBlockListLoaders)];


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

export const buildBlocksListFromCore = async (): Promise<BlocksList> => {
  const result: BlocksList = {};

  const mergeBlocksList = (source: BlocksList) => {
    Object.entries(source).forEach(([key, category]) => {
      if (!result[key]) {
        result[key] = category;
        return;
      }

      result[key].variations = [...result[key].variations, ...category.variations];
    });
  };

  const modules = await Promise.all(blockListLoadersSources.map((loader) => loader() as Promise<DefaultsModule>));

  modules.forEach((mod) => {
    if (mod.getBlocksList) {
      mergeBlocksList(mod.getBlocksList());
      return;
    }
  });

  return result;
};