import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join, basename, relative } from 'node:path';
import type { NormalizedOutputOptions, OutputBundle } from 'rollup';

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
// Validates block contributions from modules at build time so structural
// issues fail fast in CI instead of producing silent UX bugs at runtime.
//
// Hard checks (all opt-in via FAIL_BUILD_ON_INVALID_BLOCK_CONTRIBUTIONS):
//   1. Each module `blocks-list.json` matches the expected BlocksList shape.
//   2. Every `blockName` / `template.{en,de}.name` referenced from a
//      `blocks-list.json` resolves to a `.vue` file in core, modules, or
//      customer (node_modules).
//   3. No `<BlockName>.vue` collides across core/modules/customer unless the
//      overriding file declares `// @overrides-core`.

const BLOCKS_OVERRIDE_MARKER = '@overrides-core';

type BlockSource = 'core' | 'module' | 'customer';
type BlockFile = { path: string; name: string; source: BlockSource; origin: string };
type ModuleFile = { path: string; module: string };

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
  for (const { path, module } of collectFromPackageRoots(join(webRoot, 'modules'), 'runtime/components/blocks', isVue)) {
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

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const validateContributionSchema = (origin: string, json: unknown): string[] => {
  if (!isPlainObject(json)) return [`${origin}: top-level must be an object`];

  const errors: string[] = [];
  for (const [key, category] of Object.entries(json)) {
    const cp = `${origin} > "${key}"`;
    if (!isPlainObject(category)) {
      errors.push(`${cp}: must be an object`);
      continue;
    }
    if (typeof category.title !== 'string') errors.push(`${cp}.title must be a string`);
    if (typeof category.blockName !== 'string') errors.push(`${cp}.blockName must be a string`);
    if (typeof category.category !== 'string') errors.push(`${cp}.category must be a string`);
    if (!Array.isArray(category.variations)) {
      errors.push(`${cp}.variations must be an array`);
      continue;
    }
    category.variations.forEach((variation, i) => {
      const vp = `${cp}.variations[${i}]`;
      if (!isPlainObject(variation)) {
        errors.push(`${vp}: must be an object`);
        return;
      }
      if (typeof variation.image !== 'string') errors.push(`${vp}.image must be a string`);
      if (typeof variation.title !== 'string') errors.push(`${vp}.title must be a string`);
      if (!isPlainObject(variation.template)) {
        errors.push(`${vp}.template must be an object`);
        return;
      }
      for (const lang of ['en', 'de'] as const) {
        const tpl = variation.template[lang];
        if (!isPlainObject(tpl)) {
          errors.push(`${vp}.template.${lang} must be an object`);
          continue;
        }
        if (typeof tpl.name !== 'string') errors.push(`${vp}.template.${lang}.name must be a string`);
      }
    });
  }
  return errors;
};

const collectReferencedBlockNames = (
  origin: string,
  contribution: Record<string, unknown>,
): Array<{ name: string; location: string }> => {
  const refs: Array<{ name: string; location: string }> = [];
  for (const [key, category] of Object.entries(contribution)) {
    if (!isPlainObject(category)) continue;
    if (typeof category.blockName === 'string') {
      refs.push({ name: category.blockName, location: `${origin} > "${key}".blockName` });
    }
    if (!Array.isArray(category.variations)) continue;
    category.variations.forEach((variation, i) => {
      if (!isPlainObject(variation) || !isPlainObject(variation.template)) return;
      for (const lang of ['en', 'de'] as const) {
        const tpl = variation.template[lang];
        if (isPlainObject(tpl) && typeof tpl.name === 'string') {
          refs.push({ name: tpl.name, location: `${origin} > "${key}".variations[${i}].template.${lang}.name` });
        }
      }
    });
  }
  return refs;
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
      console.warn(
        'Skipping block contributions validation as FAIL_BUILD_ON_INVALID_BLOCK_CONTRIBUTIONS is not set.',
      );
      return;
    }

    const webRoot = resolve(__dirname, '../..');
    const errors: string[] = [];
    const blockFiles = collectBlockFiles(webRoot);
    const knownBlockNames = new Set(blockFiles.map((b) => b.name));

    // Check 1 + 2: schema + reference validation for each module contribution.
    const contributions = collectFromPackageRoots(join(webRoot, 'modules'), 'runtime/components/blocks', (p) =>
      p.endsWith('blocks-list.json'),
    );
    for (const { path, module } of contributions) {
      const origin = `modules/${module}/${relative(join(webRoot, 'modules', module), path)}`;
      let parsed: unknown;
      try {
        parsed = JSON.parse(readFileSync(path, 'utf8'));
      } catch (error) {
        errors.push(`${origin}: invalid JSON (${error instanceof Error ? error.message : String(error)})`);
        continue;
      }

      const schemaErrors = validateContributionSchema(origin, parsed);
      if (schemaErrors.length > 0) {
        errors.push(...schemaErrors);
        continue; // reference check is meaningless on malformed contributions
      }

      for (const { name, location } of collectReferencedBlockNames(origin, parsed as Record<string, unknown>)) {
        if (!knownBlockNames.has(name)) {
          errors.push(`${location} references "${name}.vue" but no matching block component exists`);
        }
      }
    }

    // Check 3: duplicate .vue files must declare the override marker.
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
