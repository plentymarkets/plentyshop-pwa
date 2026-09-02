#!/usr/bin/env node

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the command (default to showing help)
const command = process.argv[2];

if (command === 'generate') {
  const plopfilePath = join(__dirname, '..', 'plopfile.ts');

  // Parse --category=<value> and --access-control=<comma,separated,list> flags
  const categoryFlag = process.argv.find((arg) => arg.startsWith('--category='));
  if (categoryFlag) {
    process.env.PLENTYSHOP_CATEGORY = categoryFlag.split('=')[1];
  }

  const accessControlFlag = process.argv.find((arg) => arg.startsWith('--access-control='));
  if (accessControlFlag) {
    process.env.PLENTYSHOP_ACCESS_CONTROL = accessControlFlag.split('=')[1];
  }

  // Parse optional file generation flags and set environment variables
  const flagMapping = {
    '--skip-tests': 'PLENTYSHOP_SKIP_TESTS',
    '--skip-types': 'PLENTYSHOP_SKIP_TYPES',
    '--with-form': 'PLENTYSHOP_WITH_FORM',
    '--with-view': 'PLENTYSHOP_WITH_VIEW',
    '--with-toolbar': 'PLENTYSHOP_WITH_TOOLBAR',
    '--dry-run': 'PLENTYSHOP_DRY_RUN',
    '--complex-form': 'PLENTYSHOP_COMPLEX_FORM',
    '--structure': 'PLENTYSHOP_STRUCTURE',
  };

  // Check if any flags are provided (non-interactive mode)
  const hasFlags = Object.keys(flagMapping).some((flag) => process.argv.includes(flag));

  // If any flag is provided, set all unset flags to 'false' for non-interactive mode
  if (hasFlags) {
    for (const envVar of Object.values(flagMapping)) {
      if (!process.env[envVar]) {
        process.env[envVar] = 'false';
      }
    }
  }

  // Set provided flags to 'true'
  for (const [flag, envVar] of Object.entries(flagMapping)) {
    if (process.argv.includes(flag)) {
      process.env[envVar] = 'true';
    }
  }

  // Filter out custom flags from plop args (not plop arguments)
  const customFlags = ['--category=', '--access-control=', ...Object.keys(flagMapping)];
  const plopArgs = process.argv.slice(3).filter((arg) => {
    return !customFlags.some((flag) => arg.startsWith(flag));
  });

  const plopProcess = spawn(
    'npx',
    ['cross-env', 'NODE_OPTIONS=--import=tsx', 'plop', '--plopfile', plopfilePath, ...plopArgs],
    {
      stdio: 'inherit',
    },
  );

  plopProcess.on('exit', (code) => {
    process.exit(code || 0);
  });
} else {
  console.log(`
PlentyONE Shop CLI

Usage:
  plentyshop generate [generator-type] [name] [options]
  plentyshop --help

Available generators:
  - component       Generate a new Vue component
  - block           Generate a CMS block (component --with-form, registered under its own name)
  - composable      Generate a new Vue composable

Options:
  --skip-tests             Skip generating test files
  --skip-types             Skip generating types.ts file
  --with-form              Add *Form.vue file (for CMS editor blocks)
  --with-view              Add View.vue file (for settings panels)
  --with-toolbar           Add ToolbarTrigger.vue file (for settings)
  --dry-run                Preview planned files without writing anything
  --complex-form           With --with-form: scaffold forms/+partials/ instead of one Form.vue
  --structure              With --with-form: scaffold a structure/container block (content: Block[]
                            children) instead of a content block (content: settings object)
  --category=<value>       With --with-form: the block's CMS editor category
  --access-control=<list>  With --with-form: comma-separated contexts (content,productCategory,product)

Examples:
  plentyshop generate component
  plentyshop generate component ProductCard --skip-tests
  plentyshop generate component ImageBlock --with-form --skip-tests
  plentyshop generate component ProductCard --dry-run
  plentyshop generate component ImageBlock --with-form --category=media --access-control=content,product
  plentyshop generate block ImageCarousel --category=media --access-control=content,product
  plentyshop generate block ColumnLayout --structure --category=layout --access-control=content
  plentyshop generate composable useShoppingCart

To generate into a different app root (e.g. a customer module), create a
.plentyone/shop-cli.json config file in your project root:
  { "webAppPath": "apps/web/modules/my-module" }
  `);
}
