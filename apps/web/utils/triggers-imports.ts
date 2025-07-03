import type { Component } from 'vue';

type Loader = () => Promise<Component>;

const customerTriggers = import.meta.glob('/node_modules/*/runtime/components/**/settings/*/*ToolbarTrigger.vue', {
  import: 'default',
}) as Record<string, Loader>;

const nuxtModuleTriggers = import.meta.glob('/modules/*/runtime/components/**/settings/*/*ToolbarTrigger.vue', {
  import: 'default',
}) as Record<string, Loader>;

const coreTriggers = import.meta.glob('@/components/**/settings/*/*ToolbarTrigger.vue', {
  import: 'default',
}) as Record<string, Loader>;

function slug(path: string) {
  const norm = path.replace(/\\/g, '/');
  const match = norm.match(/settings\/([^/]+)\//i);
  return match ? match[1].toLowerCase() : '';
}

const ordered: Record<string, Loader> = {};

Object.entries(coreTriggers).forEach(([path, loader]) => (ordered[slug(path)] = loader));
Object.entries(nuxtModuleTriggers).forEach(([path, loader]) => (ordered[slug(path)] = loader));
Object.entries(customerTriggers).forEach(([path, loader]) => (ordered[slug(path)] = loader));

export const triggersModules = Object.entries(ordered).map(([slug, loader]) => ({
  slug: slug,
  component: defineAsyncComponent(loader),
}));
