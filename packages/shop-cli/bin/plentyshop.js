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

  // Parse --web-app-path flag and set environment variable
  const webAppPathFlag = process.argv.find(arg => arg.startsWith('--web-app-path='));
  if (webAppPathFlag) {
    const webAppPath = webAppPathFlag.split('=')[1];
    process.env.PLENTYSHOP_WEB_APP_PATH = webAppPath;
  }

  // Filter out --web-app-path flag from plop args (not a plop argument)
  const plopArgs = process.argv.slice(3).filter(arg => !arg.startsWith('--web-app-path='));

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
  plentyshop generate [generator-type]  Generate components, composables, pages, etc.
  plentyshop --help                     Show this help

Available generators:
  - component       Generate a new Vue component
  - composable      Generate a new Vue composable

Options:
  --web-app-path=<path>  Set custom web app base path (default: apps/web/app)

Examples:
  plentyshop generate component
  plentyshop generate component --web-app-path=apps/web/modules/my-module
  `);
}
