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

  if (pop) {
    return pop.replace(/\.vue$/, '');
  }
  return path;
};

export const blockLoaders: Record<string, Loader> = {};

for (const [path, loader] of Object.entries(coreBlocks)) {
  blockLoaders[normalize(path)] = loader;
}
for (const [path, loader] of Object.entries(nuxtModuleBlocks)) {
  blockLoaders[normalize(path)] = loader;
}
for (const [path, loader] of Object.entries(customerBlocks)) {
  blockLoaders[normalize(path)] = loader;
}

export const getBlockLoader = (name: string) => {
  return blockLoaders[name];
};

// Pre-create async component wrappers for all blocks to avoid recreating them on every render
const asyncBlockComponents: Record<string, ReturnType<typeof defineAsyncComponent>> = {};

for (const [name, loader] of Object.entries(blockLoaders)) {
  asyncBlockComponents[name] = defineAsyncComponent({ loader });
}

/**
 * Get a cached async component for a block by name.
 * Components are pre-created at module initialization to avoid performance overhead
 * of creating new async component wrappers on every render.
 *
 * @param name - The block name (e.g., 'Banner', 'Footer', 'ProductRecommendedProducts')
 * @returns The cached async component or null if not found
 */
export const getAsyncBlockComponent = (name: string): ReturnType<typeof defineAsyncComponent> | null => {
  return asyncBlockComponents[name] || null;
};
