import { describe, expect, it } from 'vitest';
import { extractImports, getPackageName, shouldSkip, isCovered } from '../../../build/check-optimize-deps';

describe('getPackageName', () => {
  it('should return a scoped package name without modification', () => {
    expect(getPackageName('@scope/package')).toBe('@scope/package');
  });

  it('should strip the sub-path from a scoped package and return only the scope and name', () => {
    expect(getPackageName('@scope/package/sub/path')).toBe('@scope/package');
  });

  it('should return a bare package name without modification', () => {
    expect(getPackageName('uuid')).toBe('uuid');
  });

  it('should strip the sub-path from a bare package and return only the package name', () => {
    expect(getPackageName('lodash/fp')).toBe('lodash');
  });
});

describe('extractImports', () => {
  it('should extract the package from a named import statement', () => {
    expect(extractImports("import { foo } from 'bar';")).toContain('bar');
  });

  it('should extract the package from a default import statement', () => {
    expect(extractImports("import foo from 'bar';")).toContain('bar');
  });

  it('should not extract packages from type-only import statements', () => {
    expect(extractImports("import type { Foo } from 'bar';")).not.toContain('bar');
  });

  it('should extract the package from a dynamic import expression', () => {
    expect(extractImports("const x = import('foo');")).toContain('foo');
  });

  it('should extract the package from a side-effect import statement', () => {
    expect(extractImports("import 'some-polyfill';")).toContain('some-polyfill');
  });

  it('should not extract packages from single-line commented-out dynamic imports', () => {
    expect(extractImports("// const x = import('commented-lib');")).not.toContain('commented-lib');
  });

  it('should not extract packages from block-commented-out imports', () => {
    expect(extractImports("/* import('commented-lib') */")).not.toContain('commented-lib');
  });

  it('should extract all packages when content contains multiple import statements', () => {
    const content = `
      import { a } from 'pkg-a';
      import b from 'pkg-b';
      import 'pkg-c';
    `;
    const result = extractImports(content);
    expect(result).toContain('pkg-a');
    expect(result).toContain('pkg-b');
    expect(result).toContain('pkg-c');
  });
});

describe('shouldSkip', () => {
  it('should skip same-directory relative imports', () => {
    expect(shouldSkip('./utils')).toBe(true);
  });

  it('should skip parent-directory relative imports', () => {
    expect(shouldSkip('../composables/foo')).toBe(true);
  });

  it('should skip Node.js built-in file system imports', () => {
    expect(shouldSkip('node:fs')).toBe(true);
  });

  it('should skip Node.js built-in path imports', () => {
    expect(shouldSkip('node:path')).toBe(true);
  });

  it('should skip Nuxt core packages', () => {
    expect(shouldSkip('@nuxt/image')).toBe(true);
  });

  it('should skip Nuxt community packages', () => {
    expect(shouldSkip('@nuxtjs/i18n')).toBe(true);
  });

  it('should skip hash alias imports', () => {
    expect(shouldSkip('#imports')).toBe(true);
  });

  it('should skip tilde path alias imports', () => {
    expect(shouldSkip('~/utils/foo')).toBe(true);
  });

  it('should skip at-sign path alias imports', () => {
    expect(shouldSkip('@/components/Foo.vue')).toBe(true);
  });

  it('should skip vue as a known framework package', () => {
    expect(shouldSkip('vue')).toBe(true);
  });

  it('should skip vue-router as a known framework package', () => {
    expect(shouldSkip('vue-router')).toBe(true);
  });

  it('should skip pinia as a known framework package', () => {
    expect(shouldSkip('pinia')).toBe(true);
  });

  it('should skip fs as a Node.js built-in module', () => {
    expect(shouldSkip('fs')).toBe(true);
  });

  it('should skip path as a Node.js built-in module', () => {
    expect(shouldSkip('path')).toBe(true);
  });

  it('should not skip regular third-party packages like uuid', () => {
    expect(shouldSkip('uuid')).toBe(false);
  });

  it('should not skip scoped third-party packages like @tiptap/core', () => {
    expect(shouldSkip('@tiptap/core')).toBe(false);
  });

  it('should skip css style imports', () => {
    expect(shouldSkip('some-lib/dist/style.css')).toBe(true);
  });

  it('should skip scss style imports', () => {
    expect(shouldSkip('some-lib/dist/theme.scss')).toBe(true);
  });
});

describe('isCovered', () => {
  it('should treat the import as covered when it exactly matches an entry in the include list', () => {
    expect(isCovered('uuid', ['uuid', 'yup'])).toBe(true);
  });

  it('should not treat a sub-path import as covered when only the package root is listed', () => {
    expect(isCovered('uuid/v4', ['uuid'])).toBe(false);
  });

  it('should treat a sub-path import as covered when the full path is listed exactly', () => {
    expect(isCovered('vuedraggable/src/vuedraggable', ['vuedraggable/src/vuedraggable'])).toBe(true);
  });

  it('should not treat an import as covered when the package is not in the include list', () => {
    expect(isCovered('fake-package', ['uuid', 'yup'])).toBe(false);
  });

  it('should not treat any import as covered when the include list is empty', () => {
    expect(isCovered('uuid', [])).toBe(false);
  });
});
