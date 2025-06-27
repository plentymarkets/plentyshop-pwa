import type { Component } from 'vue';

type Loader = () => Promise<Component>;

const customerBlocks = import.meta.glob('/node_modules/*/runtime/components/blocks/**/*.vue', {
  import: 'default',
}) as Record<string, Loader>;

const nuxtModuleBlocks = import.meta.glob('/modules/*/runtime/components/blocks/**/*.vue', {
  import: 'default',
}) as Record<string, Loader>;

const coreBlocks = import.meta.glob('@/components/**/blocks/**/*.vue', { import: 'default' }) as Record<string, Loader>;

const normalize = (path: string) => {
  const pop = path.split('/').pop();

  if (pop) {
    return pop.replace(/\.vue$/, '');
  }
  return path;
};

export const blockLoaders: Record<string, Loader> = {};

Object.entries(coreBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));
Object.entries(nuxtModuleBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));
Object.entries(customerBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));

export const getBlockLoader = (name: string) => {
  return blockLoaders[name];
};
