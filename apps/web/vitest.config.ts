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
});
