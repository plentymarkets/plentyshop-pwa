import {
  INITIAL_VERSION,
  LICENSE,
  MARKETPLACE_CATEGORY,
  SHOP_CORE_VERSION_RANGE,
  SUBSCRIPTION_INTERVALS,
} from './constants';
import { parseExtensionName, toCamelCase, toPascalCase } from './naming';
import {
  buildComponent,
  buildComposable,
  buildDocuments,
  buildImages,
  buildPlayground,
  buildPlugin,
  buildReadme,
} from './starter-files';
import type { ExtensionAnswers, ExtensionFile } from './types';

export { getExtensionDirName, parseExtensionName } from './naming';

/**
 * Formats a price as a JSON float literal. The marketplace requires a decimal point (`0.0`, not `0`),
 * which `JSON.stringify` would drop.
 */
export function formatPrice(price: number): string {
  return Number.isInteger(price * 10) ? price.toFixed(1) : price.toFixed(2);
}

function buildMarketplaceJson(answers: ExtensionAnswers): string {
  const price = answers.pricing === 'paid' ? (answers.price ?? 0) : 0;
  const lines = [
    `  "marketplaceName": ${JSON.stringify({ en: answers.displayNameEn, de: answers.displayNameDe })},`,
    `  "price": ${formatPrice(price)},`,
    `  "shortDescription": ${JSON.stringify({ en: answers.descriptionEn, de: answers.descriptionDe })},`,
    `  "categories": ["${MARKETPLACE_CATEGORY}"]`,
  ];

  if (answers.pricing === 'subscription') {
    const entries = SUBSCRIPTION_INTERVALS.filter(
      (interval) => answers.subscriptionPrices?.[interval] !== undefined,
    ).map(
      (interval) =>
        `    { "interval": "${interval}", "price": ${formatPrice(answers.subscriptionPrices?.[interval] ?? 0)} }`,
    );
    lines[lines.length - 1] += ',';
    lines.push(`  "subscription": [\n${entries.join(',\n')}\n  ]`);
  }

  return `{\n${lines.join('\n')}\n}\n`;
}

function buildPackageJson(answers: ExtensionAnswers): string {
  const hasPlayground = answers.starters.includes('playground');
  const scripts: Record<string, string> = {
    build:
      "tsc -p tsconfig.json && rimraf dist/runtime && node -e \"require('fs').cpSync('src/runtime','dist/runtime',{recursive:true})\"",
  };
  if (hasPlayground) {
    scripts['playground:dev'] = 'nuxi dev playground';
    scripts['playground:build'] = 'nuxi build playground';
  }

  return `${JSON.stringify(
    {
      name: answers.name,
      version: INITIAL_VERSION,
      description: answers.descriptionEn,
      license: LICENSE,
      type: 'module',
      main: './dist/module.mjs',
      exports: {
        '.': { import: './dist/module.mjs' },
        './runtime/*': { import: './dist/runtime/*' },
      },
      files: ['dist', 'marketplace.json', 'meta'],
      scripts,
      dependencies: { '@plentymarkets/shop-core': SHOP_CORE_VERSION_RANGE },
      devDependencies: { '@nuxt/kit': '^4.5.1', rimraf: '^5.0.7', typescript: '5.9.3' },
    },
    null,
    2,
  )}\n`;
}

const TSCONFIG = `${JSON.stringify(
  {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      strict: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      esModuleInterop: true,
      declaration: true,
      outDir: './dist',
      rootDir: './src',
    },
    include: ['src/module.mts'],
    exclude: ['node_modules', 'dist', 'src/runtime'],
  },
  null,
  2,
)}\n`;

function buildModule(answers: ExtensionAnswers): string {
  const { scope, slug } = parseExtensionName(answers.name);
  const configKey = `${toCamelCase(scope)}${toPascalCase(slug)}`;
  const kitImports = ['defineNuxtModule', 'createResolver'];
  const setup: string[] = ['const resolver = createResolver(import.meta.url);'];

  if (answers.starters.includes('plugin')) {
    kitImports.push('addPlugin');
    setup.push(`addPlugin(resolver.resolve('./runtime/plugins/${slug}.plugin'));`);
  }
  if (answers.starters.includes('component')) {
    kitImports.push('addComponentsDir');
    setup.push(`addComponentsDir({ path: resolver.resolve('./runtime/components') });`);
  }
  if (answers.starters.includes('composable')) {
    kitImports.push('addImportsDir');
    setup.push(`addImportsDir(resolver.resolve('./runtime/composables'));`);
  }

  return `import { ${kitImports.join(', ')} } from '@nuxt/kit';

export interface ModuleOptions {
  enabled: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    // Must match package.json "name" and runtime/extension.config.ts
    name: '${answers.name}',
    configKey: '${configKey}',
  },
  defaults: {
    enabled: true,
  },
  setup(options) {
    if (!options.enabled) {
      return;
    }

    ${setup.join('\n    ')}
  },
});
`;
}

function buildExtensionConfig(answers: ExtensionAnswers): string {
  return `import { defineExtensionConfig } from '#imports';

export default defineExtensionConfig({
  name: '${answers.name}',
});
`;
}

/**
 * Builds every file of a new marketplace extension, relative to its directory.
 * Pure function: nothing is written here, so it can be previewed (dry-run) and tested.
 */
export function buildExtensionFiles(answers: ExtensionAnswers): ExtensionFile[] {
  const { slug } = parseExtensionName(answers.name);
  const files: ExtensionFile[] = [
    { path: 'package.json', content: buildPackageJson(answers) },
    { path: 'tsconfig.json', content: TSCONFIG },
    { path: 'README.md', content: buildReadme(answers) },
    { path: 'marketplace.json', content: buildMarketplaceJson(answers) },
    { path: 'src/module.mts', content: buildModule(answers) },
    { path: 'src/runtime/extension.config.ts', content: buildExtensionConfig(answers) },
    ...buildDocuments(answers),
    ...buildImages(),
  ];

  if (answers.starters.includes('plugin')) {
    files.push({ path: `src/runtime/plugins/${slug}.plugin.ts`, content: buildPlugin() });
  }
  if (answers.starters.includes('component')) {
    files.push({
      path: `src/runtime/components/${toPascalCase(slug)}.vue`,
      content: buildComponent(answers),
    });
  }
  if (answers.starters.includes('composable')) {
    files.push({
      path: `src/runtime/composables/use${toPascalCase(slug)}.ts`,
      content: buildComposable(answers),
    });
  }
  if (answers.starters.includes('playground')) {
    files.push(...buildPlayground(answers));
  }

  return files;
}
