const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const scriptPath = `${__dirname}/spawn-worktree.sh`;

try {
  fs.chmodSync(scriptPath, 0o755);
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn(`[postinstall] Skipped chmod for ${scriptPath}: ${String(error?.message ?? error)}`);
}

try {
  const cliPath = path.join(path.dirname(require.resolve('playwright-core/package.json')), 'cli.js');
  execFileSync('node', [cliPath, 'install', 'chromium-headless-shell'], { stdio: 'inherit' });
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn(`[postinstall] Skipped chromium-headless-shell install: ${String(error?.message ?? error)}`);
}