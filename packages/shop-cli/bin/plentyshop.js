#!/usr/bin/env node

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the command (default to showing help)
const command = process.argv[2];

if (command === 'generate') {
  // Path to the plopfile for code generation
  const plopfilePath = join(__dirname, '..', 'plopfile.ts');
  
  // Remove the command from argv when passing to plop
  const plopArgs = process.argv.slice(3);
  
  // Run plop with our plopfile using tsx for TypeScript support
  const plopProcess = spawn('npx', ['cross-env', 'NODE_OPTIONS=--import=tsx', 'plop', '--plopfile', plopfilePath, ...plopArgs], {
    stdio: 'inherit',
    shell: true,
  });

  plopProcess.on('exit', (code) => {
    process.exit(code || 0);
  });
} else if (command === 'init') {
  // Initialize CLI and show help
  console.log(`
PlentyONE Shop CLI initialized successfully!

Usage:
  plentyshop generate [generator-type]  Generate components, composables, pages, etc.
  plentyshop init                       Initialize CLI and show help
  plentyshop --help                     Show this help

Available generators:
  - ui-component    Generate a new UI component
  - component       Generate a new Vue component
  - composable      Generate a new Vue composable
  - page            Generate a new Nuxt page
  - utils           Generate utility functions
  - types           Generate TypeScript type definitions

Examples:
  plentyshop generate ui-component
  plentyshop generate component
  `);
  process.exit(0);
} else {
  console.log(`
PlentyONE Shop CLI

Usage:
  plentyshop generate [generator-type]  Generate components, composables, pages, etc.
  plentyshop init                       Initialize CLI and show help
  plentyshop --help                     Show this help

Available generators:
  - ui-component    Generate a new UI component
  - component       Generate a new Vue component
  - composable      Generate a new Vue composable
  - page            Generate a new Nuxt page
  - utils           Generate utility functions
  - types           Generate TypeScript type definitions

Examples:
  plentyshop generate ui-component
  plentyshop generate component
  `);
}
