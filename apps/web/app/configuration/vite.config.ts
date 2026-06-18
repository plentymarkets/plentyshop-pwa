import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join, basename, relative } from 'node:path';
import type { NormalizedOutputOptions, OutputBundle } from 'rollup';
import type { BlockFile, ModuleFile } from './vite.config.types';

export const FailOnLargeChunksPlugin = {
  name: 'fail-on-large-chunks',
  generateBundle(_: NormalizedOutputOptions, bundle: OutputBundle) {
    if (!process.env.FAIL_BUILD_ON_LARGE_CHUNKS) {
      console.warn('Skipping chunk size check as FAIL_BUILD_ON_LARGE_CHUNKS is not set.');
      return;
    }
    // Increased to 630 KB to accommodate the CodeMirror bundle which is now automatically code-split via auto-imports instead of being manually chunked.
    const LIMIT = 630 * 1024; // 630 KB
    for (const [fileName, chunk] of Object.entries(bundle)) {
      if (fileName === 'server.mjs') continue; // skip server bundle
      if (chunk.type === 'chunk' && chunk.code.length > LIMIT) {
        throw new Error(
          `❌ Chunk "${fileName}" is too large (${(chunk.code.length / 1024).toFixed(2)} KB). ` +
            `Limit is ${LIMIT / 1024} KB.`,
        );
      }
    }
  },
};

export const FailOnForbiddenDataInPublicFolderPlugin = {
  name: 'fail-on-forbidden-data-in-public-folder',
  generateBundle() {
    if (!process.env.FAIL_BUILD_ON_FORBIDDEN_DATA_IN_PUBLIC_FOLDER) {
      console.warn(
        'Skipping public/ folder entries check as FAIL_BUILD_ON_FORBIDDEN_DATA_IN_PUBLIC_FOLDER is not set.',
      );
      return;
    }
    const publicDir = resolve(__dirname, '../../public');
    if (!existsSync(publicDir)) return;
    const unexpected = readdirSync(publicDir).filter((e) => e !== '_nuxt-plenty');
    if (unexpected.length > 0) {
      throw new Error(
        `❌ Unexpected entries in "public/": ${unexpected.join(', ')}. ` +
          `Due to routing rules, only the "_nuxt-plenty/" subdirectory is allowed in the public directory. Please move any public assets to the appropriate location.`,
      );
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ValidateBlockContributionsPlugin
// ─────────────────────────────────────────────────────────────────────────────
// Verifies the wiring between block-list contributions (TS) and block
// components (.vue). Schema correctness is enforced by `satisfies
// BlocksListContribution` at compile time, so this plugin only handles checks
// that TypeScript cannot:
//
//   1. Every `blockName` referenced from a contribution (in-house defaults,
//      internal modules, external modules) resolves to a `.vue` file.
//   2. No `<BlockName>.vue` collides across core/modules/customer unless the
//      overriding file declares `// @overrides-core`.
//
// Both checks are opt-in via FAIL_BUILD_ON_INVALID_BLOCK_CONTRIBUTIONS.

const BLOCKS_OVERRIDE_MARKER = '@overrides-core';

const walkDir = (dir: string, matches: (path: string) => boolean): string[] => {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  const stack: string[] = [dir];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules') continue;
        stack.push(full);
      } else if (entry.isFile() && matches(full)) {
        out.push(full);
      }
    }
  }
  return out;
};

