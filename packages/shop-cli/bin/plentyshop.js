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

  // Parse --output-path flag and set environment variable
  const outputPathFlag = process.argv.find((arg) => arg.startsWith('--output-path='));
  if (outputPathFlag) {
    const outputPath = outputPathFlag.split('=')[1];
    process.env.PLENTYSHOP_OUTPUT_PATH = outputPath;
  }

  // Parse optional file generation flags and set environment variables
  const flagMapping = {
    '--skip-tests': 'PLENTYSHOP_SKIP_TESTS',
    '--skip-types': 'PLENTYSHOP_SKIP_TYPES',
    '--with-form': 'PLENTYSHOP_WITH_FORM',
    '--with-view': 'PLENTYSHOP_WITH_VIEW',
    '--with-toolbar': 'PLENTYSHOP_WITH_TOOLBAR',
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
  const customFlags = ['--output-path=', ...Object.keys(flagMapping)];
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
  - composable      Generate a new Vue composable

Options:
  --output-path=<path>  Set custom output path (default: apps/web/app)
  --skip-tests          Skip generating test files
  --skip-types          Skip generating types.ts file
  --with-form           Add *Form.vue file (for CMS editor blocks)
  --with-view           Add View.vue file (for settings panels)
  --with-toolbar        Add ToolbarTrigger.vue file (for settings)

Examples:
  plentyshop generate component
  plentyshop generate component ProductCard --skip-tests
  plentyshop generate component ImageBlock --with-form --skip-tests
  plentyshop generate composable useShoppingCart
  plentyshop generate component --output-path=apps/web/modules/my-module
  `);
}
