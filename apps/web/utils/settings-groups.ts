import { type Component } from 'vue'

type Loader = () => Promise<Component>

const customer = import.meta.glob(
  '/node_modules/*/runtime/components/settings/**/*.vue',
  { import: 'default' }
) as Record<string, Loader>

const nuxtModules = import.meta.glob(
  '/modules/*/runtime/components/settings/**/*.vue',
  { import: 'default' }
) as Record<string, Loader>

const core = import.meta.glob(
  '@/components/**/settings/**/*.vue',
  { import: 'default' }
) as Record<string, Loader>

const stripPrefix = (raw: string): string => raw.replace(/^(\d+)\./, '');

const formatTitle = (folderName: string): string => {
  return folderName
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
};

const normalize = (path: string) => {
  const pop = path.split('/settings/').pop();

  if (pop) {
    return pop.replace(/\.vue$/, '')
  }
  return path;
}

const modules: Record<string, Loader> = {}

Object.entries(core).forEach(([path, loader]) => (modules[normalize(path)] = loader))
Object.entries(nuxtModules).forEach(([path, loader]) => (modules[normalize(path)] = loader))
Object.entries(customer).forEach(([path, loader]) => (modules[normalize(path)] = loader))

export const getSettingsGroups = (activeSetting: string) => {
  const prefix = `${activeSetting}/`;
  const map: Record<string, { title: string; components: unknown[]; slug: string }> = {};

  for (const [path, loader] of Object.entries(modules)) {
    if (!path.includes(prefix)) continue;

    const afterPrefix = path.split(prefix)[1];
    if (!afterPrefix) continue;

    const segments = afterPrefix.split('/');
    if (segments.length < 2) continue;

    const groupSlug = stripPrefix(segments[0]);

    if (!map[groupSlug]) {
      map[groupSlug] = {
        title: formatTitle(groupSlug),
        slug: groupSlug,
        components: [],
      };
    }

    map[groupSlug].components.push(defineAsyncComponent(loader));
  }

  return Object.values(map);
}

export const getViewComponent = (activeSetting: string) => {
  const key = Object.keys(modules).find(
    (path) => path.includes(`${activeSetting}/`) && path.endsWith('View'),
  );

  return key ? defineAsyncComponent(modules[key]) : null;
}
