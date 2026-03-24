/**
 * prepare-vue-tsc.js — workaround for vite-plugin-checker + vue-tsc compatibility
 *
 * Problem:
 * Nuxt 4.4.x uses `vite-plugin-checker` to run vue-tsc type-checking during dev.
 * The checker plugin ships its own bundled copy of TypeScript at
 *   node_modules/vite-plugin-checker/dist/checkers/vueTsc/typescript-vue-tsc/
 * which can drift out of sync with the workspace's actual TypeScript version.
 * When the versions diverge, vue-tsc produces spurious type errors or crashes
 * because its Volar proxy expects the same TS API surface it was compiled against.
 *
 * Fix:
 * Replace the checker's bundled TypeScript directory with a copy of the
 * workspace-installed TypeScript and write a `vue-tsc-resolve-path` pointer so
 * the checker can locate Volar's `proxyCreateProgram` entry point.
 *
 * Lifecycle:
 * Registered as the `predev` npm script in the root package.json, so it runs
 * automatically before every `npm run dev`. A `.ts-version-stamp` marker file
 * inside the destination directory is used to skip redundant copies when the
 * installed TypeScript version has not changed (see version-check below).
 *
 * Removal:
 * This workaround should be removed once vite-plugin-checker natively supports
 * the TypeScript version used by this project (track upstream:
 * https://github.com/fi3ework/vite-plugin-checker/issues). After removal,
 * also delete the `predev` script entry in the root package.json.
 */
const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..')

const dir = path.join(root, 'node_modules/vite-plugin-checker/dist/checkers/vueTsc/typescript-vue-tsc')
const src = path.join(root, 'node_modules/typescript')

if (!fs.existsSync(src)) {
    console.warn('[prepare-vue-tsc] TypeScript not found at', src)
    process.exit(0)
}

// --- Short-circuit: skip work when the installed TS version already matches ---
const marker = path.join(dir, '.ts-version-stamp')
const installedVersion = require(path.join(src, 'package.json')).version

if (fs.existsSync(marker)) {
    const stampedVersion = fs.readFileSync(marker, 'utf8').trim()
    if (stampedVersion === installedVersion) {
        console.log(`[prepare-vue-tsc] Already up-to-date (TypeScript ${installedVersion}), skipping.`)
        process.exit(0)
    }
}

// --- Version mismatch or first run: rebuild the directory ---
console.log(`[prepare-vue-tsc] Copying TypeScript ${installedVersion} into vite-plugin-checker …`)
fs.rmSync(dir, { recursive: true, force: true })
fs.cpSync(src, dir, { recursive: true })

// Write the version stamp so subsequent runs can skip
fs.writeFileSync(marker, installedVersion)

const vueTscDir = path.dirname(require.resolve('vue-tsc/package.json'))
const proxyApi = require.resolve('@volar/typescript/lib/node/proxyCreateProgram', { paths: [vueTscDir] })
fs.writeFileSync(path.join(dir, 'vue-tsc-resolve-path'), proxyApi)

console.log('[prepare-vue-tsc] Done')