/**
 * prepare-vue-tsc.js — predev workaround for vite-plugin-checker on Node 24.
 *
 * Problem:
 * vite-plugin-checker's prepareVueTsc() performs an async rm()+cp() during Vite
 * server startup. On Node 24 / macOS this races and fails with ENOTEMPTY, leaving
 * the TypeScript copy incomplete and crashing the vueTsc checker worker.
 *
 * Fix:
 * Replicate the full prepareVueTsc() work synchronously here before dev starts:
 *   1. Copy workspace TypeScript into typescript-vue-tsc/
 *   2. Patch lib/typescript.js to support .vue extensions (overrideTscJs logic)
 *   3. Write the vue-tsc-resolve-path flag file
 *
 * When prepareVueTsc() then runs inside Vite, it finds the directory + flag +
 * version matching → sets shouldBuildFixture=false → skips its rm/cp entirely.
 */
const path = require('node:path');
const fs = require('node:fs');

const root = path.resolve(__dirname, '..');
const checkerDir = path.join(root, 'node_modules/vite-plugin-checker/dist/checkers/vueTsc');
const dir = path.join(checkerDir, 'typescript-vue-tsc');
const src = path.join(root, 'node_modules/typescript');

if (!fs.existsSync(src)) {
  console.warn('[prepare-vue-tsc] TypeScript not found, skipping.');
  process.exit(0);
}

const vueTscDir = path.dirname(require.resolve('vue-tsc/package.json', { paths: [root] }));
const proxyApiPath = require.resolve('@volar/typescript/lib/node/proxyCreateProgram', { paths: [vueTscDir] });
const languagePluginsFile = path.resolve(checkerDir, 'languagePlugins.cjs');
const flagFile = path.join(dir, 'vue-tsc-resolve-path');
const installedVersion = require(path.join(src, 'package.json')).version;

if (fs.existsSync(flagFile) && fs.existsSync(path.join(dir, 'package.json'))) {
  try {
    const existingVersion = require(path.join(dir, 'package.json')).version;
    const flagContent = fs.readFileSync(flagFile, 'utf8');
    if (existingVersion === installedVersion && flagContent === proxyApiPath) {
      console.log(`[prepare-vue-tsc] Already up-to-date (TypeScript ${installedVersion}), skipping.`);
      process.exit(0);
    }
  } catch {
    /* fall through to rebuild */
  }
}

console.log(`[prepare-vue-tsc] Copying TypeScript ${installedVersion} into vite-plugin-checker…`);
fs.rmSync(dir, { recursive: true, force: true });
fs.cpSync(src, dir, { recursive: true });

// Patch lib/typescript.js to support .vue extensions
// (replicates overrideTscJs() from vite-plugin-checker/dist/checkers/vueTsc/prepareVueTsc.js)
const tscJsPath = path.join(dir, 'lib/typescript.js');
let tsc = fs.readFileSync(tscJsPath, 'utf8');

function replace(text, search, replaceFn) {
  const result = text.replace(search, replaceFn);
  if (result === text) throw new Error(`[prepare-vue-tsc] Pattern not found: ${search}`);
  return result;
}

const extsText = '".vue"';
tsc = replace(
  tsc,
  /supportedTSExtensions = .*(?=;)/,
  (s) => s + `.map((group, i) => i === 0 ? group.splice(0, 0, ${extsText}) && group : group)`,
);
tsc = replace(
  tsc,
  /supportedJSExtensions = .*(?=;)/,
  (s) => s + `.map((group, i) => i === 0 ? group.splice(0, 0, ${extsText}) && group : group)`,
);
tsc = replace(
  tsc,
  /allSupportedExtensions = .*(?=;)/,
  (s) => s + `.map((group, i) => i === 0 ? group.splice(0, 0, ${extsText}) && group : group)`,
);
tsc = replace(
  tsc,
  /function changeExtension\(/,
  (s) =>
    'function changeExtension(path, newExtension) {\n' +
    '                                        return [".vue"].some(ext => path.endsWith(ext))\n' +
    '                                                ? path + newExtension\n' +
    '                                                : _changeExtension(path, newExtension)\n' +
    '                                        }\n' +
    s.replace('changeExtension', '_changeExtension'),
);
tsc = replace(
  tsc,
  /function createProgram\(.+\) {/,
  (s) =>
    'var createProgram = require(' +
    JSON.stringify(proxyApiPath) +
    ').proxyCreateProgram(' +
    'new Proxy({}, { get(_target, p, _receiver) { return eval(p); } } ), ' +
    '_createProgram, ' +
    'require(' +
    JSON.stringify(languagePluginsFile) +
    ').getLanguagePlugins);\n' +
    s.replace('createProgram', '_createProgram'),
);

fs.writeFileSync(tscJsPath, tsc);

// Write the flag — prepareVueTsc() checks this to skip its own rm/cp/patch
fs.writeFileSync(flagFile, proxyApiPath);

console.log('[prepare-vue-tsc] Done.');
