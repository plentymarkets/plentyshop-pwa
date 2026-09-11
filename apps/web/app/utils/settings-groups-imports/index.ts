import type { SettingsGroupLoader } from './types';

// TODO: see if we can use https://github.com/nuxt/nuxt/releases/tag/v3.19.0 to replace the import.meta.glob

const customer = import.meta.glob('/node_modules/*/runtime/components/settings/**/*.vue', {
  import: 'default',
}) as Record<string, SettingsGroupLoader>;

// Packages hoisted to the monorepo root node_modules (npm workspaces)
const workspaceCustomer = import.meta.glob('../../../../../node_modules/*/runtime/components/settings/**/*.vue', {
  import: 'default',
}) as Record<string, SettingsGroupLoader>;

const nuxtModules = import.meta.glob('~~/modules/*/runtime/components/settings/**/*.vue', {
  import: 'default',
}) as Record<string, SettingsGroupLoader>;

const core = import.meta.glob('@/components/**/settings/**/*.vue', { import: 'default' }) as Record<
  string,
  SettingsGroupLoader
>;

const extensionIdFromPath = (path: string): string | undefined => {
  return path.match(/node_modules\/(.+?)\/runtime\//)?.[1] ?? path.match(/modules\/(.+?)\/runtime\//)?.[1];
};

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
const entryExtensionIds: Record<string, string | undefined> = {};

Object.entries(core).forEach(([path, loader]) => (modules[normalize(path)] = loader));

Object.entries(nuxtModules).forEach(([path, loader]) => {
  const key = normalize(path);
  modules[key] = loader;
  entryExtensionIds[key] = extensionIdFromPath(path);
});

Object.entries(customer).forEach(([path, loader]) => {
  const key = normalize(path);
  modules[key] = loader;
  entryExtensionIds[key] = extensionIdFromPath(path);
});

Object.entries(workspaceCustomer).forEach(([path, loader]) => {
  const key = normalize(path);
  modules[key] = loader;
  entryExtensionIds[key] = extensionIdFromPath(path);
});

const isDisabled = (key: string): boolean => {
  const extId = entryExtensionIds[key];
  if (!extId) return false;
  const featureFlags = useState<Record<string, boolean>>('feature-flags', () => ({}));
  return featureFlags.value[`extension.${extId}.enabled`] === false;
};

export const getSettingsGroups = (activeSetting: string, subCategory: string = '') => {
  const prefix = subCategory ? `${activeSetting}/${subCategory}/` : `${activeSetting}/`;
  const map: Record<string, { title: string; components: unknown[]; slug: string }> = {};

  for (const [path, loader] of Object.entries(modules)) {
    if (!path.includes(prefix)) continue;
    if (isDisabled(path)) continue;

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
    if (isDisabled(path)) return;

    const remainder = path.slice(prefix.length);

    const [first] = remainder.split('/');

    if (first === 'View' || first === 'ToolbarTrigger') return;

    set.add(stripPrefix(first ?? ''));
  });

  return [...set];
};

export const getViewComponent = (activeSetting: string, subCategory = '') => {
  const key = Object.keys(modules).find(
    (path) =>
      !isDisabled(path) && path.includes(`${activeSetting}/${subCategory}`) && path.endsWith('View'),
  );

  return key ? defineAsyncComponent(modules[key] ?? (() => Promise.resolve({}))) : null;
};
