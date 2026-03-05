import type { Component } from 'vue';

type Loader = () => Promise<Component>;
type IconLoader = () => Promise<string>;

const customerBlocks = import.meta.glob('/node_modules/*/runtime/components/blocks/**/*.vue', {
  import: 'default',
}) as Record<string, Loader>;

const nuxtModuleBlocks = import.meta.glob('~~/modules/*/runtime/components/blocks/**/*.vue', {
  import: 'default',
}) as Record<string, Loader>;

const coreBlocks = import.meta.glob('@/components/**/blocks/**/*.vue', { import: 'default' }) as Record<string, Loader>;

const blockIcons = import.meta.glob('@/components/**/blocks/**/*icon.svg', {
  query: '?raw',
  import: 'default',
}) as Record<string, IconLoader>;

const normalize = (path: string) => {
  const pop = path.split('/').pop();
  if (pop) return pop.replace(/\.vue$/, '');
  return path;
};

const normalizeIconPath = (path: string) => {
  const match = path.match(/blocks\/(?:structure\/)?([^/]+)\/[^/]*icon\.svg/);
  return match ? match[1] : '';
};

export const blockLoaders: Record<string, Loader> = {};
export const blockIconsLoaders: Record<string, string> = {};

Object.entries(coreBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));
Object.entries(nuxtModuleBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));
Object.entries(customerBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));

Object.entries(blockIcons).forEach(([path, loader]) => {
  const blockName = normalizeIconPath(path);
  if (blockName) {
    loader().then((svg) => {
      blockIconsLoaders[blockName] = svg;
    });
  }
});

export const getBlockLoader = (name: string) => {
  return blockLoaders[name];
};

export const getBlockIconSvg = (name: string): string | null => {
  return blockIconsLoaders[name] ?? null;
};
