const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..')

const dir = path.join(root, 'node_modules/vite-plugin-checker/dist/checkers/vueTsc/typescript-vue-tsc')
const src = path.join(root, 'node_modules/typescript')

if (!fs.existsSync(src)) {
    console.warn('[prepare-vue-tsc] TypeScript not found at', src)
    process.exit(0)
}

fs.rmSync(dir, { recursive: true, force: true })
fs.cpSync(src, dir, { recursive: true })

const vueTscDir = path.dirname(require.resolve('vue-tsc/package.json'))
const proxyApi = require.resolve('@volar/typescript/lib/node/proxyCreateProgram', { paths: [vueTscDir] })
fs.writeFileSync(path.join(dir, 'vue-tsc-resolve-path'), proxyApi)

console.log('[prepare-vue-tsc] Done')