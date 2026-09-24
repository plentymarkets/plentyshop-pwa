import type { TriggerLoader } from './types';

const customerTriggers = import.meta.glob('/node_modules/*/runtime/components/**/settings/*/*ToolbarTrigger.vue', {
  import: 'default',
}) as Record<string, TriggerLoader>;

// Packages hoisted to the monorepo root node_modules (npm workspaces)
const workspaceCustomerTriggers = import.meta.glob(
  '../../../../../node_modules/*/runtime/components/**/settings/*/*ToolbarTrigger.vue',
  { import: 'default' },
) as Record<string, TriggerLoader>;

const nuxtModuleTriggers = import.meta.glob('~~/modules/*/runtime/components/**/settings/*/*ToolbarTrigger.vue', {
  import: 'default',
}) as Record<string, TriggerLoader>;

const coreTriggers = import.meta.glob('@/components/**/settings/*/*ToolbarTrigger.vue', {
  import: 'default',
}) as Record<string, TriggerLoader>;

const extensionIdFromPath = (path: string): string | undefined => {
  return path.match(/node_modules\/(.+?)\/runtime\//)?.[1] ?? path.match(/modules\/(.+?)\/runtime\//)?.[1];
};

function slug(path: string) {
  const norm = path.replace(/\\/g, '/');
  const match = norm.match(/settings\/([^/]+)\//i);
  return match?.[1]?.toLowerCase() ?? '';
}

const ordered: Record<string, TriggerLoader> = {};
const slugToExtId: Record<string, string | undefined> = {};

Object.entries(coreTriggers).forEach(([path, loader]) => (ordered[slug(path)] = loader));

Object.entries(nuxtModuleTriggers).forEach(([path, loader]) => {
  const s = slug(path);
  ordered[s] = loader;
  slugToExtId[s] = extensionIdFromPath(path);
});

Object.entries(customerTriggers).forEach(([path, loader]) => {
  const s = slug(path);
  ordered[s] = loader;
  slugToExtId[s] = extensionIdFromPath(path);
});

Object.entries(workspaceCustomerTriggers).forEach(([path, loader]) => {
  const s = slug(path);
  ordered[s] = loader;
  slugToExtId[s] = extensionIdFromPath(path);
});

export const getTriggersModules = () => {
  const featureFlags = useState<Record<string, boolean>>('feature-flags', () => ({}));
  return Object.entries(ordered)
    .filter(([s]) => {
      const extId = slugToExtId[s];
      if (!extId) return true;
      return featureFlags.value[`extension.${extId}.enabled`] !== false;
    })
    .map(([s, loader]) => ({ slug: s, component: defineAsyncComponent(loader) }));
};
