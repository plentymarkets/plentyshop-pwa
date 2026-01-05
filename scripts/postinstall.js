const fs = require('node:fs');
const path = require('node:path');

const scriptPath = `${__dirname}/spawn-worktree.sh`;

try {
  fs.chmodSync(scriptPath, 0o755);
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn(`[postinstall] Skipped chmod for ${scriptPath}: ${String(error?.message ?? error)}`);
}

const gitHooksDir = path.join(__dirname, '..', '.git', 'hooks');
const commitMsgSource = path.join(__dirname, 'commit-msg');
const commitMsgDest = path.join(gitHooksDir, 'commit-msg');

try {
  if (fs.existsSync(gitHooksDir)) {
    if (!fs.existsSync(commitMsgSource)) {
      // eslint-disable-next-line no-console
      console.warn(`[postinstall] Source file not found: ${commitMsgSource}`);
      // eslint-disable-next-line no-console
      console.warn('[postinstall] Skipping commit-msg hook installation');
    } else {
      fs.copyFileSync(commitMsgSource, commitMsgDest);
      fs.chmodSync(commitMsgDest, 0o755);
      // eslint-disable-next-line no-console
      console.log('[postinstall] Git commit-msg hook installed successfully');
    }
  }
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn(`[postinstall] Failed to install commit-msg hook: ${String(error?.message ?? error)}`);
}

