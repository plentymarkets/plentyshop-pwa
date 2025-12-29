const fs = require('node:fs');

const scriptPath = `${__dirname}/spawn-worktree.sh`;

try {
  fs.chmodSync(scriptPath, 0o755);
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn(`[postinstall] Skipped chmod for ${scriptPath}: ${String(error?.message ?? error)}`);
}
