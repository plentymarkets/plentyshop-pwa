import { defineVitestConfig } from '@nuxt/test-utils/config';
import { coverageConfigDefaults } from 'vitest/config';

const silenceLogsFromSuspenseComponent = (log: string): boolean => {
  return log.includes('<Suspense');
};

export default defineVitestConfig({
  test: {
    coverage: {
      reporter: ['text', 'html', 'json-summary', 'json'],
      exclude: [...coverageConfigDefaults.exclude, 'assets/**', 'build/**'],
      reportOnFailure: true,
    },
    testTimeout: 6000,
    environment: 'nuxt',
    globals: true,
    clearMocks: true,
    setupFiles: './vitest.config.setup.ts',
    include: ['**/*/?(*.)+(spec|test).[jt]s'],
    onConsoleLog: (log: string): boolean | undefined => {
      if (silenceLogsFromSuspenseComponent(log)) {
        return false;
      }
    },
  },
  optimizeDeps: {
    include: ['mitt', '@vue-storefront/sdk', 'axios', '@plentymarkets/shop-api'],
  },
  build: {
    rollupOptions: {
      external: ['mitt', '@vue-storefront/sdk', 'axios', '@plentymarkets/shop-api'],
    },
  },
  server: {
    fs: {
      strict: false,
      allow: [
        '/Users/cristi/workspace/plentymarkets-sdk', // Allow local SDK package
        '/Users/cristi/workspace/plentyshop-pwa', // Allow your Nuxt project
        '/Users/cristi/workspace/shop-core', // Allow shop-core package
      ],
    },
  },
});
