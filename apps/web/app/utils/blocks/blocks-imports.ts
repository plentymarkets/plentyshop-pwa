import type { Component } from 'vue';

type Loader = () => Promise<Component>;

const customerBlocks = import.meta.glob('/node_modules/*/runtime/components/blocks/**/*.vue', {
  import: 'default',
}) as Record<string, Loader>;

const nuxtModuleBlocks = import.meta.glob('~~/modules/*/runtime/components/blocks/**/*.vue', {
  import: 'default',
}) as Record<string, Loader>;

const coreBlocks = import.meta.glob('@/components/**/blocks/**/*.vue', { import: 'default' }) as Record<string, Loader>;

const normalize = (path: string) => {
  const pop = path.split('/').pop();
  if (pop) return pop.replace(/\.vue$/, '');
  return path;
};

export const blockLoaders: Record<string, Loader> = {};

Object.entries(coreBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));
Object.entries(nuxtModuleBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));
Object.entries(customerBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));

export const getBlockLoader = (name: string) => {
  return blockLoaders[name];
};

declare module '#app' {
  interface NuxtApp {
    _blockComponentCache?: Record<string, ReturnType<typeof defineAsyncComponent>>;
  }
}

export const getCachedBlockComponent = (name: string) => {
  const nuxtApp = useNuxtApp();
  if (!nuxtApp._blockComponentCache) {
    nuxtApp._blockComponentCache = {};
  }

  const cache = nuxtApp._blockComponentCache;
  if (cache[name]) return cache[name];

  const loader = blockLoaders[name];
  if (!loader) return null;

  const component = defineAsyncComponent({ loader });
  cache[name] = component;
  return component;
};

export const getBlockFormLoader = (name: string) => {
  return blockLoaders[name + 'Form'];
};
