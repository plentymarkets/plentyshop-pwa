import { defineVitestConfig } from 'nuxt-vitest/config';

export default defineVitestConfig({
  test: {
    coverage: {
      reporter: ['text', 'html', 'json-summary', 'json'],
    },
    environment: 'nuxt',
    globals: true,
    setupFiles: './vue-test-utils.extend.js',
    include: ['**/*/?(*.)+(spec|test).[jt]s'],
  },
});
