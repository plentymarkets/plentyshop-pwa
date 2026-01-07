/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{json,css,scss,md}': (filenames) => `prettier --write ${filenames.join(' ')}`,
  '*.{ts,vue}': [
    (filenames) => `prettier --write ${filenames.join(' ')}`,
    (filenames) => `eslint --max-warnings 0 --fix ${filenames.join(' ')}`,
    // TODO: enable vitest on changed test files after improving performance
    // (filenames) => `vitest related ${filenames.join(' ')}`,
  ],
};