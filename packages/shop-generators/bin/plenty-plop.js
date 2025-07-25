#!/usr/bin/env node

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the plopfile
const plopfilePath = join(__dirname, '..', 'plopfile.ts');

// Run plop with our plopfile
const plopProcess = spawn('npx', ['plop', '--plopfile', plopfilePath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true,
});

plopProcess.on('exit', (code) => {
  process.exit(code || 0);
});
