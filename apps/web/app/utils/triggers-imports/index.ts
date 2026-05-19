import type { TriggerLoader } from './types';

const customerTriggers = import.meta.glob('/node_modules/*/runtime/components/**/settings/*/*ToolbarTrigger.vue', {
  import: 'default',
}) as Record<string, TriggerLoader>;

const nuxtModuleTriggers = import.meta.glob('~~/modules/*/runtime/components/**/settings/*/*ToolbarTrigger.vue', {
  import: 'default',
}) as Record<string, TriggerLoader>;

const coreTriggers = import.meta.glob('@/components/**/settings/*/*ToolbarTrigger.vue', {
  import: 'default',
}) as Record<string, TriggerLoader>;

function slug(path: string) {
  const norm = path.replace(/\\/g, '/');
  const match = norm.match(/settings\/([^/]+)\//i);
  return match?.[1]?.toLowerCase() ?? '';
}

const ordered: Record<string, TriggerLoader> = {};

Object.entries(coreTriggers).forEach(([path, loader]) => (ordered[slug(path)] = loader));
Object.entries(nuxtModuleTriggers).forEach(([path, loader]) => (ordered[slug(path)] = loader));
Object.entries(customerTriggers).forEach(([path, loader]) => (ordered[slug(path)] = loader));

export const triggersModules = Object.entries(ordered).map(([slug, loader]) => ({
  slug: slug,
  component: defineAsyncComponent(loader),
}));
