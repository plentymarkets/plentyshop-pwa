import fs from 'fs'
import path from 'path'
import { describe, it, expect } from 'vitest'

// apps/web/composables/index.test.ts
// We recommend installing an extension to run vitest tests.


describe('composables index exports', () => {
    const dir = path.resolve(__dirname, '..')
    const indexPath = path.join(dir, 'index.ts')
    const indexContent = fs.readFileSync(indexPath, 'utf-8')

    // Extract exported modules from index.ts
    const exportedModules = Array.from(
        indexContent.matchAll(/export \* from '\.\/(.*?)';/g)
    ).map((match) => match[1])

    // Find all use files in the folder (excluding tests)
    const fileModules = fs
        .readdirSync(dir)
        .filter((file) => /^use.*$/.test(file))
        .map((file) => file.replace(/\.ts$/, ''))

    fileModules.push('defaults');

    console.log(exportedModules.sort());
    console.log(fileModules.sort());


    it('should export every use* composable file', () => {
        expect(exportedModules.sort()).toEqual(fileModules.sort())
    })
})