const collectFromPackageRoots = (
  packagesRoot: string,
  subPath: string,
  matches: (path: string) => boolean,
): ModuleFile[] => {
  if (!existsSync(packagesRoot)) return [];
  const out: ModuleFile[] = [];
  let entries;
  try {
    entries = readdirSync(packagesRoot, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const subDir = join(packagesRoot, entry.name, subPath);
    if (!existsSync(subDir)) continue;
    for (const path of walkDir(subDir, matches)) {
      out.push({ path, module: entry.name });
    }
  }
  return out;
};

const collectBlockFiles = (webRoot: string): BlockFile[] => {
  const isVue = (p: string) => p.endsWith('.vue');
  const out: BlockFile[] = [];

  for (const path of walkDir(join(webRoot, 'app/components'), (p) => isVue(p) && p.includes('/blocks/'))) {
    out.push({ path, name: basename(path, '.vue'), source: 'core', origin: 'core' });
  }
  for (const { path, module } of collectFromPackageRoots(
    join(webRoot, 'modules'),
    'runtime/components/blocks',
    isVue,
  )) {
    out.push({ path, name: basename(path, '.vue'), source: 'module', origin: `modules/${module}` });
  }
  for (const { path, module } of collectFromPackageRoots(
    join(webRoot, 'node_modules'),
    'runtime/components/blocks',
    isVue,
  )) {
    out.push({ path, name: basename(path, '.vue'), source: 'customer', origin: `node_modules/${module}` });
  }

  return out;
};

/**
 * Extracts referenced block component names (`blockName: "Foo"`) from a TS
 * contribution source. Schema correctness is enforced by `satisfies
 * BlocksListContribution` at compile time, so a regex sweep over the source
 * text is sufficient and intentionally pragmatic.
 */
const extractBlockNamesFromSource = (source: string): string[] => {
  const out: string[] = [];
  const re = /\bblockName\s*:\s*["']([^"']+)["']/g;
  for (const match of source.matchAll(re)) {
    if (match[1]) out.push(match[1]);
  }
  return out;
};

const fileContainsMarker = (path: string): boolean => {
  try {
    return readFileSync(path, 'utf8').includes(BLOCKS_OVERRIDE_MARKER);
  } catch {
    return false;
  }
};

export const ValidateBlockContributionsPlugin = {
  name: 'validate-block-contributions',
  buildStart() {
    if (!process.env.FAIL_BUILD_ON_INVALID_BLOCK_CONTRIBUTIONS) {
      console.warn('Skipping block contributions validation as FAIL_BUILD_ON_INVALID_BLOCK_CONTRIBUTIONS is not set.');
      return;
    }

    const webRoot = resolve(__dirname, '../..');
    const errors: string[] = [];
    const blockFiles = collectBlockFiles(webRoot);
    const knownBlockNames = new Set(blockFiles.map((b) => b.name));

    // Check 1: every referenced `blockName` resolves to a `.vue` component.
    // Source files: in-house defaults + internal/external module contributions.
    const sources: Array<{ path: string; origin: string }> = [];
    for (const path of walkDir(join(webRoot, 'app/utils/blocks/defaultblocks'), (p) => p.endsWith('.ts'))) {
      sources.push({ path, origin: `defaults/${basename(path)}` });
    }
    for (const { path, module } of collectFromPackageRoots(join(webRoot, 'modules'), 'runtime/components/blocks', (p) =>
      p.endsWith('blocks-list.ts'),
    )) {
      sources.push({ path, origin: `modules/${module}/${relative(join(webRoot, 'modules', module), path)}` });
    }
    for (const { path, module } of collectFromPackageRoots(
      join(webRoot, 'node_modules'),
      'runtime/components/blocks',
      (p) => p.endsWith('blocks-list.ts'),
    )) {
      sources.push({
        path,
        origin: `node_modules/${module}/${relative(join(webRoot, 'node_modules', module), path)}`,
      });
    }
    for (const { path, origin } of sources) {
      for (const name of extractBlockNamesFromSource(readFileSync(path, 'utf8'))) {
        if (!knownBlockNames.has(name)) {
          errors.push(`${origin}: blockName "${name}" has no matching ${name}.vue component`);
        }
      }
    }

    // Check 2: duplicate `<BlockName>.vue` files must declare the override marker.
    const byName = new Map<string, BlockFile[]>();
    for (const file of blockFiles) {
      const list = byName.get(file.name) ?? [];
      list.push(file);
      byName.set(file.name, list);
    }
    for (const [name, files] of byName) {
      if (files.length < 2) continue;
      // If a core file exists it is the canonical base; only non-core duplicates
      // need to opt in. If no core file exists, every duplicate must opt in.
      const hasCore = files.some((f) => f.source === 'core');
      const candidates = hasCore ? files.filter((f) => f.source !== 'core') : files;
      const offenders = candidates.filter((f) => !fileContainsMarker(f.path));
      if (offenders.length === 0) continue;
      errors.push(
        `Block "${name}.vue" is defined in multiple locations:\n` +
          files.map((f) => `  - [${f.origin}] ${relative(webRoot, f.path)}`).join('\n') +
          `\n  Add \`// ${BLOCKS_OVERRIDE_MARKER}\` to the overriding file(s) to acknowledge the override.\n` +
          `  Missing marker in:\n` +
          offenders.map((f) => `    - ${relative(webRoot, f.path)}`).join('\n'),
      );
    }

    if (errors.length > 0) {
      throw new Error(
        `❌ Block contributions validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):\n\n` +
          errors.map((e, i) => `[${i + 1}] ${e}`).join('\n\n'),
      );
    }
  },
};
