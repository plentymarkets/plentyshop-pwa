#!/usr/bin/env node
/**
 * Z-index layer report
 *
 * Scans all Vue files in apps/web/ and packages/ and prints
 * a table of every z-index token, grouped by layer, showing which components use it.
 *
 * Usage:
 *   node scripts/zindex-codemod/report.mjs [options]
 *
 * Options:
 *   --by-file       Invert the view: show each file with all its z-tokens
 *   --token <name>  Filter to a single token (e.g. --token z-modal)
 *   --no-color      Disable ANSI colors
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── CLI flags ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const BY_FILE = args.includes('--by-file');
const NO_COLOR = args.includes('--no-color') || !process.stdout.isTTY;
const TOKEN_FILTER = (() => {
  const idx = args.indexOf('--token');
  return idx !== -1 ? args[idx + 1] : null;
})();

// ─── ANSI helpers ─────────────────────────────────────────────────────────────

const C = NO_COLOR
  ? { reset: '', bold: '', dim: '', cyan: '', yellow: '', green: '', magenta: '', red: '', blue: '', gray: '' }
  : {
      reset:   '\x1b[0m',
      bold:    '\x1b[1m',
      dim:     '\x1b[2m',
      cyan:    '\x1b[36m',
      yellow:  '\x1b[33m',
      green:   '\x1b[32m',
      magenta: '\x1b[35m',
      red:     '\x1b[31m',
      blue:    '\x1b[34m',
      gray:    '\x1b[90m',
    };

// ─── Z-index scale (ordered by numeric value) ────────────────────────────────

/** @type {Array<{ token: string; value: number; role: string; color: string }>} */
const SCALE = [
  { token: 'z-base',           value: 0,    role: 'Default / grounded',           color: C.gray    },
  { token: 'z-raised',         value: 1,    role: 'Slightly above base',           color: C.gray    },
  { token: 'z-overlap',        value: 2,    role: 'Badges, breadcrumbs, arrows',   color: C.gray    },
  { token: 'z-editor-drawer',  value: 10,  role: 'Site configuration drawer',     color: C.blue    },
  { token: 'z-editor-inline',  value: 30,   role: 'Editor inline chrome',          color: C.blue    },
  { token: 'z-sticky',         value: 40,   role: 'Sticky headers / nav',          color: C.green   },
  { token: 'z-dropdown',       value: 50,   role: 'Dropdowns, tooltips',           color: C.green   },
  { token: 'z-notifications',  value: 60,   role: 'Notification strip',            color: C.green   },
  { token: 'z-drawer-backdrop',value: 70,   role: 'Drawer / mobile overlay backdrop', color: C.yellow  },
  { token: 'z-drawer',         value: 80,   role: 'Slide-in navigation drawer',    color: C.yellow  },
  { token: 'z-cookiebar',      value: 90,   role: 'Cookie consent bar',            color: C.yellow  },
  { token: 'z-editor-toolbar', value: 100,  role: 'Settings toolbar (editor)',     color: C.blue    },
  { token: 'z-modal-backdrop', value: 200,  role: 'Modal backdrop overlay',        color: C.magenta },
  { token: 'z-modal',          value: 210,  role: 'Modal panel',                   color: C.magenta },
  { token: 'z-popover',        value: 220,  role: 'Popovers, RichText menus',      color: C.magenta },
  { token: 'z-loader',         value: 300,  role: 'Page-blocking spinners',        color: C.cyan    },
  { token: 'z-picker',         value: 400,  role: 'Color / emoji pickers',         color: C.cyan    },
  { token: 'z-toast',          value: 500,  role: 'Toasts invoked inside modals',  color: C.cyan    },
  { token: 'z-max',            value: 9999, role: 'Escape hatch (use sparingly)',  color: C.red     },
];

const TOKEN_SET = new Set(SCALE.map((s) => s.token));

// ─── Scanning ─────────────────────────────────────────────────────────────────

const ROOT = new URL('../../', import.meta.url);
const SEARCH_DIRS = [
  fileURLToPath(new URL('apps/web', ROOT)),
  fileURLToPath(new URL('packages', ROOT)),
];

/** Regex: match all z-* class tokens (with optional responsive/variant prefixes and ! important) */
const TOKEN_RE = /(?:[@!]?[\w-]+:)*!?z-[a-z][\w-]*/g;

/**
 * @typedef {{ token: string; line: number; context: string }} Hit
 * @typedef {{ file: string; hits: Hit[] }} FileHits
 */

/** @type {Map<string, FileHits[]>} token → [{ file, hits }] */
const byToken = new Map(SCALE.map((s) => [s.token, []]));

/** @type {Map<string, Map<string, Hit[]>>} file → token → hits */
const byFile = new Map();

let totalFiles = 0;
let totalHits = 0;

function* walkVue(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (!entry.startsWith('.') && !['node_modules', '__tests__', 'coverage', 'cypress', 'build', 'dist', 'lib'].includes(entry)) {
        yield* walkVue(full);
      }
    } else if (entry.endsWith('.vue')) {
      yield full;
    }
  }
}

