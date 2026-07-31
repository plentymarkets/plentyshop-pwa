import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, basename, sep } from 'node:path';

const OVERRIDE_MARKER = '@overrides-core-block';

const rootDir = resolve(__dirname, '../..');

const normalize = (file: string) => basename(file).replace(/\.vue$/, '');

const listVueFiles = (dir: string): string[] => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true })
    .filter((rel): rel is string => typeof rel === 'string' && rel.endsWith('.vue'))
    .map((rel) => resolve(dir, rel));
};

const listModuleBlocks = (baseDir: string): string[] => {
  if (!existsSync(baseDir)) return [];
  return readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => listVueFiles(resolve(baseDir, entry.name, 'runtime/components/blocks')));
};

export const FailOnUnmarkedBlockOverridesPlugin = {
  name: 'fail-on-unmarked-block-overrides',
  generateBundle() {
    if (!process.env.FAIL_BUILD_ON_UNMARKED_BLOCK_OVERRIDES) {
      console.warn('Skipping block override check as FAIL_BUILD_ON_UNMARKED_BLOCK_OVERRIDES is not set.');
      return;
    }

    const coreNames = new Set(
      listVueFiles(resolve(rootDir, 'app/components'))
        .filter((file) => file.split(sep).includes('blocks'))
        .map(normalize),
    );

    const overrideFiles = [
      ...listModuleBlocks(resolve(rootDir, 'modules')),
      ...listModuleBlocks(resolve(rootDir, 'node_modules')),
    ];

    const unmarked: string[] = [];
    const dangling: string[] = [];

    for (const file of overrideFiles) {
      const overridesCore = coreNames.has(normalize(file));
      const hasMarker = readFileSync(file, 'utf8').includes(OVERRIDE_MARKER);

      if (overridesCore && !hasMarker) unmarked.push(file);
      if (!overridesCore && hasMarker) dangling.push(file);
    }

    if (dangling.length > 0) {
      console.warn(
        `${dangling.length} file(s) declare "${OVERRIDE_MARKER}" but no core block with that name exists:\n` +
          dangling.map((f) => `   - ${f}`).join('\n'),
      );
    }

    if (unmarked.length > 0) {
      throw new Error(
        `${unmarked.length} block file(s) override a core block without the "${OVERRIDE_MARKER}" marker:\n` +
          unmarked.map((f) => `   - ${f}`).join('\n') +
          `\nAdd a "<!-- ${OVERRIDE_MARKER} -->" comment to confirm the override is intentional.`,
      );
    }
  },
};
