#!/usr/bin/env node
'use strict';

/**
 * Symlinks the source-of-truth agents/skills/context file in .github/ (and
 * root AGENTS.md) into the provider-specific location(s) each LLM coding
 * tool reads from.
 *
 * Usage: npm run llm:link <provider> [<provider> ...]
 *        npm run llm:link all
 *
 * Links the whole skills/ (and agents/) directory in one shot whenever
 * possible, so anything added to .github/skills or .github/agents later
 * shows up automatically without rerunning this script. Falls back to
 * linking individual entries only when the destination already contains
 * content this script didn't create (a client's own folder), so nothing
 * of theirs is ever deleted or overwritten. The same "never touch what's
 * already there" rule applies to the root context file (CLAUDE.md,
 * GEMINI.md, ...): if the client already has their own, it's left alone
 * and reported instead of being replaced.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SKILLS_SRC = path.join(ROOT, '.github', 'skills');
const AGENTS_SRC = path.join(ROOT, '.github', 'agents');
const CONTEXT_SRC = path.join(ROOT, 'AGENTS.md');
const DIR_SYMLINK_TYPE = process.platform === 'win32' ? 'junction' : 'dir';

// Codex agents are TOML with a different schema (developer_instructions,
// sandbox_mode, ...) so our Markdown+YAML agents can't be linked there.
// contextFile is null for codex because it already reads AGENTS.md
// directly at the repo root — the exact file that already is our source
// of truth, so there's nothing to link.
const PROVIDERS = {
  claude: { dir: '.claude', skills: true, agents: true, contextFile: 'CLAUDE.md' },
  gemini: { dir: '.gemini', skills: true, agents: true, contextFile: 'GEMINI.md' },
  codex: { dir: '.codex', skills: true, agents: false, contextFile: null },
};

function pathKind(targetPath) {
  let stat;
  try {
    stat = fs.lstatSync(targetPath);
  } catch {
    return null;
  }
  if (stat.isSymbolicLink()) return 'symlink';
  if (stat.isDirectory()) return 'dir';
  return 'file';
}

function resolveSymlink(linkPath) {
  return path.resolve(path.dirname(linkPath), fs.readlinkSync(linkPath));
}

function createSymlink(targetPath, sourcePath, symlinkType) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const relSource = path.relative(path.dirname(targetPath), sourcePath);
  fs.symlinkSync(relSource, targetPath, symlinkType);
}

// True if every entry directly inside `dir` is a symlink that resolves
// into `sourceDir` — i.e. this script (or a prior run of it) created all
// of it, so the directory is safe to remove and replace wholesale.
function containsOnlyLinksInto(dir, sourceDir) {
  const entries = fs.readdirSync(dir);
  const resolvedSource = path.resolve(sourceDir);
  return entries.every((name) => {
    const entryPath = path.join(dir, name);
    if (pathKind(entryPath) !== 'symlink') return false;
    const resolved = resolveSymlink(entryPath);
    return resolved === path.join(resolvedSource, name);
  });
}

// Symlink an individual entry (one skill folder, or one agent file) into
// a destination directory that already contains foreign content.
function linkEntry(targetPath, sourcePath, symlinkType) {
  const label = path.relative(ROOT, targetPath);
  const existing = pathKind(targetPath);

  if (existing === null) {
    createSymlink(targetPath, sourcePath, symlinkType);
    console.log(`  + linked ${label}`);
    return;
  }

  if (existing === 'symlink') {
    if (resolveSymlink(targetPath) === path.resolve(sourcePath)) {
      console.log(`  = ${label} already up to date`);
    } else {
      console.warn(`  ! ${label} is a symlink pointing elsewhere, leaving it alone`);
    }
    return;
  }

  console.warn(`  ! ${label} already exists and isn't managed by this script, leaving it alone`);
}

// Link `destDir` (e.g. .claude/skills) to `sourceDir` (e.g. .github/skills).
// Prefers a single whole-directory symlink so future additions to
// sourceDir need no rerun; falls back to per-entry linking if destDir
// already holds content this script didn't create.
function linkDir(destDir, sourceDir, entryNames) {
  const label = path.relative(ROOT, destDir);
  const existing = pathKind(destDir);

  if (existing === null) {
    createSymlink(destDir, sourceDir, DIR_SYMLINK_TYPE);
    console.log(`  + linked ${label}/ (whole directory)`);
    return;
  }

  if (existing === 'symlink') {
    if (resolveSymlink(destDir) === path.resolve(sourceDir)) {
      console.log(`  = ${label}/ already up to date`);
    } else {
      console.warn(`  ! ${label} is a symlink pointing elsewhere, leaving it alone`);
    }
    return;
  }

  if (existing === 'file') {
    console.warn(`  ! ${label} already exists and isn't managed by this script, leaving it alone`);
    return;
  }

  // existing === 'dir': a real directory. Safe to replace wholesale only
  // if everything inside it is a symlink this script created.
  if (containsOnlyLinksInto(destDir, sourceDir)) {
    fs.rmSync(destDir, { recursive: true });
    createSymlink(destDir, sourceDir, DIR_SYMLINK_TYPE);
    console.log(`  + upgraded ${label}/ to a whole-directory symlink`);
    return;
  }

  console.warn(`  ! ${label} has content of its own, linking entries individually instead`);
  for (const name of entryNames(sourceDir)) {
    linkEntry(path.join(destDir, name), path.join(sourceDir, name), pathKind(path.join(sourceDir, name)) === 'dir' ? DIR_SYMLINK_TYPE : 'file');
  }
}

// Every entry gets linked, valid skill/agent or not — a folder or file
// with no recognized shape (e.g. a work-in-progress "test" folder) is
// still ours and belongs on the destination unless the client already
// has something of their own by that name.
function listEntryNames(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir);
}

function linkProvider(name) {
  const config = PROVIDERS[name];
  if (!config) {
    console.error(`Unknown provider "${name}". Available: ${Object.keys(PROVIDERS).join(', ')}, all`);
    return false;
  }

  console.log(`\n${name} (${config.dir})`);
  const providerRoot = path.join(ROOT, config.dir);

  if (config.skills) {
    linkDir(path.join(providerRoot, 'skills'), SKILLS_SRC, listEntryNames);
  } else {
    console.log('  (skills not linked for this provider)');
  }

  if (config.agents) {
    linkDir(path.join(providerRoot, 'agents'), AGENTS_SRC, listEntryNames);
  } else {
    console.log('  (agents not linked for this provider — incompatible file format)');
  }

  if (config.contextFile) {
    linkEntry(path.join(ROOT, config.contextFile), CONTEXT_SRC, 'file');
  } else {
    console.log('  (no separate context file for this provider — it already reads AGENTS.md directly)');
  }

  return true;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help') || args.includes('help')) {
    console.log(`Usage: npm run llm:link <provider> [<provider> ...]\n\nProviders: ${Object.keys(PROVIDERS).join(', ')}, all`);
    process.exit(args.length === 0 ? 1 : 0);
  }

  const targets = args.includes('all') ? Object.keys(PROVIDERS) : args;
  const allOk = targets.map(linkProvider).every(Boolean);
  process.exitCode = allOk ? 0 : 1;
}

main();
