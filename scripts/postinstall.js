const fs = require('node:fs');
const path = require('node:path');

const executablePaths = [
  path.join(__dirname, 'spawn-worktree.sh'),
  path.join(__dirname, 'dry-check.mjs'),
  path.join(__dirname, '..', '.husky', 'pre-commit'),
];

for (const scriptPath of executablePaths) {
  try {
    fs.chmodSync(scriptPath, 0o755);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[postinstall] Skipped chmod for ${scriptPath}: ${String(error?.message ?? error)}`);
  }
}
