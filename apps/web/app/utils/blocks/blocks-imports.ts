import type { BlockLoader, DefaultsModule } from './types';

const customerBlocks = import.meta.glob('/node_modules/*/runtime/components/blocks/**/*.vue', {
  import: 'default',
}) as Record<string, BlockLoader>;

// Packages hoisted to the monorepo root node_modules (npm workspaces)
const workspaceCustomerBlocks = import.meta.glob('../../../../../node_modules/*/runtime/components/blocks/**/*.vue', {
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

// Packages hoisted to the monorepo root node_modules (npm workspaces)
const workspaceCustomerBlockListLoaders = import.meta.glob(
  '../../../../../node_modules/*/runtime/components/blocks/**/defaults.ts',
);

const nuxtModuleBlockListLoaders = import.meta.glob('~~/modules/*/runtime/components/blocks/**/defaults.ts');

const allBlockListLoaders: Record<string, () => Promise<unknown>> = {
  ...coreBlockListLoaders,
  ...nuxtModuleBlockListLoaders,
  ...customerBlockListLoaders,
  ...workspaceCustomerBlockListLoaders,
};

const normalize = (path: string) => {
  const pop = path.split('/').pop();
  if (pop) return pop.replace(/\.vue$/, '');
  return path;
};

const extensionIdFromPath = (path: string): string | undefined => {
  const match = path.match(/node_modules\/(.+?)\/runtime\//);
  if (match) return match[1];
  const moduleMatch = path.match(/modules\/(.+?)\/runtime\//);
  if (moduleMatch) return moduleMatch[1];
  return undefined;
};

export const blockLoaders: Record<string, BlockLoader> = {};
export const blockExtensionIds: Record<string, string> = {};

Object.entries(coreBlocks).forEach(([path, loader]) => (blockLoaders[normalize(path)] = loader));

Object.entries(nuxtModuleBlocks).forEach(([path, loader]) => {
  const name = normalize(path);
  blockLoaders[name] = loader;
  const extId = extensionIdFromPath(path);
  if (extId) blockExtensionIds[name] = extId;
});

Object.entries(customerBlocks).forEach(([path, loader]) => {
  const name = normalize(path);
  blockLoaders[name] = loader;
  const extId = extensionIdFromPath(path);
  if (extId) blockExtensionIds[name] = extId;
});

Object.entries(workspaceCustomerBlocks).forEach(([path, loader]) => {
  const name = normalize(path);
  blockLoaders[name] = loader;
  const extId = extensionIdFromPath(path);
  if (extId) blockExtensionIds[name] = extId;
});

export const getBlockLoader = (name: string) => {
  return blockLoaders[name];
};

const asyncComponentCache: Record<string, ReturnType<typeof defineAsyncComponent>> = {};

export const getCachedBlockComponent = (name: string) => {
  const extId = blockExtensionIds[name];
  if (extId) {
    const featureFlags = useState<Record<string, boolean>>('feature-flags', () => ({}));
    if (featureFlags.value[`extension.${extId}.enabled`] === false) {
      return null;
    }
  }

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
  const featureFlags = useState<Record<string, boolean>>('feature-flags', () => ({}));

  const isDisabled = (path: string): boolean => {
    const extId = extensionIdFromPath(path);
    if (!extId) return false;
    const key = `extension.${extId}.enabled`;
    return key in featureFlags.value && featureFlags.value[key] === false;
  };

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

  const entries = Object.entries(allBlockListLoaders).filter(([path]) => !isDisabled(path));
  const modules = await Promise.all(entries.map(([, loader]) => loader() as Promise<DefaultsModule>));

  modules.forEach((mod) => {
    if (mod.getBlocksList) {
      mergeBlocksList(mod.getBlocksList());
      return;
    }
  });

  return Object.fromEntries(Object.entries(result).filter(([, cat]) => cat.variations.length > 0));
};
