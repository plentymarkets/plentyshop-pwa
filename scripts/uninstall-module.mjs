#!/usr/bin/env node

/**
 * Removes a local module from Nuxt and npm, then deletes its generated tarballs
 * from the repository root. The source package is left intact.
 * Usage: npm run uninstall:module -- <package-path>
 */

import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { updateConfig } from 'c12/update';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));

try {
  if (process.argv.length !== 3) {
    throw new Error('Usage: npm run uninstall:module -- <package-path>');
  }

  const packageDir = resolve(repoRoot, process.argv[2]);
  const { name, version } = JSON.parse(readFileSync(resolve(packageDir, 'package.json'), 'utf8'));
  if (typeof name !== 'string' || !name.trim() || typeof version !== 'string' || !version.trim()) {
    throw new Error('The package must have a name and version in package.json');
  }

  const projectPackage = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));
  const dependency = projectPackage.dependencies?.[name] ?? projectPackage.devDependencies?.[name];
  const tarballs = new Set([resolve(repoRoot, `${name.replace(/^@/, '').replaceAll('/', '-')}-${version}.tgz`)]);
  if (dependency?.startsWith('file:') && dependency.endsWith('.tgz')) {
    tarballs.add(resolve(repoRoot, dependency.slice('file:'.length)));
  }

  await updateConfig({
    cwd: resolve(repoRoot, 'apps/web'),
    configFile: 'nuxt.config',
    onUpdate(config) {
      if (config.modules) {
        config.modules = config.modules.filter((module) => module !== name);
      }
    },
  });

  const npmCli = process.env.npm_execpath;
  const args = ['uninstall', name];
  const result = spawnSync(npmCli ? process.execPath : 'npm', npmCli ? [npmCli, ...args] : args, {
    cwd: repoRoot,
    stdio: 'inherit',
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

  for (const tarball of tarballs) {
    if (dirname(tarball) === resolve(repoRoot)) {
      rmSync(tarball, { force: true });
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}