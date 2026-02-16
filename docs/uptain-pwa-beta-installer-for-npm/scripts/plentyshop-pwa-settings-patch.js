/**
 * Postinstall: Patches Plentyshop-PWA settings discovery so that npm modules
 * in workspace root node_modules (e.g. uptain-pwa-beta) are included in the
 * Settings drawer (SEO → Tracking & analytics). Idempotent and safe to re-run.
 *
 * @see https://github.com/plentymarkets/plentyshop-pwa
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');

function findHostUtilsDir() {
  // When installed: .../node_modules/uptain-pwa-beta/scripts/this-file.js → host root = ../..
  const hostRoot = resolve(packageRoot, '..', '..');
  const pkgPath = join(hostRoot, 'package.json');
  if (!existsSync(pkgPath)) return null;
  let name = '';
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    name = pkg.name || '';
  } catch {
    return null;
  }
  const isPlentyshop = /plentyshop-pwa|plentyone/i.test(name);
  const utilsMonorepo = join(hostRoot, 'apps', 'web', 'app', 'utils');
  const utilsFlat = join(hostRoot, 'app', 'utils');
  if (isPlentyshop && existsSync(utilsMonorepo)) return utilsMonorepo;
  if (isPlentyshop && existsSync(utilsFlat)) return utilsFlat;
  return null;
}

const SNIPPET_GROUPS = {
  before: `const customer = import.meta.glob('/node_modules/*/runtime/components/settings/**/*.vue', {
  import: 'default',
}) as Record<string, Loader>;

const nuxtModules`,
  after: `const customer = import.meta.glob('/node_modules/*/runtime/components/settings/**/*.vue', {
  import: 'default',
}) as Record<string, Loader>;

const customerWorkspaceRoot = import.meta.glob('../../../../node_modules/*/runtime/components/settings/**/*.vue', {
  import: 'default',
}) as Record<string, Loader>;

const nuxtModules`,
};

const SNIPPET_GROUPS_MERGE = {
  before: `Object.entries(customer).forEach(([path, loader]) => (modules[normalize(path)] = loader));
Object.entries(nuxtModules)`,
  after: `Object.entries(customer).forEach(([path, loader]) => (modules[normalize(path)] = loader));
Object.entries(customerWorkspaceRoot).forEach(([path, loader]) => (modules[normalize(path)] = loader));
Object.entries(nuxtModules)`,
};

const SNIPPET_TRANSLATIONS = {
  before: `const localeFilesCustomer = import.meta.glob('/node_modules/*/runtime/components/settings/**/lang.json', {
  eager: true,
  import: 'default',
}) as Messages;
const localeFilesNuxtModules`,
  after: `const localeFilesCustomer = import.meta.glob('/node_modules/*/runtime/components/settings/**/lang.json', {
  eager: true,
  import: 'default',
}) as Messages;
const localeFilesCustomerWorkspaceRoot = import.meta.glob('../../../../node_modules/*/runtime/components/settings/**/lang.json', {
  eager: true,
  import: 'default',
}) as Messages;
const localeFilesNuxtModules`,
};

const SNIPPET_TRANSLATIONS_MERGE = {
  before: `Object.entries(localeFilesCustomer).forEach(([path, loader]) => (localeFiles[normalize(path)] = loader));
Object.entries(localeFilesNuxtModules)`,
  after: `Object.entries(localeFilesCustomer).forEach(([path, loader]) => (localeFiles[normalize(path)] = loader));
Object.entries(localeFilesCustomerWorkspaceRoot).forEach(([path, loader]) => (localeFiles[normalize(path)] = loader));
Object.entries(localeFilesNuxtModules)`,
};

const SNIPPET_TRIGGERS = {
  before: `const customerTriggers = import.meta.glob('/node_modules/*/runtime/components/**/settings/*/*ToolbarTrigger.vue', {
  import: 'default',
}) as Record<string, Loader>;

const nuxtModuleTriggers`,
  after: `const customerTriggers = import.meta.glob('/node_modules/*/runtime/components/**/settings/*/*ToolbarTrigger.vue', {
  import: 'default',
}) as Record<string, Loader>;

const customerWorkspaceRootTriggers = import.meta.glob(
  '../../../../node_modules/*/runtime/components/**/settings/*/*ToolbarTrigger.vue',
  {
    import: 'default',
  },
) as Record<string, Loader>;

const nuxtModuleTriggers`,
};

const SNIPPET_TRIGGERS_MERGE = {
  before: `Object.entries(customerTriggers).forEach(([path, loader]) => (ordered[slug(path)] = loader));
Object.entries(nuxtModuleTriggers)`,
  after: `Object.entries(customerTriggers).forEach(([path, loader]) => (ordered[slug(path)] = loader));
Object.entries(customerWorkspaceRootTriggers).forEach(([path, loader]) => (ordered[slug(path)] = loader));
Object.entries(nuxtModuleTriggers)`,
};

function patchFile(filePath, patches) {
  if (!existsSync(filePath)) return false;
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('customerWorkspaceRoot') || content.includes('customerWorkspaceRootTriggers') || content.includes('localeFilesCustomerWorkspaceRoot')) {
    return false; // already patched
  }
  let changed = false;
  for (const { before, after } of patches) {
    if (content.includes(before) && !content.includes(after)) {
      content = content.replace(before, after);
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(filePath, content);
    return true;
  }
  return false;
}

function main() {
  const utilsDir = findHostUtilsDir();
  if (!utilsDir) return;

  const files = [
    {
      path: join(utilsDir, 'settings-groups-imports.ts'),
      patches: [SNIPPET_GROUPS, SNIPPET_GROUPS_MERGE],
    },
    {
      path: join(utilsDir, 'settings-translations-imports.ts'),
      patches: [SNIPPET_TRANSLATIONS, SNIPPET_TRANSLATIONS_MERGE],
    },
    {
      path: join(utilsDir, 'triggers-imports.ts'),
      patches: [SNIPPET_TRIGGERS, SNIPPET_TRIGGERS_MERGE],
    },
  ];

  let any = false;
  for (const { path: filePath, patches } of files) {
    if (patchFile(filePath, patches)) {
      console.log('[uptain-pwa-beta] Patched:', filePath);
      any = true;
    }
  }
  if (any) {
    console.log('[uptain-pwa-beta] Settings drawer will show Uptain config under SEO → Tracking & analytics.');
  }
}

main();
