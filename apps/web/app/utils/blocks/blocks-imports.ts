import type { BlockLoader, DefaultsModule } from './types';
import type { Block } from '@plentymarkets/shop-api';
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
  const result: BlocksList = {};

  const mergeBlocksList = (source: BlocksList) => {
    Object.entries(source).forEach(([categoryKey, category]) => {
      if (result[categoryKey]) {
        result[categoryKey].variations = [...result[categoryKey].variations, ...category.variations];
        return;
      }

      result[categoryKey] = category;
    });
  };

  modules.forEach((mod) => {
    if (mod.getBlocksList) {
      mergeBlocksList(mod.getBlocksList());
    }
    if (mod.createDefault) return [mod.createDefault()];
  });

  modules.forEach((mod) => {
    if (mod.getBlocksList || !mod.createDefault) return;

    const block = mod.createDefault() as Block;
    const key = block.name;
    const variation = {
      image: '',
      title: key,
      template: {
        en: deepClone(block),
        de: deepClone(block),
      },
    };

    if (result[key]) {
      result[key].variations.push(variation);
      return;
    }

    result[key] = {
      title: key,
      blockName: key,
      category: key,
      variations: [variation],
    };
  });

  return result;
};