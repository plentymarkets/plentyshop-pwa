#!/usr/bin/env node
// =============================================================================
// dry-check.mjs
//
// Analyses staged git changes and warns when a code chunk that was just added
// already has a near-identical counterpart in the component / composable
// catalogue.
//
// Strategy
// --------
//   1. Collect the lines added in this commit (git diff --cached).
//   2. Split them into logical "chunks" (≥ MIN_CHUNK_LINES consecutive
//      added lines, normalised to remove trivial whitespace differences).
//   3. For every file in the searchable catalogue (components, composables,
//      utils, pages) compute a normalised line-fingerprint set.
//   4. Compare each new chunk against each catalogue file using a simple
//      Jaccard-similarity score over normalised line tokens.
//   5. If similarity ≥ SIMILARITY_THRESHOLD report a violation.
//
// The check is deliberately fast (no AST, no network) so it can run on every
// commit without adding perceptible latency.
//
// Exit codes
//   0 – no violations (or --warn-only flag set)
//   1 – at least one violation detected
// =============================================================================

import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CONFIG = {
  /** Minimum consecutive added lines to form a chunk worth checking. */
  MIN_CHUNK_LINES: 6,

  /**
   * Jaccard similarity threshold [0–1].
   * 0.65 catches near-duplicates while avoiding false positives on shared
   * boilerplate (imports, closing braces, etc.).
   */
  SIMILARITY_THRESHOLD: 0.65,

  /** Directories relative to repo root that form the "catalogue". */
  CATALOGUE_DIRS: [
    'apps/web/app/components',
    'apps/web/app/composables',
    'apps/web/app/utils',
    'apps/web/app/pages',
  ],

  /** File extensions included in catalogue scan and diff analysis. */
  EXTENSIONS: new Set(['.vue', '.ts', '.js']),

  /**
   * Lines matching these patterns are stripped before comparison — they
   * carry no DRY signal (imports, closing braces, blank lines, comments).
   */
  NOISE_PATTERNS: [
    /^\s*$/,                         // blank
    /^\s*\/\//,                      // single-line comment
    /^\s*\/\*/,                      // block comment open
    /^\s*\*/,                        // block comment body/close
    /^\s*import\s/,                  // import statement
    /^\s*export\s*\{/,              // re-export brace
    /^\s*\}\s*$/,                    // lone closing brace
    /^\s*\)\s*;?\s*$/,              // lone closing paren
    /^\s*<\/?\w+\s*\/?>?\s*$/,      // bare HTML open/close tag
  ],

  /** If true, print warnings but still exit 0. Set via --warn-only flag. */
  WARN_ONLY: process.argv.includes('--warn-only'),

  /** If true, emit machine-readable JSON instead of human text. */
  JSON_OUTPUT: process.argv.includes('--json'),

  /** If true, skip the check entirely (CI escape hatch). */
  SKIP: process.env.SKIP_DRY_CHECK === '1',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ROOT = fileURLToPath(new URL('..', import.meta.url));

function rel(p) {
  return relative(ROOT, p);
}

