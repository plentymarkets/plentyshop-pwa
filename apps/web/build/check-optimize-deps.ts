import { readFileSync, existsSync, readdirSync, statSync, lstatSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { thirdPartyDeps, localPackageDeps } from '../app/configuration/optimize-deps.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const allOptimizeDeps = [...thirdPartyDeps, ...localPackageDeps];
const APP_ROOT = resolve(__dirname, '..');
const require = createRequire(join(APP_ROOT, 'package.json'));
const SOURCE_DIRS = ['app'];
const SOURCE_EXTENSIONS = ['.ts', '.vue'];
const BLOCK_COMMENT_RE = /\/\*[\s\S]*?\*\//g;
const LINE_COMMENT_RE = /\/\/[^\n]*/g;
const TYPE_IMPORT_RE = /^\s*import\s+type\s+/;
const FROM_IMPORT_RE = /from\s+['"]([^'"]+)['"]/g;
const DYNAMIC_IMPORT_RE = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
const SIDE_EFFECT_IMPORT_RE = /^\s*import\s+['"]([^'"]+)['"]/gm;
const SKIP_PREFIXES = ['@nuxt/', '@nuxtjs/', '#', '~', '@/', 'node:', '/'];

/**
 * Packages imported in the app that should never be in 'optimizeDeps.include'.
 * Vue/Nuxt internals are handled automatically; build/dev-only tools (eslint, sass, etc.) don't need pre-bundling.
 * Add entries here when a framework-level import causes a false positive.
 */
const SKIP_PACKAGES = new Set([
  'vue',
  'vue-router',
  'vue-i18n',
  'nuxt',
  'pinia',
  '@vue/runtime-core',
  '@vue/runtime-dom',
  '@vue/reactivity',
  '@vue/shared',
  '@vue/compiler-core',
  '@vue/compiler-dom',
  '@vue/compiler-sfc',
  '@vue/server-renderer',
  '@vue/test-utils',
  '@nuxt/test-utils',
  '@nuxtjs/i18n',
  '@nuxt/eslint',
  '@nuxt/fonts',
  '@nuxt/image',
  '@storefront-ui/typography',
  '@vue-storefront/unified-data-model',
  'vee-validate',
  'vuetify',
  'vitest',
  'rollup',
  'tailwindcss',
  'sass',
  'typescript',
  'eslint',
  'nuxt-security',
]);

const SKIP_BUILTINS = new Set([
  'fs',
  'path',
  'os',
  'url',
  'crypto',
  'stream',
  'http',
  'https',
  'net',
  'events',
  'util',
  'buffer',
  'child_process',
  'worker_threads',
  'module',
  'assert',
  'timers',
  'perf_hooks',
  'process',
]);

export const extractImports = (content: string): string[] => {
  const stripped = content.replace(BLOCK_COMMENT_RE, '').replace(LINE_COMMENT_RE, '');
  const imports: string[] = [];
  const lines = stripped.split('\n');

  for (const line of lines) {
    if (TYPE_IMPORT_RE.test(line)) continue;

    let match: RegExpExecArray | null;

    FROM_IMPORT_RE.lastIndex = 0;
    while ((match = FROM_IMPORT_RE.exec(line)) !== null) {
      if (match[1]) imports.push(match[1]);
    }
  }

  let match: RegExpExecArray | null;

  DYNAMIC_IMPORT_RE.lastIndex = 0;
  while ((match = DYNAMIC_IMPORT_RE.exec(stripped)) !== null) {
    if (match[1]) imports.push(match[1]);
  }

  SIDE_EFFECT_IMPORT_RE.lastIndex = 0;
  while ((match = SIDE_EFFECT_IMPORT_RE.exec(stripped)) !== null) {
    if (match[1]) imports.push(match[1]);
  }

  return imports;
};

export const getPackageName = (importPath: string): string => {
  if (importPath.startsWith('@')) {
    const parts = importPath.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : importPath;
  }

  return importPath.split('/')[0] ?? importPath;
};

export const shouldSkip = (importPath: string): boolean => {
  if (importPath.startsWith('.')) return true;
  if (/\.(css|scss|sass|less|styl)$/.test(importPath)) return true;

  for (const prefix of SKIP_PREFIXES) {
    if (importPath.startsWith(prefix)) return true;
  }

  const pkgName = getPackageName(importPath);
  if (SKIP_PACKAGES.has(pkgName)) return true;
  if (SKIP_BUILTINS.has(importPath)) return true;

  return false;
};

export const isCovered = (importPath: string, includeList: string[]): boolean => {
  return includeList.includes(importPath);
};

const findSourceFiles = (dir: string, exts: string[]): string[] => {
  const results: string[] = [];

  const walk = (current: string): void => {
    let entries: string[];

    try {
      entries = readdirSync(current);
    } catch {
      return;
    }

    for (const entry of entries) {
      if (
        entry === 'node_modules' ||
        entry === '.nuxt' ||
        entry === '__tests__' ||
        entry === 'coverage' ||
        entry === 'tailwind.config.ts'
      ) {
        continue;
      }

      const full = `${current}/${entry}`;
      const stat = statSync(full);

      if (stat.isDirectory()) {
        walk(full);
      } else if (exts.some((ext) => entry.endsWith(ext))) {
        results.push(full);
      }
    }
  };

  walk(dir);
  return results;
};

const hasTransitiveDep = (symlinkPath: string, pkgName: string): boolean => {
  try {
    return lstatSync(symlinkPath).isSymbolicLink() && existsSync(join(symlinkPath, 'node_modules', pkgName));
  } catch {
    return false;
  }
};

const checkScopedDir = (scopedDirPath: string, pkgName: string): boolean => {
  try {
    for (const scoped of readdirSync(scopedDirPath)) {
      if (hasTransitiveDep(join(scopedDirPath, scoped), pkgName)) return true;
    }
  } catch {
    /* skip */
  }

  return false;
};

const checkSymlinkedDeps = (nodeModulesDir: string, pkgName: string): boolean => {
  if (!existsSync(nodeModulesDir)) return false;

  for (const entry of readdirSync(nodeModulesDir)) {
    if (entry.startsWith('.')) continue;
    const entryPath = join(nodeModulesDir, entry);

    if (entry.startsWith('@') && checkScopedDir(entryPath, pkgName)) return true;
    if (!entry.startsWith('@') && hasTransitiveDep(entryPath, pkgName)) return true;
  }

  return false;
};

const checkNodeModulesExistence = (pkg: string): boolean => {
  const pkgName = getPackageName(pkg);

  try {
    require.resolve(pkgName + '/package.json');
    return true;
  } catch {
    const pkgDir = resolve(APP_ROOT, 'node_modules', pkgName);
    if (existsSync(pkgDir)) return true;
    const rootPkgDir = resolve(APP_ROOT, '../../node_modules', pkgName);
    if (existsSync(rootPkgDir)) return true;

    return checkSymlinkedDeps(resolve(APP_ROOT, '../../node_modules'), pkgName);
  }
};

const reportResults = (staleInInclude: string[], missingFromInclude: Map<string, string[]>): boolean => {
  if (staleInInclude.length > 0) {
    console.warn('\nStale entries in optimizeDeps.include (package not found in node_modules):');
    for (const dep of staleInInclude) {
      console.warn(`  - ${dep}`);
    }
  }

  if (missingFromInclude.size > 0) {
    console.warn('\nPackages imported by the app but not listed in optimizeDeps.include:');

    for (const [pkg, files] of missingFromInclude) {
      const locations = files.slice(0, 3).join(', ') + (files.length > 3 ? ` (+${files.length - 3} more)` : '');
      console.warn(`  - ${pkg}  [${locations}]`);
    }

    console.warn('\nConsider adding missing entries to apps/web/app/configuration/optimize-deps.config.ts');
  }

  return staleInInclude.length > 0 || missingFromInclude.size > 0;
};

const checkStaleEntries = (): string[] => {
  const stale: string[] = [];

  for (const dep of allOptimizeDeps) {
    if (!checkNodeModulesExistence(dep)) stale.push(dep);
  }

  return stale;
};

const checkMissingEntries = (allSourceFiles: string[]): Map<string, string[]> => {
  const missing = new Map<string, string[]>();

  for (const file of allSourceFiles) {
    const content = readFileSync(file, 'utf-8');
    const imports = extractImports(content);
    const relPath = file.replace(APP_ROOT + '/', '');

    for (const imp of imports) {
      if (shouldSkip(imp)) continue;

      if (!isCovered(imp, allOptimizeDeps)) {
        const existing = missing.get(imp) ?? [];
        existing.push(relPath);
        missing.set(imp, existing);
      }
    }
  }

  return missing;
};

const main = (): void => {
  const staleInInclude = checkStaleEntries();
  const allSourceFiles: string[] = [];

  for (const dir of SOURCE_DIRS) {
    allSourceFiles.push(...findSourceFiles(resolve(APP_ROOT, dir), SOURCE_EXTENSIONS));
  }

  const missingFromInclude = checkMissingEntries(allSourceFiles);
  const hasIssues = reportResults(staleInInclude, missingFromInclude);

  if (hasIssues) {
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.info('\x1b[32m✔\x1b[0m Vite dependency pre-bundling is configured correctly');
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
