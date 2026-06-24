import type { BlockLoader, DefaultsModule } from './types';
import type { BlocksList, BlockTemplateVariation } from '~/composables/useBlocksList/types';

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

const blockListLoadersSources = [
  ...Object.values(coreBlockListLoaders),
  ...Object.values(nuxtModuleBlockListLoaders),
  ...Object.values(customerBlockListLoaders),
];

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

export const resolveBlocksList = async (): Promise<BlocksList> => {
  const result: BlocksList = {};
  const overriddenBlocks = new Set<string>();

  const nameOf = (variation: BlockTemplateVariation) =>
    variation.template?.en?.name ?? variation.template?.de?.name ?? '';

  const mergeBlocksList = (source: BlocksList) => {
    Object.entries(source).forEach(([key, category]) => {
      const target = result[key] ?? (result[key] = { ...category, variations: [] });

      if (category.override) {
        const names = category.variations.map(nameOf);
        names.forEach((name) => overriddenBlocks.add(name));

        Object.values(result).forEach((cat) => {
          cat.variations = cat.variations.filter((v) => !names.includes(nameOf(v)));
        });

        target.variations.push(...category.variations);
      } else {
        target.variations.push(...category.variations.filter((v) => !overriddenBlocks.has(nameOf(v))));
      }
    });
  };

  const modules = await Promise.all(blockListLoadersSources.map((loader) => loader() as Promise<DefaultsModule>));

  modules.forEach((mod) => {
    if (mod.getBlocksList) {
      mergeBlocksList(mod.getBlocksList());
      return;
    }
  });

  return Object.fromEntries(Object.entries(result).filter(([, cat]) => cat.variations.length > 0));
};