/** Normalise a source line to a comparable token string. */
function normaliseLine(line) {
  return line
    .trim()
    .replace(/\s+/g, ' ')        // collapse whitespace
    .replace(/'[^']*'/g, "'_'")  // string literals
    .replace(/"[^"]*"/g, '"_"')  // string literals
    .replace(/`[^`]*`/g, '`_`') // template literals
    .toLowerCase();
}

/** Return true when a normalised line carries no meaningful signal. */
function isNoise(raw) {
  return CONFIG.NOISE_PATTERNS.some((re) => re.test(raw));
}

/** Tokenise a normalised line into a Set of word-level tokens. */
function tokenise(normLine) {
  return new Set(normLine.split(/[\s,;:(){}[\]<>/=+\-*!&|^~.]+/).filter(Boolean));
}

/** Jaccard similarity between two Sets. */
function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const t of a) if (b.has(t)) intersection++;
  return intersection / (a.size + b.size - intersection);
}

// ---------------------------------------------------------------------------
// Catalogue builder
// ---------------------------------------------------------------------------

/**
 * Walk CATALOGUE_DIRS and return a Map<relPath, Set<normLine>> for every
 * eligible source file.
 */
function buildCatalogue(stagedPaths) {
  const stagedSet = new Set(stagedPaths);
  const catalogue = new Map();

  function walk(dir) {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return; // dir doesn't exist yet — skip silently
    }

    for (const name of entries) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
      } else if (CONFIG.EXTENSIONS.has(extname(name))) {
        const relPath = rel(full);
        if (stagedSet.has(relPath)) continue; // skip files being committed

        let src;
        try {
          src = readFileSync(full, 'utf8');
        } catch {
          continue;
        }

        const lines = new Set(
          src
            .split('\n')
            .map(normaliseLine)
            .filter((l) => l.length > 0 && !isNoise(l)),
        );

        if (lines.size > 0) catalogue.set(relPath, lines);
      }
    }
  }

  for (const d of CONFIG.CATALOGUE_DIRS) walk(join(ROOT, d));
  return catalogue;
}

// ---------------------------------------------------------------------------
// Diff parser
// ---------------------------------------------------------------------------

/**
 * Return the raw git diff for staged changes, restricted to source files.
 */
function getStagedDiff() {
  try {
    return execSync('git diff --cached --unified=0', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch {
    return '';
  }
}

/**
 * Parse a unified diff and return an array of:
 *   { file: string, chunks: string[][] }
 *
 * Each chunk is a list of consecutive added raw lines.
 */
function parseDiff(diff) {
  const results = [];
  let currentFile = null;
  let currentChunk = [];

  function flushChunk() {
    if (currentFile && currentChunk.length >= CONFIG.MIN_CHUNK_LINES) {
      let entry = results.find((r) => r.file === currentFile);
      if (!entry) {
        entry = { file: currentFile, chunks: [] };
        results.push(entry);
      }
      entry.chunks.push([...currentChunk]);
    }
    currentChunk = [];
  }

  for (const line of diff.split('\n')) {
    if (line.startsWith('diff --git')) {
      flushChunk();
      currentFile = null;
      continue;
    }

    if (line.startsWith('+++ b/')) {
      flushChunk();
      const filePath = line.slice(6);
      currentFile = CONFIG.EXTENSIONS.has(extname(filePath)) ? filePath : null;
      continue;
    }

    if (!currentFile) continue;

    if (line.startsWith('@@')) {
      flushChunk();
      continue;
    }

    if (line.startsWith('+')) {
      const raw = line.slice(1); // strip leading '+'
      if (!isNoise(raw)) currentChunk.push(raw);
    } else if (!line.startsWith('-')) {
      // context line — treat as a break
      flushChunk();
    }
  }

  flushChunk();
  return results;
}

// ---------------------------------------------------------------------------
// DRY analyser
// ---------------------------------------------------------------------------

/**
 * Score a chunk (string[]) against one catalogue file's line set.
 * Returns a Jaccard similarity [0–1].
 */
function scoreChunkAgainstFile(chunk, fileLineSet) {
  // Build a union token set for the chunk
  const chunkTokens = new Set();
  for (const line of chunk) {
    const norm = normaliseLine(line);
    if (!isNoise(norm)) for (const t of tokenise(norm)) chunkTokens.add(t);
  }

  // Build a union token set for the catalogue file (flatten the line Set)
  const fileTokens = new Set();
  for (const normLine of fileLineSet) for (const t of tokenise(normLine)) fileTokens.add(t);

  return jaccard(chunkTokens, fileTokens);
}

/**
 * Run the DRY check.
 * Returns an array of violation objects:
 *   { changedFile, chunkIndex, chunkPreview, similarFile, score }
 */
function analyse(diffEntries, catalogue) {
  const violations = [];

  for (const { file, chunks } of diffEntries) {
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      let best = { score: 0, similarFile: null };

      for (const [catFile, catLines] of catalogue) {
        // Skip files in the same logical component folder
        if (catFile.startsWith(file.replace(/\/[^/]+$/, '/'))) continue;

        const score = scoreChunkAgainstFile(chunk, catLines);
        if (score > best.score) best = { score, similarFile: catFile };
      }

      if (best.score >= CONFIG.SIMILARITY_THRESHOLD) {
        violations.push({
          changedFile: file,
          chunkIndex: i + 1,
          chunkPreview: chunk.slice(0, 5).join('\n'),
          similarFile: best.similarFile,
          score: Math.round(best.score * 100),
        });
      }
    }
  }

  return violations;
}

// ---------------------------------------------------------------------------
// Reporter
// ---------------------------------------------------------------------------

const BOLD  = '\x1b[1m';
const RESET = '\x1b[0m';
const RED   = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN  = '\x1b[36m';
const DIM   = '\x1b[2m';

function report(violations) {
  if (CONFIG.JSON_OUTPUT) {
    process.stdout.write(JSON.stringify({ violations }, null, 2) + '\n');
    return;
  }

  if (violations.length === 0) {
    console.log('✔  DRY check passed — no duplicate code patterns detected.');
    return;
  }

  const prefix = CONFIG.WARN_ONLY ? `${YELLOW}⚠  DRY Warning` : `${RED}✖  DRY Violation`;

  console.log(`\n${BOLD}${prefix}${RESET} — ${violations.length} potential duplicate(s) found.\n`);

  for (const v of violations) {
    console.log(`  ${CYAN}${BOLD}${v.changedFile}${RESET} (chunk ${v.chunkIndex})`);
    console.log(`  ${DIM}Similar to (${v.score}% match):${RESET} ${v.similarFile}`);
    console.log(`  ${DIM}Added code preview:${RESET}`);
    for (const line of v.chunkPreview.split('\n')) {
      console.log(`    ${DIM}${line}${RESET}`);
    }
    console.log();
  }

  console.log(`${DIM}If the similarity is intentional, re-run with SKIP_DRY_CHECK=1 git commit ...${RESET}`);
  console.log(`${DIM}If it should be extracted, consider creating a shared component or composable.${RESET}\n`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

if (CONFIG.SKIP) {
  console.log('ℹ  DRY check skipped (SKIP_DRY_CHECK=1).');
  process.exit(0);
}

const rawDiff = getStagedDiff();

if (!rawDiff.trim()) {
  console.log('ℹ  DRY check: no staged changes detected.');
  process.exit(0);
}

const diffEntries = parseDiff(rawDiff);
const stagedPaths = diffEntries.map((e) => e.file);

if (stagedPaths.length === 0) {
  console.log('ℹ  DRY check: no eligible staged source files.');
  process.exit(0);
}

const catalogue = buildCatalogue(stagedPaths);
const violations = analyse(diffEntries, catalogue);

report(violations);

if (violations.length > 0 && !CONFIG.WARN_ONLY) {
  process.exit(1);
}

