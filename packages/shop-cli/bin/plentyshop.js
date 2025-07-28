#!/usr/bin/env node

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the command (default to 'generate' for backwards compatibility)
const command = process.argv[2] || 'generate';

if (command === 'generate' || command === 'init') {
  // Path to the plopfile for code generation
  const plopfilePath = join(__dirname, '..', 'plopfile.ts');
  
  // Remove the command from argv when passing to plop
  const plopArgs = command === 'generate' ? process.argv.slice(2) : process.argv.slice(3);
  
  // Run plop with our plopfile using tsx for TypeScript support
  const plopProcess = spawn('npx', ['cross-env', 'NODE_OPTIONS=--import=tsx', 'plop', '--plopfile', plopfilePath, ...plopArgs], {
    stdio: 'inherit',
    shell: true,
  });

  plopProcess.on('exit', (code) => {
    process.exit(code || 0);
  });
} else {
  console.log(`
PlentyONE Shop CLI

Usage:
  plentyshop generate [generator-type]  Generate components, composables, pages, etc.
  plentyshop init [generator-type]      Alias for generate
  plentyshop --help                     Show this help

Available generators:
  - component   Generate a new Vue component
  - composable  Generate a new Vue composable
  - page        Generate a new Nuxt page
  - utils       Generate utility functions
  - types       Generate TypeScript type definitions

Examples:
  plentyshop generate component
  plentyshop init composable
  `);
}
