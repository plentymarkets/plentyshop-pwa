#!/usr/bin/env node

/**
 * Builds a local Nuxt module, packs and installs it as a tarball (not a symlink),
 * then registers it in apps/web/nuxt.config.ts without adding duplicate entries.
 * Usage: npm run install:module -- <package-path>
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { updateConfig } from 'c12/update';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));

function runNpm(args, captureOutput = false) {
  const npmCli = process.env.npm_execpath;
  const result = spawnSync(npmCli ? process.execPath : 'npm', npmCli ? [npmCli, ...args] : args, {
    cwd: repoRoot,
    stdio: captureOutput ? ['inherit', 'pipe', 'inherit'] : 'inherit',
    encoding: 'utf8',
  });

  if (result.error) {
    throw result.error;
  }
  if (result.signal) {
    throw new Error(`npm was terminated by ${result.signal}`);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  return result.stdout;
}

try {
  if (process.argv.length !== 3) {
    throw new Error('Usage: npm run install:module -- <package-path>');
  }

  const packageDir = resolve(repoRoot, process.argv[2]);
  const { name } = JSON.parse(readFileSync(resolve(packageDir, 'package.json'), 'utf8'));
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error('The package must have a name in package.json');
  }

  runNpm(['--prefix', packageDir, 'run', 'build']);
  const [{ filename }] = JSON.parse(runNpm(['pack', packageDir, '--json'], true));
  runNpm(['install', resolve(repoRoot, filename)]);

  await updateConfig({
    cwd: resolve(repoRoot, 'apps/web'),
    configFile: 'nuxt.config',
    onUpdate(config) {
      config.modules ??= [];
      if (!config.modules.some((module) => (Array.isArray(module) ? module[0] : module) === name)) {
        config.modules.push(name);
      }
    },
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
