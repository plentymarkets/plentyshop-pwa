import type { SettingsGroupLoader } from './types';

// TODO: see if we can use https://github.com/nuxt/nuxt/releases/tag/v3.19.0 to replace the import.meta.glob

const customerRoot = import.meta.glob('/node_modules/*/runtime/components/settings/**/*.vue', { import: 'default' });

const customerWorkspace = import.meta.glob(
  '@workspace/node_modules/{*,@*/*}/{,*/}runtime/components/settings/**/*.vue',
  { import: 'default' },
);

const customer = { ...customerRoot, ...customerWorkspace } as Record<string, SettingsGroupLoader>;

const nuxtModules = import.meta.glob('~~/modules/*/runtime/components/settings/**/*.vue', {
  import: 'default',
}) as Record<string, SettingsGroupLoader>;

const core = import.meta.glob('@/components/**/settings/**/*.vue', { import: 'default' }) as Record<
  string,
  SettingsGroupLoader
>;

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
    return pop.replace(/\.vue$/, '');
  }
  return path;
};

const modules: Record<string, SettingsGroupLoader> = {};

const registerModules = (entries: Record<string, SettingsGroupLoader>) => {
  Object.entries(entries).forEach(([path, loader]) => {
    if (isSettingsPathAuthorized(path)) {
      modules[normalize(path)] = loader;
    }
  });
};

registerModules(core);
registerModules(nuxtModules);
registerModules(customer);

export const getSettingsGroups = (activeSetting: string, subCategory: string = '') => {
  const prefix = subCategory ? `${activeSetting}/${subCategory}/` : `${activeSetting}/`;
  const map: Record<string, { title: string; components: unknown[]; slug: string }> = {};

  for (const [path, loader] of Object.entries(modules)) {
    if (!path.includes(prefix)) continue;

    const afterPrefix = path.split(prefix)[1];
    if (!afterPrefix) continue;

    const segments = afterPrefix.split('/');
    if (segments.length < 2) continue;

    const groupSlug = stripPrefix(segments[0] ?? '');

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
};

export const getSubCategories = (activeSetting: string): string[] => {
  const prefix = `${activeSetting}/`;
  const set = new Set<string>();

  Object.keys(modules).forEach((path) => {
    if (!path.startsWith(prefix)) return;

    const remainder = path.slice(prefix.length);

    const [first] = remainder.split('/');

    if (first === 'View' || first === 'ToolbarTrigger') return;

    set.add(stripPrefix(first ?? ''));
  });

  return [...set];
};

export const getViewComponent = (activeSetting: string, subCategory = '') => {
  const key = Object.keys(modules).find(
    (path) => path.includes(`${activeSetting}/${subCategory}`) && path.endsWith('View'),
  );

  return key ? defineAsyncComponent(modules[key] ?? (() => Promise.resolve({}))) : null;
};
