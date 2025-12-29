# Scripts

## `spawn-worktree.sh`
Creates one or more Git worktrees under `../pwa-worktree/` (folder name = branch name with `/` replaced by `-`), then bootstraps each worktree:

- loads `nvm` and runs `nvm use` (falls back to `nvm install`)
- installs dependencies (`npm ci` if `package-lock.json` exists, otherwise `npm install`)
- runs `npm run lint` and `npm run test`

Usage:

```bash
./scripts/spawn-worktree.sh <branch> [<branch> ...] [--base <base-ref> | --head] [--worktree-jobs [<n>]]
```

Examples:

```bash
# Single worktree
npm run worktree:spawn -- feat/awesome-feature

# Multiple worktrees
npm run worktree:spawn -- feat/a feat/b feat/c

# Create worktrees in parallel (bootstrap runs in parallel, "all" when no number is provided)
npm run worktree:spawn -- feat/a feat/b --worktree-jobs

# Create from a specific base ref
npm run worktree:spawn -- feat/a feat/b --base release/1.15

# Create from the default branch on origin (origin/HEAD)
npm run worktree:spawn -- feat/a --head
```

Notes:
- If a target folder already exists but is not a registered worktree, the script errors; `git worktree prune` (and/or removing the folder) usually fixes this.
- Designed for POSIX environments (macOS/Linux). Windows typically requires WSL or Git Bash.

## `postinstall.js`
`chmod +x` for `scripts/spawn-worktree.sh` during `npm install`, so `npm run worktree:spawn` works reliably on fresh checkouts.