for (const dir of SEARCH_DIRS) {
  for (const absPath of walkVue(dir)) {
    const rel = relative(fileURLToPath(ROOT), absPath);
    const src = readFileSync(absPath, 'utf8');
    const lines = src.split('\n');

    /** @type {Map<string, Hit[]>} */
    const fileTokens = new Map();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      TOKEN_RE.lastIndex = 0;
      let m;
      while ((m = TOKEN_RE.exec(line)) !== null) {
        // Strip all prefixes (responsive, variant, !) to get the bare token
        const raw = m[0];
        const withoutBang = raw.startsWith('!') ? raw.slice(1) : raw;
        const colonIdx = withoutBang.lastIndexOf(':');
        const bare = colonIdx === -1 ? withoutBang : withoutBang.slice(colonIdx + 1);

        if (!TOKEN_SET.has(bare)) continue;

        if (!fileTokens.has(bare)) fileTokens.set(bare, []);
        fileTokens.get(bare).push({ token: raw, line: i + 1, context: line.trim() });
        totalHits++;
      }
    }

    if (fileTokens.size === 0) continue;
    totalFiles++;

    for (const [token, hits] of fileTokens) {
      byToken.get(token)?.push({ file: rel, hits });
    }
    byFile.set(rel, fileTokens);
  }
}

// ─── Rendering helpers ────────────────────────────────────────────────────────

function shorten(path) {
  // Remove the long apps/web/app/ prefix to keep lines compact
  return path
    .replace(/^apps\/web\/app\/components\//, '')
    .replace(/^apps\/web\/app\//, '')
    .replace(/^apps\/web\/modules\//, 'modules/');
}

const TERM_WIDTH = process.stdout.columns ?? 120;

function ruler(char = '─', width = TERM_WIDTH) {
  return char.repeat(Math.min(width, TERM_WIDTH));
}

function pad(str, width) {
  const visible = str.replace(/\x1b\[[0-9;]*m/g, '');
  return str + ' '.repeat(Math.max(0, width - visible.length));
}

// ─── By-layer view (default) ─────────────────────────────────────────────────

function printByLayer() {
  console.log();
  console.log(`${C.bold}Z-INDEX LAYER REPORT${C.reset}  ${C.dim}${totalHits} usages across ${totalFiles} files${C.reset}`);
  console.log(ruler('═'));
  console.log();

  const filtered = TOKEN_FILTER
    ? SCALE.filter((s) => s.token === TOKEN_FILTER)
    : SCALE;

  if (TOKEN_FILTER && filtered.length === 0) {
    console.error(`Unknown token: ${TOKEN_FILTER}`);
    process.exit(1);
  }

  for (const { token, value, role, color } of filtered) {
    const usages = byToken.get(token) ?? [];
    const fileCount = usages.length;
    const hitCount = usages.reduce((n, f) => n + f.hits.length, 0);

    const badge = `  ${value.toString().padStart(4)}  `;
    const header = `${color}${C.bold}${pad(token, 22)}${C.reset}${C.dim}${badge}${C.reset}${role}`;
    const countStr = fileCount === 0
      ? `${C.dim}(unused)${C.reset}`
      : `${C.dim}${hitCount} hit${hitCount !== 1 ? 's' : ''} in ${fileCount} file${fileCount !== 1 ? 's' : ''}${C.reset}`;

    console.log(`${header}  ${countStr}`);

    if (fileCount === 0) {
      console.log();
      continue;
    }

    console.log(ruler('─'));

    for (const { file, hits } of usages) {
      const short = shorten(file);
      const lines = hits.map((h) => h.line).join(', ');
      // Show the raw token variants used (e.g. @md:z-sticky, !z-loader …)
      const variants = [...new Set(hits.map((h) => h.token))];
      const variantStr = variants.length > 1 || variants[0] !== token
        ? `  ${C.dim}[${variants.join(', ')}]${C.reset}`
        : '';
      console.log(`  ${C.cyan}${pad(short, 58)}${C.reset}${C.dim}L${lines}${C.reset}${variantStr}`);
    }

    console.log();
  }

  console.log(ruler('═'));
  console.log(`${C.dim}${totalHits} total usages  ·  ${totalFiles} files  ·  tokens defined in apps/web/app/configuration/tailwind.config.ts${C.reset}`);
  console.log();
}

// ─── By-file view ─────────────────────────────────────────────────────────────

function printByFile() {
  const files = [...byFile.keys()].sort();

  console.log();
  console.log(`${C.bold}Z-INDEX LAYER REPORT  (by file)${C.reset}  ${C.dim}${totalHits} usages across ${totalFiles} files${C.reset}`);
  console.log(ruler('═'));
  console.log();

  const filtered = TOKEN_FILTER
    ? files.filter((f) => byFile.get(f)?.has(TOKEN_FILTER))
    : files;

  for (const file of filtered) {
    const tokenMap = byFile.get(file);
    if (!tokenMap) continue;

    const short = shorten(file);
    console.log(`${C.bold}${C.cyan}${short}${C.reset}`);
    console.log(ruler('─', short.length + 2));

    for (const { token, value, color } of SCALE) {
      if (TOKEN_FILTER && token !== TOKEN_FILTER) continue;
      const hits = tokenMap.get(token);
      if (!hits) continue;

      const lines = hits.map((h) => h.line).join(', ');
      const variants = [...new Set(hits.map((h) => h.token))];
      const variantStr = variants.length > 1 || variants[0] !== token
        ? `${C.dim}  [${variants.join(', ')}]${C.reset}`
        : '';
      const valueStr = `${C.dim}(${value})${C.reset}`;
      console.log(`  ${color}${pad(token, 22)}${C.reset} ${valueStr}  ${C.dim}L${lines}${C.reset}${variantStr}`);
    }
    console.log();
  }

  console.log(ruler('═'));
  console.log(`${C.dim}${totalHits} total usages  ·  ${totalFiles} files${C.reset}`);
  console.log();
}

// ─── Run ─────────────────────────────────────────────────────────────────────

if (BY_FILE) {
  printByFile();
} else {
  printByLayer();
}
